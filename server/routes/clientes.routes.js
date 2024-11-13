const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  clientes,
  ingresarClientes,
  rangoClientes,
  cliente,
  actualizarCliente,
  desactivarCliente,
} = require("../controllers/clientes.controller");

const clientesRouter = express.Router();

clientesRouter.get("/", authenticateToken, clientes);
clientesRouter.get("/cliente/:id", authenticateToken, cliente);
clientesRouter.get("/fecha", authenticateToken, rangoClientes);
clientesRouter.post("/ingresar", authenticateToken, ingresarClientes);
clientesRouter.put("/actualizar/:id", authenticateToken, actualizarCliente);
clientesRouter.put("/desactivar/:id", authenticateToken, desactivarCliente);

module.exports = clientesRouter;
