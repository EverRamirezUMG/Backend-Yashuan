const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  costoproduccion,
  gastoBeneficio,
  ingresarGastoBeneficio,
} = require("../controllers/costoproduccion.controllers");

const costoproduccionRouter = express.Router();

costoproduccionRouter.get("/beneficio", gastoBeneficio);
costoproduccionRouter.get("/:id", costoproduccion);
costoproduccionRouter.post("/ingresar", ingresarGastoBeneficio);

module.exports = costoproduccionRouter;
