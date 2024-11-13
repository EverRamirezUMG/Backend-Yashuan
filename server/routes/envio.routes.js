const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  ingresarEnvio,
  envios,
  envio,
} = require("../controllers/envio.controller");

const envioRouter = express.Router();

envioRouter.get("/", authenticateToken, envios);
envioRouter.get("/:id", authenticateToken, envio);
envioRouter.post("/ingresar", authenticateToken, ingresarEnvio);

module.exports = envioRouter;
