const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/AuthRoutes");
const booksRoutes = require("./routes/BooksRoutes");
const borrowLogsRoutes = require("./routes/BorrowLogsRoutes");
const reservationsRoutes = require("./routes/ReservationsRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
    .connect("mongodb://localhost:27017/libhub")
    .then(() => {
        // Start server
        console.log("Connected to MongoDB successfully!");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error("MongoDB connection error:", err));

const corsHandler = cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true,
});

app.use(corsHandler);

// Routes 注册四大模块路由
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/borrows", borrowLogsRoutes);
app.use("/api/reservations", reservationsRoutes);