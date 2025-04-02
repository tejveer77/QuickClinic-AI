const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Add this line
require("dotenv").config({ path: "../.env.local" });

const app = express();
const port = 5000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("quickclinic");
    console.log("Database 'quickclinic' accessed successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.post("/api/users", async (req, res) => {
  try {
    const db = client.db("quickclinic");
    const usersCollection = db.collection("users");
    const { uid, email, role } = req.body;
    await usersCollection.insertOne({ uid, email, role });
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});