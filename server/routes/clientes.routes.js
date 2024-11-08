const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  clientes,
  ingresarClientes,
  rangoClientes,
  cliente,
} = require("../controllers/clientes.controller");

const clientesRouter = express.Router();

clientesRouter.get("/", clientes);
clientesRouter.get("/cliente/:id", cliente);
clientesRouter.get("/fecha", rangoClientes);
clientesRouter.post("/ingresar", ingresarClientes);

module.exports = clientesRouter;
