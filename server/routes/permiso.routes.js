const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  getPermiso,
  updatePermiso,
  getRoles,
} = require("../controllers/permisos.controller");

const permisosRouter = express.Router();

// permisosRouter.get('/permiso/:codigo', authenticateToken, getPermiso);
permisosRouter.get("/roles", authenticateToken, getRoles);
permisosRouter.get("/:codigo", authenticateToken, getPermiso);
permisosRouter.put("/:codigo", authenticateToken, updatePermiso);

module.exports = permisosRouter;
