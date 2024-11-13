const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  productores,
  pagar,
  crearProductor,
  actualizarProductor,
  eliminarProductor,
  productor,
} = require("../controllers/productores.controller");

const productoresRouter = express.Router();

productoresRouter.get("/", authenticateToken, productores);
productoresRouter.get("/productor/:id", authenticateToken, productor);
productoresRouter.put("/pagar/:idcomprobante", authenticateToken, pagar);
productoresRouter.put("/eliminar/:id", authenticateToken, eliminarProductor);
productoresRouter.put(
  "/actualizar/:id",
  authenticateToken,
  actualizarProductor
);
productoresRouter.post("/ingresar", authenticateToken, crearProductor);

module.exports = productoresRouter;
