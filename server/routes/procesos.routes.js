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

procesosRouter.get("/", authenticateToken, procesos);
procesosRouter.get("/precio", authenticateToken, preciopergamino);
procesosRouter.get("/proceso/:id", authenticateToken, proceso);
procesosRouter.post(
  "/ingresarprecio",
  authenticateToken,
  ingresarPrecioPergamino
);
procesosRouter.post("/ingresarproceso", authenticateToken, ingresarProceso);
procesosRouter.put("/actualizar/:id", authenticateToken, actualizarProceso);

module.exports = procesosRouter;
