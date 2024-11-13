const pool = require("../db");

//------------------------ INGRESAR PERGAMINO EN BODEGA  ------------------------
const ingresarPergamino = async (req, res, next) => {
  try {
    const { idpartida, peso_bruto, tara, proceso, observacion } = req.body;
    const ingreso = await pool.query(
      `call ingresopergamino($1, $2, $3, $4, $5)`,
      [idpartida, peso_bruto, tara, proceso, observacion]
    );

    res.json(ingreso.rows);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

//--------------------- DISPONIBILIDAD ---------------------

const disponibilidad = async (req, res, next) => {
  try {
    const resultado = await pool.query(
      `SELECT 
       proceso.proceso, 
       stock.cantidad
      FROM stock
      LEFT JOIN proceso ON stock.fk_proceso = proceso.idproceso
         order by fk_proceso asc`
    );

    // Transformar el resultado en el formato deseado
    const disponibilidad = resultado.rows.reduce((acc, row) => {
      acc[row.proceso] = row.cantidad;
      return acc;
    }, {});

    res.json(disponibilidad);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

//----------------------------- PARTIDAS -------------------------------

const partidas = async (req, res, next) => {
  try {
    const partidas = await pool.query(
      `select idpartida as id, partida, fecha, pesototalmaduro as maduro from partida where pesototalmaduro is not null order by partida
`
    );

    res.json(partidas.rows);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

//----------------------------- PARTIDA -------------------------------

const partida = async (req, res, next) => {
  const { idpartida } = req.params;
  try {
    const partida = await pool.query(
      `select idpartida as id, partida, fecha, pesototalmaduro as maduro, pesototalpergamino as pergamino,
        ROUND(rendimiento, 4) AS rendimiento  from partida where idpartida = $1`,
      [idpartida]
    );

    res.json(partida.rows);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

//----------------------------- PRODUCTO -------------------------------

const proceso = async (req, res, next) => {
  try {
    const producto = await pool.query(
      `select idproceso as id, proceso from proceso`
    );

    res.json(producto.rows);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};
//----------------------------- PRODUCTO -------------------------------

const pergamino = async (req, res, next) => {
  try {
    const pergamino = await pool.query(`select * from vistapergamino`);

    res.json(pergamino.rows);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

//---------------------------- SELECCION POR RANGO DE FECHAS ----------------------------
const pergaminoRango = async (req, res, next) => {
  try {
    const { fecha1, fecha2 } = req.query;
    const resultado = await pool.query(
      `SELECT * FROM vistapergamino WHERE fecha BETWEEN $1 AND $2`,
      [fecha1, fecha2]
    );

    res.json(resultado.rows);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

//----------------------------- CANTIDAD DISPONIBLE  -------------------------------
const cantidadDisponible = async (req, res, next) => {
  try {
    const cantidad = await pool.query(
      `SELECT ROUND(SUM(stock.cantidad), 2) AS cantidad FROM stock
`
    );
    res.json(cantidad.rows[0]);
  } catch (error) {
    if (error.message.includes("ERROR")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

//----------------------------- EXPORTS ------------------------------- ROUND(rendimiento, 4)

module.exports = {
  ingresarPergamino,
  disponibilidad,
  partidas,
  proceso,
  pergamino,
  pergaminoRango,
  cantidadDisponible,
  partida,
};
