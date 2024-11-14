const pool = require("../db");

//------------------------------------ MOSTRAR TODAS LAS VENTAS --------------------------------------
const ventas = async (req, res, next) => {
  try {
    const ventas = await pool.query(`select * from vistaventa`);
    res.json(ventas.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------- MUESTRA UNA VENTA ---------------
const venta = async (req, res, next) => {
  try {
    const venta = await pool.query(`select * from vistaventa where id = $1`, [
      req.params.id,
    ]);
    res.json(venta.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------ MOSTRAR TODAS LAS VENTAS --------------------------------------
const rangoVentas = async (req, res, next) => {
  try {
    const { fecha1, fecha2 } = req.query;
    const ventas = await pool.query(
      `select * from vistaventa where fecha between $1 and $2`,
      [fecha1, fecha2]
    );
    res.json(ventas.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------- MUESTRA UNA VENTA ---------------
const totales = async (req, res, next) => {
  try {
    const venta = await pool.query(
      `select 
ROUND(sum(pesoneto), 2) as peso_total,
(select ROUND(sum(pesoneto), 2) as peso from vistaventa where id_proceso = 1 ) as peso_lavado,
(select ROUND(sum(pesoneto), 2) as peso from vistaventa where id_proceso = 2 ) as peso_honey,
(select ROUND(sum(pesoneto), 2) as peso from vistaventa where id_proceso = 3 ) as peso_natural,
(select ROUND(sum(pesoneto), 2) as peso from vistaventa where id_proceso = 4 ) as peso_subproducto
from vistaventa

`
    );
    res.json(venta.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------- MUESTRA UNA VENTA ---------------
const rangoTotales = async (req, res, next) => {
  try {
    const { fecha1, fecha2 } = req.query;
    const venta = await pool.query(
      `select 
sum(pesoneto) as peso_total,
(select sum(pesoneto) as peso from vistaventa where id_proceso = 1 and  fecha between $1 and $2) as peso_lavado,
(select sum(pesoneto) as peso from vistaventa where id_proceso = 2 and  fecha between $1 and $2) as peso_honey,
(select sum(pesoneto) as peso from vistaventa where id_proceso = 3 and  fecha between $1 and $2) as peso_natural,
(select sum(pesoneto) as peso from vistaventa where id_proceso = 4 and  fecha between $1 and $2) as peso_subproducto
from vistaventa
where fecha between $1 and $2`,
      [fecha1, fecha2]
    );
    res.json(venta.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------- PRECIO PERGAMINO  --------------------------------------
const preciopergamino = async (req, res, next) => {
  try {
    const precio = await pool.query(
      `select precio from precio_pergamino where fk_proceso = $1 order by idpreciopergamino desc limit 1
`,
      [req.params.id]
    );
    res.json(precio.rows[0]);
  } catch (error) {
    next(error);
  }
};

//-------------------------- INGRESAR VENTA --------------------------

const ingresarVenta = async (req, res, next) => {
  try {
    const {
      peso,
      tara,
      anticipo,
      pago,
      observacion,
      proceso,
      usuario,
      cliente,
    } = req.body;

    const taraneto = tara / 100;
    const pagoFinal = pago === null ? 0 : pago;
    const result = await pool.query(
      `call insertarVenta ($1, $2, $3, $4, $5, $6, $7, $8 )
`,
      [
        peso,
        taraneto,
        anticipo,
        pagoFinal,
        observacion,
        proceso,
        usuario,
        cliente,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//---------- ------------------- PAGO DE VENTA --------------------------

const pagoVenta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ventas = await pool.query(
      `update venta set pago = total where pk_venta =  $1 `,
      [id]
    );
    res.json(ventas.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ventas,
  rangoVentas,
  venta,
  totales,
  rangoTotales,
  ingresarVenta,
  pagoVenta,
  preciopergamino,
};
