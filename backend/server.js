const axios = require("axios");
const qs = require("qs");

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { OpenAI } = require("openai");
require("dotenv").config({ path: "../.env" });

const app = express();
const port = 5000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function connectDB() {
  try {
    await client.connect();
    db = client.db("quickclinic");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

app.use(express.json());
app.use(cors());

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ================================
// API ENDPOINTS
// ================================

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is live, bro!" });
});

// Create patient
app.post("/api/users", async (req, res) => {
  try {
    const { uid, email } = req.body;
    await db.collection("users").insertOne({ uid, email, role: "patient" });
    res.status(201).json({ message: "Patient created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user role
app.get("/api/users/:uid", async (req, res) => {
  try {
    const user = await db.collection("users").findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctor by ID
app.get("/api/doctor/:id", async (req, res) => {
  try {
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(req.params.id) });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book appointment (NO Twilio SMS here)
app.post("/api/appointments", async (req, res) => {
  try {
    const { patientUid, doctorId, date, time } = req.body;

    if (!patientUid || !doctorId || !date || !time) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const appointment = {
      patientUid,
      doctorId: new ObjectId(doctorId),
      date,
      time,
      status: "pending",
    };

    const result = await db.collection("appointments").insertOne(appointment);
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(doctorId) });

    // ✅ Email only (no SMS here)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: doctor.email,
      subject: "New Appointment",
      text: `A patient booked an appointment on ${date} at ${time}.`,
    });

    res.status(201).json({ message: "Appointment booked", appointmentId: result.insertedId });
  } catch (error) {
    console.error("❌ Appointment booking error:", error.stack);
    res.status(500).json({ error: "Internal server error while booking." });
  }
});

// Upload prescription
app.post("/api/prescriptions", async (req, res) => {
  try {
    const { patientUid, fileUrl } = req.body;
    const result = await db.collection("prescriptions").insertOne({
      patientUid,
      fileUrl,
      date: new Date(),
    });
    res.status(201).json({ message: "Prescription uploaded", prescriptionId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Symptom Checker
app.post("/api/symptom-checker", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ error: "Symptoms are required" });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a medical AI. Suggest possible conditions based on symptoms." },
        { role: "user", content: `Symptoms: ${symptoms}` },
      ],
    });

    const diagnosis = response.choices?.[0]?.message?.content;
    res.status(200).json({ diagnosis });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate diagnosis." });
  }
});

// Suggest doctors using AI
app.post("/api/suggest-doctors", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ error: "Symptoms are required" });

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical AI assistant. Based on the user's symptoms, suggest a medical specialty.",
        },
        {
          role: "user",
          content: `What type of specialist should I see for: ${symptoms}`,
        },
      ],
    });

    const specialty = aiResponse.choices?.[0]?.message?.content.trim();
    const doctors = await db.collection("doctors").find({
      specialties: { $regex: specialty, $options: "i" },
    }).toArray();

    res.status(200).json({ suggestion: specialty, doctors });
  } catch (error) {
    res.status(500).json({ error: "AI suggestion failed." });
  }
});

// Doctor search
app.get("/api/search-doctors", async (req, res) => {
  try {
    const { query } = req.query;

    // ✅ Treat 'all' as load all
    if (!query || query.toLowerCase() === "all") {
      const allDoctors = await db.collection("doctors").find({}).toArray();
      return res.status(200).json(allDoctors);
    }

    const doctors = await db.collection("doctors")
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialties: { $regex: query, $options: "i" } }
        ]
      })
      .toArray();

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Doctor search error:", error);
    res.status(500).json({ error: error.message });
  }
});


// Add new doctor
app.post("/api/doctors", async (req, res) => {
  try {
    const { name, email, phone, specialties } = req.body;
    if (!name || !email || !phone || !specialties) {
      return res.status(400).json({ error: "All doctor fields are required" });
    }

    await db.collection("doctors").insertOne({ name, email, phone, specialties });
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Twilio Video Call Invite SMS
app.post("/api/start-voice-call", async (req, res) => {
  try {
    const { doctorPhone, patientUid } = req.body;
    const roomName = `QuickClinicRoom-${patientUid}`;
    const videoUrl = `http://localhost:3000/video-call?room=${roomName}`;

    const msg = await twilioClient.messages.create({
      body: `You have a video consultation. Join here: ${videoUrl}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: doctorPhone,
    });

    res.status(200).json({ message: "SMS sent to doctor", roomName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// ✅ Get appointments for a patient
app.get("/api/appointments/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const appointments = await db.collection("appointments").aggregate([
      { $match: { patientUid: uid } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      {
        $addFields: {
          doctorName: { $arrayElemAt: ["$doctorInfo.name", 0] }
        }
      },
      { $project: { doctorInfo: 0 } },
      { $sort: { date: -1 } } // 👈 latest first
    ]).toArray();

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/create-daily-meeting", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.daily.co/v1/rooms",
      {
        properties: {
          enable_chat: true,
          enable_screenshare: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ link: response.data.url });
  } catch (error) {
    console.error("❌ Daily API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create Daily meeting." });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  connectDB();
});
