const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  acopio,
  inicarCompra,
  comprar,
  finalizarCompra,
  totalCompra,
  getCompra,
  verificarCompra,
  getAllcompras,
  resumenAcopio,
  vehiculos,
  comprobante,
  actualizarCompra,
  tipo_productor,
  eliminarCompra,
} = require("../controllers/compra.controller");

const compraRouter = express.Router();

compraRouter.get("/", authenticateToken, acopio);
compraRouter.get("/total", authenticateToken, totalCompra);
compraRouter.get("/resumen", authenticateToken, resumenAcopio);
compraRouter.get("/estado", authenticateToken, verificarCompra);
compraRouter.get("/compras", authenticateToken, getAllcompras);
compraRouter.get("/comprobante", authenticateToken, comprobante);
compraRouter.get("/vehiculo", authenticateToken, vehiculos);
compraRouter.get("/tipo", authenticateToken, tipo_productor);
compraRouter.get("/comprobante/:idcomprobante", authenticateToken, getCompra);
compraRouter.put(
  "/actualizar/:idcomprobante",
  authenticateToken,
  actualizarCompra
);
compraRouter.delete(
  "/eliminar/:idcomprobante",
  authenticateToken,
  eliminarCompra
);
compraRouter.post("/comprar", authenticateToken, comprar);
compraRouter.post("/finalizar", authenticateToken, finalizarCompra);
compraRouter.post("/iniciar/:codigo", authenticateToken, inicarCompra);

module.exports = compraRouter;
