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
} = require("../controllers/resumen.controller");

const resumenRouter = express.Router();

resumenRouter.get("/lista", listadoCompras);
resumenRouter.get("/compras", compras);
resumenRouter.get("/compra", getAllcompras);
resumenRouter.get("/resumen", resumenAcopio);
resumenRouter.get("/resumenid", resumenAcopioid);
resumenRouter.get("/total", totalCompra);
resumenRouter.get("/totalid", totalCompraId);

module.exports = resumenRouter;
