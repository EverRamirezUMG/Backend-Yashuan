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

compraRouter.get("/", acopio);
compraRouter.get("/total", totalCompra);
compraRouter.get("/resumen", resumenAcopio);
compraRouter.get("/estado", verificarCompra);
compraRouter.get("/compras", getAllcompras);
compraRouter.get("/comprobante", comprobante);
compraRouter.get("/vehiculo", vehiculos);
compraRouter.get("/tipo", tipo_productor);
compraRouter.get("/comprobante/:idcomprobante", getCompra);
compraRouter.put("/actualizar/:idcomprobante", actualizarCompra);
compraRouter.delete("/eliminar/:idcomprobante", eliminarCompra);
compraRouter.post("/comprar", comprar);
compraRouter.post("/finalizar", finalizarCompra);
compraRouter.post("/iniciar/:codigo", inicarCompra);

module.exports = compraRouter;
