const mongoose = require("mongoose");

const ReservationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
        required: true
    },
    reservedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Completed", "Cancelled"],
        default: "Active"
    }
});

const Reservation = mongoose.model("reservations", ReservationSchema);
module.exports = Reservation;