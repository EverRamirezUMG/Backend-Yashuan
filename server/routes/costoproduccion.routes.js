const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  costoproduccion,
  gastoBeneficio,
  ingresarGastoBeneficio,
} = require("../controllers/costoproduccion.controllers");

const costoproduccionRouter = express.Router();

costoproduccionRouter.get("/beneficio", authenticateToken, gastoBeneficio);
costoproduccionRouter.get("/:id", authenticateToken, costoproduccion);
costoproduccionRouter.post(
  "/ingresar",
  authenticateToken,
  ingresarGastoBeneficio
);

module.exports = costoproduccionRouter;
