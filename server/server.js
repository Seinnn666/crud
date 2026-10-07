const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve students" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const newStudent = new Student({ name, course, age });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add student" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, course, age },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    res.json(deletedStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

// Database Connection & Server Listener
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    // FIXED: Added backticks around the string for template literal
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;