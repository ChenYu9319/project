const Book = require("../models/Books");

exports.addNewBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAllBooks = async (req, res) => {
    const { keyword, category, availableOnly } = req.query;
    const filter = {};

    if (keyword) {
        filter.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { author: { $regex: keyword, $options: "i" } }
        ];
    }

    if (category) filter.category = category;
    if (availableOnly === "true") filter.availableStock = { $gt: 0 };

    try {
        const books = await Book.find(filter);
        res.json(books);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateBookById = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteBookById = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getUniqueCategories = async (req, res) => {
    try {
        const categories = await Book.find().distinct("category");
        res.json(categories);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.loadDefaultBooks = async () => {
    const defaultBooks = [
        {
            title: "JavaScript: The Good Parts",
            isbn: "9780596517748",
            author: "Douglas Crockford",
            category: "Programming",
            totalStock: 5,
            availableStock: 5,
            shelfLocation: "A-01-01"
        },
        {
            title: "Clean Code",
            isbn: "9780132350884",
            author: "Robert C. Martin",
            category: "Software Engineering",
            totalStock: 3,
            availableStock: 2,
            shelfLocation: "A-01-02"
        }
    ];
    await Book.insertMany(defaultBooks);
};