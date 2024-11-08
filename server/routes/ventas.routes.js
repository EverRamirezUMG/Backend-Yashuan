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
} = require("../controllers/ventas.controller");

const ventasRouter = express.Router();

ventasRouter.get("/", ventas);
ventasRouter.get("/fecha", rangoVentas);
ventasRouter.get("/totales", totales);
ventasRouter.get("/rtotal", rangoTotales);
ventasRouter.get("/:id", venta);
ventasRouter.post("/ingresar", ingresarVenta);
ventasRouter.put("/pago/:id", pagoVenta);

module.exports = ventasRouter;
