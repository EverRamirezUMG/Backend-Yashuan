const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  fletes,
  fleteVehiculos,
  totales,
  fletesRango,
  fleteVehiculo,
  totalRango,
} = require("../controllers/fletes.controller");

const fletesRouter = express.Router();

fletesRouter.get("/", authenticateToken, fletes);
fletesRouter.get("/rango", authenticateToken, fletesRango);
fletesRouter.get("/totales", authenticateToken, totales);
fletesRouter.get("/totalesrango", authenticateToken, totalRango);
fletesRouter.get("/vehiculo/:id", authenticateToken, fleteVehiculo);
fletesRouter.get("/flete/:id", authenticateToken, fleteVehiculos);

module.exports = fletesRouter;
