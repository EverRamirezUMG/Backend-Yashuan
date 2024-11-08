const pool = require("../db");

const procesos = async (req, res, next) => {
  try {
    const datos = await pool.query(`select * from proceso`);
    res.json(datos.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const proceso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = await pool.query(
      `select * from proceso where idproceso = $1`,
      [id]
    );
    res.json(datos.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

///------ precio pergamino
const preciopergamino = async (req, res, next) => {
  try {
    const datos = await pool.query(`select * from preciopergamino`);
    res.json(datos.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//-------------- ingresar precio pergamino ------
const ingresarPrecioPergamino = async (req, res, next) => {
  try {
    const { proceso, precio } = req.body;
    const fecha = new Date();
    const datos = await pool.query(
      `insert into precio_pergamino (fk_proceso, fecha, precio) values ($1, $2, $3)`,
      [proceso, fecha, precio]
    );
    res.json(datos.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------------- INGRESAR NUEVO PROCESO ---------------------
const ingresarProceso = async (req, res, next) => {
  try {
    const { proceso } = req.body;
    const datos = await pool.query(
      `insert into proceso (proceso) values ($1)`,
      [proceso]
    );
    res.json(datos.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------ actualizar proceso ----------------
const actualizarProceso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { proceso } = req.body;
    const datos = await pool.query(
      `update proceso set proceso = $1 where idproceso = $2`,
      [proceso, id]
    );
    res.json(datos.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  procesos,
  preciopergamino,
  ingresarPrecioPergamino,
  ingresarProceso,
  actualizarProceso,
  proceso,
};
