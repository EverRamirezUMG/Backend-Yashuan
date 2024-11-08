const pool = require("../db");

//------------------------- MOSTRAR TODOS LOS VEHICULOS -------------------------
const vehiculos = async (req, res, next) => {
  try {
    const datos = await pool.query(
      `select * from vehiculo where activo = true`
    );
    res.json(datos.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------- CREAR VEHICULO -------------------------
const ingresarVehiculo = async (req, res, next) => {
  try {
    const { marca, color, alias, placa } = req.body;
    const activo = true;
    const vehiculo = await pool.query(
      `
        CALL insertarVehiculo ( $1, $2, $3, $4, $5)
`,
      [marca, color, alias, activo, placa]
    );
    res.json(vehiculo.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------- ACTUALIZAR VEHICULO -------------------------
const actualizarVehiculo = async (req, res, next) => {
  try {
    const { placa, modelo, marca, color, anio, capacidad } = req.body;
    const { id } = req.params;
    const vehiculo = await pool.query(
      `
        CALL actualizarVehiculo ( $1, $2, $3, $4, $5, $6, $7)
`,
      [id, placa, modelo, marca, color, anio, capacidad]
    );
    res.json(vehiculo.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------- ELIMINAR VEHICULO -------------------------
const eliminarVehiculo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehiculo = await pool.query(
      `
      update vehiculo set activo = false where pk_vehiculo = $1 
`,
      [id]
    );
    res.json(vehiculo.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  vehiculos,
  ingresarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
};
