const pool = require("../db");

const fletes = async (req, res, next) => {
  try {
    const fletes = await pool.query(`
select * from vistafletes 

`);
    res.json(fletes.rows);
  } catch (error) {
    next(error);
  }
};

//-----------------------  FLETES POR RANGO DE FECHA  -----------------------

const fletesRango = async (req, res, next) => {
  const { fecha1, fecha2 } = req.query;
  try {
    const fletes = await pool.query(
      `select * from vistafletes where fecha between $1 and $2`,
      [fecha1, fecha2]
    );
    res.json(fletes.rows);
  } catch (error) {
    next(error);
  }
};

//-----------------------  MOSTRAR UN SOLO FLETE -----------------------
const fleteVehiculos = async (req, res) => {
  try {
    const flete = await pool.query(
      `select * from vistafletes where id_vehiculo = $1`,
      [req.params.id]
    );
    res.json(flete.rows ?? 0);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------- TOTAL POR VEHICULO -------------------

const fleteVehiculo = async (req, res, next) => {
  try {
    const flete = await pool.query(
      `SELECT ROUND(SUM(flete)::numeric, 2) as total
FROM vistafletes
WHERE id_vehiculo = $1
`,
      [req.params.id]
    );
    res.json(flete.rows[0] ?? 0);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------------------- COSO TOTAL FLETES ---------------------------
const totales = async (req, res, next) => {
  try {
    const flete = await pool.query(
      `SELECT ROUND(SUM(flete)::numeric, 2) as total
FROM vistafletes 
`
    );
    res.json(flete.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------------- TOTAL FLTE POR RANGO DE FECHAS ---------------------
const totalRango = async (req, res, next) => {
  const { fecha1, fecha2 } = req.query;
  try {
    const flete = await pool.query(
      `SELECT ROUND(SUM(flete)::numeric, 2) as total
FROM vistafletes
WHERE fecha between $1 and $2
`,
      [fecha1, fecha2]
    );
    res.json(flete.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  fletes,
  fleteVehiculos,
  totales,
  fletesRango,
  totalRango,
  fleteVehiculo,
};

//where fecha between (select fechainicio( CURRENT_DATE)) and (select fechafin( CURRENT_DATE))
