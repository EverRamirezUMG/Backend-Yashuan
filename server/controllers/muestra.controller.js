const pool = require("../db");

//------------------------------------ MOSTRAR TODAS LAS MUESTRAS --------------------------------------
const muestras = async (req, res, next) => {
  try {
    const muestras = await pool.query(`select * from vistamuestras 
`);
    res.json(muestras.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const muestra = async (req, res, next) => {
  try {
    const muestra = await pool.query(
      `select * from vistamuestras where id = $1`,
      [req.params.id]
    );
    res.json(muestra.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------ MOSTRAR MUESTRAS POR RANGO DE FECHAS --------------------------------------

const muestrasRango = async (req, res, next) => {
  const { fecha1, fecha2 } = req.query;
  try {
    const muestras = await pool.query(
      `select * from vistamuestras where fecha between $1 and $2`,
      [fecha1, fecha2]
    );
    res.json(muestras.rows);
  } catch (error) {
    next(error);
  }
};

//-------------------- PARTIDAS REGISTRADAS DE CAFE PERGAMINO --------------------

const listaPartidas = async (req, res, next) => {
  try {
    const partidas = await pool.query(
      `select DISTINCT
partida.idpartida as id,
partida.partida,
partida.fecha,
ingreso_pergamino.fecha_ingreso
from partida
INNER JOIN ingreso_pergamino on ingreso_pergamino.fk_partida = partida.idpartida 
order by partida asc
`
    );
    res.json(partidas.rows);
  } catch (error) {
    next(error);
  }
};

//-------------------- LISTADO DE CLIENTES --------------------

const listaClientes = async (req, res, next) => {
  try {
    const clientes = await pool.query(`select 
pk_cliente as id,
nombre
from cliente
order by pk_cliente desc
`);
    res.json(clientes.rows);
  } catch (error) {
    next(error);
  }
};

//------------------------------------ CREAR MUESTRAS --------------------------------------

const crearMuestra = async (req, res, next) => {
  const {
    cantidad,
    peso,
    envio,
    observacion,
    proceso,
    partida,
    direccion,
    cliente,
  } = req.body;
  const Peso = peso / 100;
  try {
    const result = await pool.query(
      `call registrarmuestra ($1 , $2, $3, $4, $5, $6, $7, $8 )`,
      [cantidad, Peso, envio, observacion, proceso, partida, direccion, cliente]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//------------------------------------- TOTAL DE MUESTRAS --------------------------------------
const totales = async (req, res, next) => {
  try {
    const total = await pool.query(
      `
select 
sum(cantidad) as muestras_enviadas,
COUNT(DISTINCT fk_cliente) as cantidad_cleintes,
sum(peso) as peso_total,
(select sum(peso) as peso from muestra where fk_proceso = 1) as peso_lavado,
(select sum(peso) as peso from muestra where fk_proceso = 2) as peso_honey,
(select sum(peso) as peso from muestra where fk_proceso = 3) as peso_natural,
(select sum(peso) as peso from muestra where fk_proceso = 4) as peso_subproducto
from muestra 
`
    );
    res.json(total.rows[0] || { muestras_enviadas: 0 });
  } catch (error) {
    next(error);
  }
};

//---------------------- TOTALES POR RANGO DE FECHAS ----------------------
const RangoTotales = async (req, res, next) => {
  try {
    const { fecha1, fecha2 } = req.query;
    const total = await pool.query(
      `
select 
sum(cantidad) as muestras_enviadas,
COUNT(DISTINCT fk_cliente) as cantidad_cleintes,
sum(peso) as peso_total,
(select sum(peso) as peso from muestra where fk_proceso = 1 and  fecha between $1 and $2 ) as peso_lavado,
(select sum(peso) as peso from muestra where fk_proceso = 2 and  fecha between $1 and $2 ) as peso_honey,
(select sum(peso) as peso from muestra where fk_proceso = 3 and  fecha between $1 and $2 ) as peso_natural,
(select sum(peso) as peso from muestra where fk_proceso = 4 and  fecha between $1 and $2 ) as peso_subproducto
from muestra where fecha between $1 and $2
`,
      [fecha1, fecha2]
    );
    res.json(total.rows[0]);
  } catch (error) {
    next(error);
  }
};
//------------------------------------- PRECIO PERGAMINO  --------------------------------------
const precio = async (req, res, next) => {
  try {
    const precio = await pool.query(
      `select precio from precio_pergamino where idpreciopergamino = 1 order by idpreciopergamino desc limit 1


`
    );
    res.json(precio.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  muestras,
  crearMuestra,
  muestrasRango,
  listaPartidas,
  listaClientes,
  totales,
  muestra,
  precio,
  RangoTotales,
};
