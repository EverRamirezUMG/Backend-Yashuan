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

rendimientoRouter.get("/partidas", partidas);
rendimientoRouter.get("/rangopartidas", partidasRango);
rendimientoRouter.get("/allpartidas", allpartida);
rendimientoRouter.get("/partida/:id", rendimientoPartida);
rendimientoRouter.get("/catacion/:id", catacion);
rendimientoRouter.post("/ingresarcatacion/:partida", ingresarCatacion);

module.exports = rendimientoRouter;
