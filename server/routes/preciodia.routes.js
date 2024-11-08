const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const { getPrecioDia } = require("../controllers/preciodia.controller");

const preciodiaRouter = express.Router();

preciodiaRouter.get("/preciodia", authenticateToken, getPrecioDia);

module.exports = preciodiaRouter;
