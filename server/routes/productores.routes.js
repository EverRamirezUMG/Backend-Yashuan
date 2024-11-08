const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const { productores, pagar } = require("../controllers/productores.controller");

const productoresRouter = express.Router();

productoresRouter.get("/", productores);
productoresRouter.put("/pagar/:idcomprobante", pagar);

module.exports = productoresRouter;
