const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  muestras,
  crearMuestra,
  listaPartidas,
  muestrasRango,
  listaClientes,
  totales,
  muestra,
  precio,
  RangoTotales,
} = require("../controllers/muestra.controller");

const muestrasRouter = express.Router();

muestrasRouter.get("/", muestras);
muestrasRouter.get("/partidas", listaPartidas);
muestrasRouter.get("/fecha", muestrasRango);
muestrasRouter.get("/rtotal", RangoTotales);
muestrasRouter.get("/clientes", listaClientes);
muestrasRouter.get("/totales", totales);
muestrasRouter.get("/precio", precio);
muestrasRouter.get("/:id", muestra);
muestrasRouter.post("/ingresar", crearMuestra);

module.exports = muestrasRouter;
