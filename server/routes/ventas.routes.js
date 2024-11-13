const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  ventas,
  venta,
  rangoVentas,
  totales,
  rangoTotales,
  ingresarVenta,
  pagoVenta,
  preciopergamino,
} = require("../controllers/ventas.controller");

const ventasRouter = express.Router();

ventasRouter.get("/", authenticateToken, ventas);
ventasRouter.get("/fecha", authenticateToken, rangoVentas);
ventasRouter.get("/totales", authenticateToken, totales);
ventasRouter.get("/rtotal", authenticateToken, rangoTotales);
ventasRouter.get("/:id", authenticateToken, venta);
ventasRouter.get("/precio/:id", authenticateToken, preciopergamino);
ventasRouter.post("/ingresar", authenticateToken, ingresarVenta);
ventasRouter.put("/pago/:id", authenticateToken, pagoVenta);

module.exports = ventasRouter;
