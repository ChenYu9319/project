const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["member", "admin"],
        default: "member"
    },
    cardNo: {
        type: String,
        required: true,
        unique: true
    },
    currentBorrowsCount: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model("users", UserSchema);
module.exports = User;