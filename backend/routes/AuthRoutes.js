const express = require("express");
const AuthController = require("../controllers/AuthController");

const route = express.Router();

route.post("/register", AuthController.register);

route.post("/login", AuthController.login);

route.get("/users", AuthController.getAllUsers);

route.get("/users/:id", AuthController.getUserById);

route.put("/users/:id", AuthController.updateUserById);

route.delete("/users/:id", AuthController.deleteUserById);

module.exports = route;