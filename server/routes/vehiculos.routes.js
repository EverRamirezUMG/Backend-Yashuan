const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  vehiculos,
  ingresarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} = require("../controllers/vehiculos.controller");

const vehiculosRouter = express.Router();

vehiculosRouter.get("/", authenticateToken, vehiculos);
vehiculosRouter.post("/ingresar", authenticateToken, ingresarVehiculo);
vehiculosRouter.put("/actualizar/:id", authenticateToken, actualizarVehiculo);
vehiculosRouter.put("/eliminar/:id", authenticateToken, eliminarVehiculo);

module.exports = vehiculosRouter;
