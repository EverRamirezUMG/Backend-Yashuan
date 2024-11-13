const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  rendimientoPartida,
  partidas,
  allpartida,
  catacion,
  ingresarCatacion,
  partidasRango,
} = require("../controllers/rendimiento.controllers");

const rendimientoRouter = express.Router();

rendimientoRouter.get("/partidas", authenticateToken, partidas);
rendimientoRouter.get("/rangopartidas", authenticateToken, partidasRango);
rendimientoRouter.get("/allpartidas", authenticateToken, allpartida);
rendimientoRouter.get("/partida/:id", authenticateToken, rendimientoPartida);
rendimientoRouter.get("/catacion/:id", authenticateToken, catacion);
rendimientoRouter.post(
  "/ingresarcatacion/:partida",
  authenticateToken,
  ingresarCatacion
);

module.exports = rendimientoRouter;
