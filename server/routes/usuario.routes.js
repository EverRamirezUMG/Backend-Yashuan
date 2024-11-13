const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  getAllusuarios,
  getUsuarios,
  crearUsuarios,
  actualizarUsuarios,
  activarUsuarios,
  eliminarUsuarios,
} = require("../controllers/usuario.controller");
const upload = require("../middleware/multerConfig");

const usuarioRouter = express.Router();

usuarioRouter.get("/usuarios/:activo", authenticateToken, getAllusuarios);
usuarioRouter.get("/usuario/:codigo", authenticateToken, getUsuarios);
usuarioRouter.post(
  "/usuarios",
  upload.single("imagen"),
  authenticateToken,
  crearUsuarios
);
usuarioRouter.put("/usuario/:codigo", authenticateToken, actualizarUsuarios);
usuarioRouter.put(
  "/usuario/desactivar/:codigo",
  authenticateToken,
  activarUsuarios
);
usuarioRouter.delete("/usuario/:codigo", authenticateToken, eliminarUsuarios);

module.exports = usuarioRouter;
