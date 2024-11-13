const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  listadoCompras,
  getAllcompras,
  compras,
  resumenAcopio,
  totalCompra,
  resumenAcopioid,
  totalCompraId,
  faltaPago,
} = require("../controllers/resumen.controller");

const resumenRouter = express.Router();

resumenRouter.get("/lista", authenticateToken, listadoCompras);
resumenRouter.get("/compras", authenticateToken, compras);
resumenRouter.get("/compra", authenticateToken, getAllcompras);
resumenRouter.get("/resumen", authenticateToken, resumenAcopio);
resumenRouter.get("/resumenid", authenticateToken, resumenAcopioid);
resumenRouter.get("/total", authenticateToken, totalCompra);
resumenRouter.get("/totalid", authenticateToken, totalCompraId);
resumenRouter.get("/pago", authenticateToken, faltaPago);

module.exports = resumenRouter;
