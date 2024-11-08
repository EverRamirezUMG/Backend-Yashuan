const pool = require("../db");

//-------------------------- INGRESAR ENVIO --------------------------

const ingresarEnvio = async (req, res, next) => {
  try {
    const { destino, piloto, licencia, placa, lugar, venta, cliente, costo } =
      req.body;
    const result = await pool.query(
      `CALL insertarEnvio($1, $2, $3, $4, $5, $6, $7, $8)
`,
      [destino, piloto, licencia, placa, lugar, venta, cliente, costo]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//------------------------------------ VER ENVIOS --------------------------------------

const envios = async (req, res, next) => {
  try {
    const ventas = await pool.query(`select * from vistaenvio`);
    res.json(ventas.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//--------------------- OBTENER UN SOLO ENVIO ---------------------

const envio = async (req, res, next) => {
  try {
    const ventas = await pool.query(`select * from vistaenvio where id = $1`, [
      req.params.id,
    ]);
    res.json(ventas.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ingresarEnvio,
  envios,
  envio,
};
