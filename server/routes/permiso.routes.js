const express = require("express");
const authenticateToken = require("../middleware/Auth.middleware");
const {
  getPermiso,
  updatePermiso,
  getRoles,
} = require("../controllers/permisos.controller");

const permisosRouter = express.Router();

// permisosRouter.get('/permiso/:codigo', authenticateToken, getPermiso);
permisosRouter.get("/roles", getRoles);
permisosRouter.get("/:codigo", getPermiso);
permisosRouter.put("/:codigo", updatePermiso);

module.exports = permisosRouter;
