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

muestrasRouter.get("/", authenticateToken, muestras);
muestrasRouter.get("/partidas", authenticateToken, listaPartidas);
muestrasRouter.get("/fecha", authenticateToken, muestrasRango);
muestrasRouter.get("/rtotal", authenticateToken, RangoTotales);
muestrasRouter.get("/clientes", authenticateToken, listaClientes);
muestrasRouter.get("/totales", authenticateToken, totales);
muestrasRouter.get("/precio", authenticateToken, precio);
muestrasRouter.get("/:id", authenticateToken, muestra);
muestrasRouter.post("/ingresar", authenticateToken, crearMuestra);

module.exports = muestrasRouter;
