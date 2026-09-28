const mongoose = require("mongoose");

const BorrowLogSchema = mongoose.Schema({
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
    borrowDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: Date,
    status: {
        type: String,
        enum: ["Borrowed", "Returned", "Overdue"],
        default: "Borrowed"
    }
});

const BorrowLog = mongoose.model("borrow_logs", BorrowLogSchema);
module.exports = BorrowLog;