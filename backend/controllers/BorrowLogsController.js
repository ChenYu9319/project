const BorrowLog = require("../models/BorrowLogs");
const Book = require("../models/Books");
const User = require("../models/User");

exports.createNewBorrow = async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        const book = await Book.findById(bookId);
        const user = await User.findById(userId);

        if (!book || book.availableStock <= 0) {
            return res.status(400).json({ message: "The book does not exist or is out of stock." });
        }
        if (!user || user.currentBorrowsCount >= 5) {
            return res.status(400).json({ message: "The patron has reached the maximum borrowing limit (5 items)." });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const newLog = new BorrowLog({
            userId,
            bookId,
            dueDate
        });

        await newLog.save();

        book.availableStock -= 1;
        await book.save();

        user.currentBorrowsCount += 1;
        await user.save();

        res.json(newLog);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAllBorrowLogs = async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    try {
        const logs = await BorrowLog.find(filter)
            .populate("userId", "username cardNo email")
            .populate("bookId", "title isbn shelfLocation");
        res.json(logs);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.returnBook = async (req, res) => {
    try {
        const log = await BorrowLog.findById(req.params.id);
        if (!log || log.status === "Returned") {
            return res.status(400).json({ message: "No record found, or the book has already been returned." });
        }

        log.returnDate = new Date();
        log.status = "Returned";
        await log.save();

        await Book.findByIdAndUpdate(log.bookId, { $inc: { availableStock: 1 } });
        await User.findByIdAndUpdate(log.userId, { $inc: { currentBorrowsCount: -1 } });

        res.json(log);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteBorrowLogById = async (req, res) => {
    try {
        await BorrowLog.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json(err);
    }
};