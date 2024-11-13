const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  ingresarPergamino,
  disponibilidad,
  partidas,
  proceso,
  pergamino,
  pergaminoRango,
  cantidadDisponible,
  partida,
} = require("../controllers/inventario.controllers");

const inventarioRouter = express.Router();

inventarioRouter.get("/disponibilidad", authenticateToken, disponibilidad);
inventarioRouter.get("/stock", authenticateToken, cantidadDisponible);
inventarioRouter.get("/partidas", authenticateToken, partidas);
inventarioRouter.get("/proceso", authenticateToken, proceso);
inventarioRouter.get("/pergamino", authenticateToken, pergamino);
inventarioRouter.get("/pergaminos", authenticateToken, pergaminoRango);
inventarioRouter.get("/partida/:idpartida", authenticateToken, partida);
inventarioRouter.post("/ingresar", authenticateToken, ingresarPergamino);

module.exports = inventarioRouter;
