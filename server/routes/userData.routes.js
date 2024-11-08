const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const { getEmailUsuarios } = require("../controllers/userData.controller");
const userDataRouter = express.Router();

userDataRouter.get("/datouser/:email", authenticateToken, getEmailUsuarios);
module.exports = userDataRouter;
