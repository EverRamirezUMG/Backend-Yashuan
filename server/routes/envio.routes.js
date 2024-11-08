const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  ingresarEnvio,
  envios,
  envio,
} = require("../controllers/envio.controller");

const envioRouter = express.Router();

envioRouter.get("/", envios);
envioRouter.get("/:id", envio);
envioRouter.post("/ingresar", ingresarEnvio);

module.exports = envioRouter;
