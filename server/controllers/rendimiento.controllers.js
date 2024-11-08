const pool = require("../db");

const rendimientoPartida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = await pool.query(
      `select 
partida.idpartida as id, 
partida.partida,
partida.fecha,
proceso.proceso,
ingreso_pergamino.cantidad,
partida.fechabodega as fecha_bodega, 
precio_dia.preciobase as precio,
partida.pesototalmaduro as maduro,
ROUND(partida.rendimiento, 4) AS rendimiento


from partida 
LEFT JOIN ingreso_pergamino on partida.idpartida = ingreso_pergamino.fk_partida
LEFT JOIN proceso on ingreso_pergamino.fk_proceso = proceso.idproceso
LEFT JOIN compra on compra.fk_partida = partida.idpartida
LEFT JOIN precio_dia on compra.fk_preciodia = precio_dia.idpreciodia 
where fk_proceso = 1 and idpartida = $1`,
      [id]
    );

    const rendimiento = datos.rows;
    res.json(rendimiento[0]);
  } catch (error) {
    next(error);
  }
};
//------------------- PARTIDAS -------------------

const partidas = async (req, res, next) => {
  try {
    const partidas = await pool.query(
      `select idpartida as id, partida, fecha  from partida where pesototalpergamino is not null`
    );
    res.json(partidas.rows);
  } catch (error) {
    next(error);
  }
};

//------------------- TODAS LAS PARTIDAS -------------------
const allpartida = async (req, res, next) => {
  try {
    const partidas = await pool.query(
      `select * from vistarendimiento where cantidad is not null`
    );
    res.json(partidas.rows);
  } catch (error) {
    next(error);
  }
};

//----------------------   PARTIDAS POR RANGO DE FECHA ----------------------
const partidasRango = async (req, res, next) => {
  try {
    const { fecha1, fecha2 } = req.query;
    const partidas = await pool.query(
      `select * from vistarendimiento where cantidad is not null and fecha between $1 and $2`,
      [fecha1, fecha2]
    );
    res.json(partidas.rows);
  } catch (error) {
    next(error);
  }
};
//-------------------- DATOS DE CATACION

const catacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = await pool.query(
      `select 
fk_partida as partida, 
aroma, sabor, posgusto, acidez, cuerpo, balance, apreciacion, 
ROUND(puntuacion, 2) AS puntuacion,
fecha
from catacion where fk_partida = $1`,
      [id]
    );
    if (datos.rows.length === 0)
      return res
        .status(404)
        .json({ message: "No se encontraron datos de catación" });
    res.json(datos.rows[0]);
  } catch (error) {
    next(error);
  }
};

//------------------------ INGRESAR DATOS DE CATACION ------------------------
const ingresarCatacion = async (req, res, next) => {
  try {
    const { partida } = req.params;
    const { aroma, sabor, posgusto, acidez, cuerpo, balance, apreciacion } =
      req.body;
    const result = await pool.query(
      `call datocatacion ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [partida, aroma, sabor, posgusto, acidez, cuerpo, balance, apreciacion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//------------------------ ACTUALIZAR DATOS DE CATACION ------------------------

module.exports = {
  rendimientoPartida,
  partidas,
  allpartida,
  catacion,
  ingresarCatacion,
  partidasRango,
};
