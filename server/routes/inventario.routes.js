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

inventarioRouter.get("/disponibilidad", disponibilidad);
inventarioRouter.get("/stock", cantidadDisponible);
inventarioRouter.get("/partidas", partidas);
inventarioRouter.get("/proceso", proceso);
inventarioRouter.get("/pergamino", pergamino);
inventarioRouter.get("/pergaminos", pergaminoRango);
inventarioRouter.get("/partida/:idpartida", partida);
inventarioRouter.post("/ingresar", ingresarPergamino);

module.exports = inventarioRouter;
