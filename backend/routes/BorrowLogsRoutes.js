const express = require("express");
const BorrowLogsController = require("../controllers/BorrowLogsController");

const route = express.Router();

route.post("/", BorrowLogsController.createNewBorrow);

route.get("/", BorrowLogsController.getAllBorrowLogs);

route.put("/:id/return", BorrowLogsController.returnBook);

route.delete("/:id", BorrowLogsController.deleteBorrowLogById);

module.exports = route;