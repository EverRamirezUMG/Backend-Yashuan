const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  procesos,
  proceso,
  preciopergamino,
  ingresarPrecioPergamino,
  ingresarProceso,
  actualizarProceso,
} = require("../controllers/procesos.controller");

const procesosRouter = express.Router();

procesosRouter.get("/", procesos);
procesosRouter.get("/precio", preciopergamino);
procesosRouter.get("/proceso/:id", proceso);
procesosRouter.post("/ingresarprecio", ingresarPrecioPergamino);
procesosRouter.post("/ingresarproceso", ingresarProceso);
procesosRouter.put("/actualizar/:id", actualizarProceso);

module.exports = procesosRouter;
