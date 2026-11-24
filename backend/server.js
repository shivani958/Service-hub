const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// DATABASE MODELS

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  icon: String,
  image: String
});

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: String,
  email: String,
  phone: String,
  address: String,
  bookingDate: Date,
  services: [{ name: String, price: Number }],
  totalAmount: Number,
  status: { type: String, default: "Pending" }
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Service = mongoose.model("Service", serviceSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Contact = mongoose.model("Contact", contactSchema);

// DEFAULT SERVICES

const defaultServices = [
  {
    name: "Home Cleaning",
    description: "Professional home cleaning services.",
    price: 499,
    icon: "🧹",
    image: "/images/cleaning.jpg"
  },
  {
    name: "Plumbing",
    description: "Expert plumbing and repair services.",
    price: 299,
    icon: "🔧",
    image: "/images/plumber.jpg"
  },
  {
    name: "Electrical",
    description: "Safe and reliable electrical services.",
    price: 399,
    icon: "⚡",
    image: "/images/electrician.jpg"
  },
  {
    name: "AC Repair",
    description: "AC servicing and maintenance.",
    price: 599,
    icon: "❄️",
    image: "/images/ac-repair.jpg"
  }
];

// AUTHENTICATION

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// TEST ROUTES

app.get("/", (req, res) => {
  res.send("Welcome to ServiceHub Backend API");
});

app.get("/hello", (req, res) => {
  res.send("HELLO SERVICEHUB");
});

// SERVICES

app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REGISTER

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ message: "Enter all details and use a password of at least 8 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BOOKINGS

app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const {
      customerName, email, phone, address, bookingDate, serviceIds
    } = req.body;

    if (!customerName || !email || !phone || !address ||
        !bookingDate || !Array.isArray(serviceIds) || !serviceIds.length) {
      return res.status(400).json({ message: "Complete all booking details" });
    }

    const services = await Service.find({ _id: { $in: serviceIds } });

    if (services.length !== new Set(serviceIds).size) {
      return res.status(400).json({ message: "Invalid selected services" });
    }

    const selectedServices = services.map(s => ({
      name: s.name,
      price: s.price
    }));

    const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);

    const booking = await Booking.create({
      userId: req.user.id,
      customerName,
      email,
      phone,
      address,
      bookingDate,
      services: selectedServices,
      totalAmount
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CONTACT

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Complete all contact fields" });
    }

    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: "Message submitted", contactId: contact._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// START SERVER AFTER DATABASE CONNECTION

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");

    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(defaultServices);
      console.log("Default services added!");
    }

    app.listen(PORT, () => {
      console.log(`ServiceHub server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err.message);
  }
}

startServer();