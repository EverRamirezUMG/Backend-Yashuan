const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const { productores, pagar } = require("../controllers/productores.controller");

const productoresRouter = express.Router();

productoresRouter.get("/", authenticateToken, productores);
productoresRouter.put("/pagar/:idcomprobante", authenticateToken, pagar);

module.exports = productoresRouter;
