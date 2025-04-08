const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const nodemailer = require("nodemailer"); // For email reminders
require("dotenv").config({ path: "../.env.local" });

const app = express();
const port = 5000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("quickclinic");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

app.use(express.json());
app.use(cors());

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is live" });
});

// Create patient
app.post("/api/users", async (req, res) => {
  try {
    const usersCollection = db.collection("users");
    const { uid, email } = req.body;
    await usersCollection.insertOne({ uid, email, role: "patient" });
    res.status(201).json({ message: "Patient created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient
app.get("/api/users/:uid", async (req, res) => {
  try {
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor list 
app.get("/api/doctors", async (req, res) => {
  const { symptoms } = req.query;
  const doctorsCollection = db.collection("doctors");
  const doctors = await doctorsCollection
    .find({ specialties: { $regex: symptoms || "", $options: "i" } })
    .toArray();
  res.status(200).json(doctors);
});

// Book appointment
app.post("/api/appointments", async (req, res) => {
  try {
    const appointmentsCollection = db.collection("appointments");
    const { patientUid, doctorId, date, time } = req.body;
    const appointment = { patientUid, doctorId, date, time, status: "pending" };
    await appointmentsCollection.insertOne(appointment);

    // Send email reminder
    const doctor = await db.collection("doctors").findOne({ _id: doctorId });
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: doctor.email,
      subject: "New Appointment Scheduled",
      text: `Patient booked an appointment on ${date} at ${time}.`,
    });

    res.status(201).json({ message: "Appointment booked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload prescription
app.post("/api/prescriptions", async (req, res) => {
  try {
    const prescriptionsCollection = db.collection("prescriptions");
    const { patientUid, fileUrl } = req.body;
    await prescriptionsCollection.insertOne({ patientUid, fileUrl, date: new Date() });
    res.status(201).json({ message: "Prescription uploaded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});