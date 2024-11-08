const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  vehiculos,
  ingresarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} = require("../controllers/vehiculos.controller");

const vehiculosRouter = express.Router();

vehiculosRouter.get("/", vehiculos);
vehiculosRouter.post("/ingresar", ingresarVehiculo);
vehiculosRouter.put("/actualizar/:id", actualizarVehiculo);
vehiculosRouter.put("/eliminar/:id", eliminarVehiculo);

module.exports = vehiculosRouter;
