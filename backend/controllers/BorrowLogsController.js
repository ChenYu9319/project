const BorrowLog = require("../models/BorrowLogs");
const Book = require("../models/Books");
const User = require("../models/User");

exports.createNewBorrow = async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        const book = await Book.findById(bookId);
        const user = await User.findById(userId);

        if (!book || book.availableStock <= 0) {
            return res.status(400).json({ message: "图书不存在或库存不足" });
        }
        if (!user || user.currentBorrowsCount >= 5) {
            return res.status(400).json({ message: "读者已达到最大借阅限制(5本)" });
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
            return res.status(400).json({ message: "未找到记录或该图书已归还" });
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