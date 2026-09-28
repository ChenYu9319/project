const express = require("express");
const BooksController = require("../controllers/BooksController");

const route = express.Router();

route.post("/", BooksController.addNewBook);

route.get("/", BooksController.getAllBooks);

route.get("/category", BooksController.getUniqueCategories);

route.get("/:id", BooksController.getBookById);

route.put("/:id", BooksController.updateBookById);

route.delete("/:id", BooksController.deleteBookById);

module.exports = route;