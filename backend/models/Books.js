const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    totalStock: {
        type: Number,
        required: true
    },
    availableStock: {
        type: Number,
        required: true
    },
    shelfLocation: {
        type: String,
        required: true
    }
});

const Book = mongoose.model("books", BookSchema);
module.exports = Book;