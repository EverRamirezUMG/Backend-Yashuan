const pool = require("../db");

//-------------------------------------- MOSTRAR UN SOLO PERMISO ----------------------------------------
const getPermiso = async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const result = await pool.query(
      "SELECT * FROM permiso WHERE fk_usuario = $1",
      [codigo]
    );
    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Permiso no encontrado",
      });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//-------------------------------------- ACTUALIZAR PERMISOS ----------------------------------------
const updatePermiso = async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const {
      analisis,
      cliente,
      compra,
      costoproduccion,
      envio,
      fk_usuario,
      inventario,
      muestra,
      paginaweb,
      pergamino,
      preciodia,
      productores,
      rendimiento,
      resumen,
      resumentemporada,
      usuarios,
      vehiculos,
      venta,
    } = req.body;

    const result = await pool.query(
      "UPDATE permiso SET analisis = $1, cliente = $2, compra = $3, costoproduccion = $4, envio = $5, fk_usuario = $6, inventario = $7, muestra = $8, paginaweb = $9, pergamino = $10, preciodia = $11, productores = $12, rendimiento = $13, resumen = $14, resumentemporada = $15, usuarios = $16, vehiculos = $17, venta = $18 WHERE  fk_usuario = $19 RETURNING *",
      [
        analisis,
        cliente,
        compra,
        costoproduccion,
        envio,
        fk_usuario,
        inventario,
        muestra,
        paginaweb,
        pergamino,
        preciodia,
        productores,
        rendimiento,
        resumen,
        resumentemporada,
        usuarios,
        vehiculos,
        venta,
        codigo,
      ]
    );

    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Permiso no encontrado",
      });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------- MOSTRAR ROLES DE USUARIO ----------------------------------------
const getRoles = async (req, res, next) => {
  try {
    const rol = await pool.query("SELECT * FROM cargo");
    res.json(rol.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPermiso,
  updatePermiso,
  getRoles,
};
