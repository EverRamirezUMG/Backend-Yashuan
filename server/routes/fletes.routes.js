const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const { fletes } = require("../controllers/fletes.controller");

const fletesRouter = express.Router();

fletesRouter.get("/", fletes);

module.exports = fletesRouter;
