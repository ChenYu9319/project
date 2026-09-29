const express = require("express");
const BorrowLogsController = require("../controllers/BorrowLogsController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

route.post("/", verifyToken, BorrowLogsController.createNewBorrow);

route.get("/", verifyToken, BorrowLogsController.getAllBorrowLogs);

route.put("/:id/return", verifyToken, BorrowLogsController.returnBook);

route.delete("/:id", verifyToken, isAdmin, BorrowLogsController.deleteBorrowLogById);

module.exports = route;