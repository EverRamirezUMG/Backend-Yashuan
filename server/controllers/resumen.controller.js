const pool = require("../db");

//------------------------ LISTADO DE  COMPRAS REALIAZADAS ------------------------

const listadoCompras = async (req, res, next) => {
  try {
    const compras = await pool.query(
      `select idcompra, fecha, partida from vistacompra  order by idcompra desc `
    );
    res.json(compras.rows);
  } catch (error) {
    next(error);
  }
};

//------------------------ COMPRAS REALIZADAS ------------------------
const compras = async (req, res, next) => {
  try {
    const { fecha1, fecha2 } = req.query;
    const allcompras = await pool.query(
      `SELECT *
FROM vistacomprobante
WHERE fecha BETWEEN $1 AND $2; `,
      [fecha1, fecha2]
    );
    res.json(allcompras.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------ COMPRAS por seleccion ------------------------
const getAllcompras = async (req, res, next) => {
  try {
    const { idcompra } = req.query;
    if (
      idcompra === null ||
      idcompra === undefined ||
      idcompra === "" ||
      idcompra === "false"
    ) {
      const compraActual = await pool.query(
        `select * from vistacomprobante  where compra = (select idcompra from compra order by idcompra desc limit 1)`
      );
      res.json(compraActual.rows);
    } else {
      const allcompras = await pool.query(
        `select * from vistacomprobante  where compra = $1`,
        [idcompra]
      );

      res.json(allcompras.rows);
    }
  } catch (error) {
    next(error);
  }
};

//------------------------ RESUMEN SEGUN ID COMPRA ------------------------

const resumenAcopioid = async (req, res, next) => {
  const { idcompra } = req.query;
  try {
    if (
      idcompra === null ||
      idcompra === undefined ||
      idcompra === "" ||
      idcompra === "false"
    ) {
      const compra = await pool.query(
        `SELECT 
    SUM(pesoneto) AS compra
FROM 
    vistacomprobante
WHERE 
    tipo = 'Productor' 
    AND compra = (select idcompra from compra order by idcompra desc limit 1);
`
      );
      const recolector = await pool.query(
        `SELECT 
    SUM(pesoneto) AS recolector
    FROM 
    vistacomprobante
WHERE 
    tipo = 'Recolector' 
    AND compra = (select idcompra from compra order by idcompra desc limit 1);
`
      );
      const consignado = await pool.query(`select * from totalconsignado`);

      res.json({
        compra: compra.rows[0].compra ?? 0,
        productor: consignado.rows[0].productor ?? 0,
        socio: consignado.rows[0].socio,
        recolector: recolector.rows[0].recolector ?? 0,
      });
    } else {
      const compra = await pool.query(
        `SELECT 
    SUM(pesoneto) AS compra
FROM 
    vistacomprobante
WHERE 
    tipo = 'Productor' 
    AND compra = $1;
`,
        [idcompra]
      );
      const recolector = await pool.query(
        `SELECT 
    SUM(pesoneto) AS recolector
    FROM 
   vistacomprobante
WHERE 
    tipo = 'Recolector' 
    AND compra = $1;
`,
        [idcompra]
      );
      const consignado = await pool.query(
        `SELECT 
    (SELECT 
        SUM(pesoneto) 
     FROM 
        vistacomprobante 
     WHERE 
        tipo = 'Socio' 
        AND compra = $1) AS productor,

    (SELECT 
        SUM(pesoneto) 
     FROM 
        vistacomprobante 
     WHERE 
        tipo = 'Socio productor' 
        AND compra = $1) AS socio,

    COALESCE((SELECT 
                SUM(pesoneto) 
              FROM 
                vistacomprobante 
              WHERE 
                tipo = 'Socio' 
                AND compra = $1), 0) +
    COALESCE((SELECT 
                SUM(pesoneto) 
              FROM 
                vistacomprobante 
              WHERE 
                tipo = 'Socio productor' 
                AND compra = $1), 0) AS consignado;`,
        [idcompra]
      );

      res.json({
        compra: compra.rows[0].compra ?? 0,
        productor: consignado.rows[0].productor ?? 0,
        socio: consignado.rows[0].socio ?? 0,
        recolector: recolector.rows[0].recolector ?? 0,
      });
    }
  } catch (error) {
    next(error);
  }
};

//----------------------- RESUMEN ACOPIO -----------------------

const resumenAcopio = async (req, res, next) => {
  const { fecha1, fecha2 } = req.query;
  try {
    const compra = await pool.query(
      `

SELECT 
    SUM(pesoneto) AS compra
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE  tipo = 'Productor')
WHERE 
  fecha BETWEEN $1 AND $2;
    
`,
      [fecha1, fecha2]
    );
    const recolector = await pool.query(
      `
    SELECT 
    SUM(pesoneto) AS recolector
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE  tipo = 'Recolector')
WHERE 
  fecha BETWEEN $1 AND $2;
`,
      [fecha1, fecha2]
    );

    const socio = await pool.query(
      `
    SELECT 
    SUM(pesoneto) AS socio
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE  tipo = 'Socio')
WHERE 
  fecha BETWEEN $1 AND $2;
`,
      [fecha1, fecha2]
    );

    const productor = await pool.query(
      `
    SELECT 
    SUM(pesoneto) AS productor
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE  tipo = 'Socio productor')
WHERE 
  fecha BETWEEN $1 AND $2;
`,
      [fecha1, fecha2]
    );

    res.json({
      compra: compra.rows[0].compra ?? 0,
      productor: productor.rows[0].productor ?? 0,
      socio: socio.rows[0].socio,
      recolector: recolector.rows[0].recolector ?? 0,
    });
  } catch (error) {
    next(error);
  }
};

//------------------------- TOTAL DE COMPRA -------------------------

const totalCompra = async (req, res, next) => {
  const { fecha1, fecha2 } = req.query;
  try {
    const total = await pool.query(
      `
SELECT 
    SUM(pesoneto) as total
     FROM vistacomprobante
WHERE 
  fecha BETWEEN  $1 AND $2;
`,
      [fecha1, fecha2]
    );
    const compra = await pool.query(
      `
SELECT 
    SUM(pesoneto) AS compra
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE  tipo = 'Productor')
WHERE 
  fecha BETWEEN $1 AND $2;
    
`,
      [fecha1, fecha2]
    );
    const recolector = await pool.query(
      `
    SELECT 
    SUM(pesoneto) AS recolector
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE  tipo = 'Recolector')
WHERE 
  fecha BETWEEN $1 AND $2;
`,
      [fecha1, fecha2]
    );
    const consignado = await pool.query(
      `
SELECT 
    SUM(pesoneto) AS consignado
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE tipo = 'Socio' OR tipo = 'Socio productor'
)
WHERE 
  fecha BETWEEN $1 AND $2;`,
      [fecha1, fecha2]
    );

    const costo = await pool.query(
      `SELECT SUM(total) 
     FROM vistacomprobante 
     WHERE fecha BETWEEN $1 AND $2;`,
      [fecha1, fecha2]
    );
    const pago = await pool.query(
      `SELECT SUM(pago) 
     FROM vistacomprobante 
     WHERE fecha BETWEEN $1 AND $2;`,
      [fecha1, fecha2]
    );

    const totalproductores = await pool.query(
      `

SELECT COUNT(DISTINCT pk_productor) AS total_productores
FROM vistacomprobante
WHERE fecha BETWEEN $1 AND $2;

`,
      [fecha1, fecha2]
    );
    const totalcompra = await pool.query(
      `

SELECT COUNT( pk_productor) AS total_productores
FROM vistacomprobante
WHERE fecha BETWEEN $1 AND $2;

`,
      [fecha1, fecha2]
    );
    const encargados = await pool.query(
      `SELECT DISTINCT usuario FROM vistacompra WHERE fecha BETWEEN $1 AND $2 ORDER BY usuario;`,
      [fecha1, fecha2]
    );
    const partidas = await pool.query(
      `SELECT DISTINCT partida FROM vistacompra WHERE fecha BETWEEN $1 AND $2 ORDER BY partida;`,
      [fecha1, fecha2]
    );
    const fecha = `${fecha1} - ${fecha2}`;
    res.json({
      compra: compra.rows[0].compra ?? 0,
      recolector: recolector.rows[0].recolector ?? 0,
      consignado: consignado.rows[0].consignado ?? 0,
      total: total.rows[0]?.total ?? 0,
      costo: costo.rows[0].sum ?? 0,
      pago: pago.rows[0].sum ?? 0,
      fecha: fecha,
      productores: totalproductores.rows[0].total_productores ?? 0,
      compras: totalcompra.rows[0].total_productores ?? 0,
      encargado: encargados.rows ?? 0,
      partida: partidas.rows ?? 0,
    });
  } catch (error) {
    next(error);
  }
};

//------------------------- TOTAL DE COMPRA -------------------------

const totalCompraId = async (req, res, next) => {
  try {
    const { idcompra } = req.query;
    if (
      idcompra === null ||
      idcompra === undefined ||
      idcompra === "" ||
      idcompra === "false"
    ) {
      const total = await pool.query(
        `
SELECT 
    (SELECT SUM(pesoneto) 
     FROM vistacomprobante 
     WHERE compra = (SELECT idcompra FROM compra ORDER BY idcompra DESC LIMIT 1)) AS total 
FROM 
    vistacomprobante 
WHERE 
    compra = (SELECT idcompra FROM compra ORDER BY idcompra DESC LIMIT 1)  order by compra desc limit 1;
`
      );
      const compra = await pool.query(
        `SELECT 
    SUM(pesoneto) AS compra
FROM 
    vistacomprobante
WHERE 
    tipo = 'Productor' 
    AND compra = (select idcompra from compra order by idcompra desc limit 1);
`
      );
      const recolector = await pool.query(
        `SELECT 
    SUM(pesoneto) AS recolector
    FROM 
    vistacomprobante
WHERE 
    tipo = 'Recolector' 
    AND compra = (select idcompra from compra order by idcompra desc limit 1);
`
      );
      const consignado = await pool.query(`select * from totalconsignado`);
      const fecha = await pool.query(
        `SELECT  fecha
FROM vistacomprobante
WHERE compra = (SELECT idcompra FROM compra ORDER BY idcompra DESC LIMIT 1)
ORDER BY fecha DESC
LIMIT 1;
`
      );
      const costo = await pool.query(
        `SELECT SUM(total) 
     FROM vistacomprobante 
     WHERE compra = (SELECT idcompra FROM compra ORDER BY idcompra DESC LIMIT 1)
`
      );
      const pago = await pool.query(
        `SELECT SUM(pago) 
     FROM vistacomprobante 
     WHERE compra = (SELECT idcompra FROM compra ORDER BY idcompra DESC LIMIT 1)
`
      );

      const totalproductores = await pool.query(
        `

SELECT COUNT(DISTINCT pk_productor) AS total_productores
FROM vistacomprobante
WHERE compra = (
    SELECT idcompra
    FROM compra
    ORDER BY idcompra DESC
    LIMIT 1
);

`
      );
      const totalcompra = await pool.query(
        `

SELECT COUNT( pk_productor) AS total_productores
FROM vistacomprobante
WHERE compra = (
    SELECT idcompra
    FROM compra
    ORDER BY idcompra DESC
    LIMIT 1
);

`
      );
      const encargado = await pool.query(
        `
SELECT DISTINCT usuario 
FROM vistacompra

where idcompra = (
    SELECT idcompra
    FROM compra
    ORDER BY idcompra DESC
    LIMIT 1
)
`
      );
      const partida = await pool.query(
        `SELECT DISTINCT partida
FROM vistacompra 
where idcompra = (
    SELECT idcompra
    FROM compra
    ORDER BY idcompra DESC
    LIMIT 1
)`
      );

      res.json({
        compra: compra.rows[0].compra ?? 0,
        recolector: recolector.rows[0].recolector ?? 0,
        productor: consignado.rows[0].productor ?? 0,
        socio: consignado.rows[0].socio ?? 0,
        consignado: consignado.rows[0].consignado ?? 0,
        total: total.rows[0]?.total ?? 0,
        costo: costo.rows[0].sum ?? 0,
        pago: pago.rows[0].sum ?? 0,
        fecha: fecha.rows[0]?.fecha ?? "No hay fecha",
        productores: totalproductores.rows[0].total_productores ?? 0,
        compras: totalcompra.rows[0].total_productores ?? 0,
        encargado: encargado.rows[0].usuario ?? "No hay encargado",
        partida: partida.rows[0].partida ?? "No hay partida",
      });
    } else {
      const total = await pool.query(
        `SELECT SUM(pesoneto) AS total FROM vistacomprobante WHERE compra = $1 `,
        [idcompra]
      );

      const compra = await pool.query(
        `SELECT 
    SUM(pesoneto) AS compra
FROM 
    vistacomprobante
WHERE 
    tipo = 'Productor' 
    AND compra = $1;
`,
        [idcompra]
      );
      const recolector = await pool.query(
        `SELECT 
    SUM(pesoneto) AS recolector
    FROM 
    vistacomprobante
WHERE 
    tipo = 'Recolector' 
    AND compra = $1;
`,
        [idcompra]
      );
      const consignado = await pool.query(
        `SELECT 
    SUM(pesoneto) AS consignado
FROM 
   (
SELECT *
FROM vistacomprobante
WHERE tipo = 'Socio' OR tipo = 'Socio productor'
)
WHERE 
  compra = $1;
`,
        [idcompra]
      );
      const fecha = await pool.query(
        `SELECT  fecha
FROM vistacomprobante
WHERE compra = $1
`,
        [idcompra]
      );
      const costo = await pool.query(
        `SELECT SUM(total) 
     FROM vistacomprobante 
     WHERE compra = $1
`,
        [idcompra]
      );
      const pago = await pool.query(
        `SELECT SUM(pago) 
     FROM vistacomprobante 
     WHERE compra = $1
`,
        [idcompra]
      );

      const totalproductores = await pool.query(
        `

SELECT COUNT(DISTINCT pk_productor) AS total_productores
FROM vistacomprobante
WHERE compra = $1;

`,
        [idcompra]
      );
      const totalcompra = await pool.query(
        `

SELECT COUNT( pk_productor) AS total_productores
FROM vistacomprobante
WHERE compra = $1;
`,
        [idcompra]
      );
      const encargado = await pool.query(
        `SELECT DISTINCT usuario FROM vistacompra where idcompra = $1`,
        [idcompra]
      );
      const partida = await pool.query(
        `SELECT DISTINCT partida FROM vistacompra where idcompra = $1`,
        [idcompra]
      );
      res.json({
        compra: compra.rows[0].compra ?? 0,
        recolector: recolector.rows[0].recolector ?? 0,
        productor: consignado.rows[0].productor ?? 0,
        socio: consignado.rows[0].socio,
        consignado: consignado.rows[0].consignado ?? 0,
        total: total.rows[0]?.total ?? 0,
        costo: costo.rows[0].sum ?? 0,
        pago: pago.rows[0].sum ?? 0,
        fecha: fecha.rows[0]?.fecha ?? "No hay fecha",
        productores: totalproductores.rows[0].total_productores ?? 0,
        compras: totalcompra.rows[0].total_productores ?? 0,
        encargado: encargado.rows[0].usuario ?? "No hay encargado",
        partida: partida.rows[0].partida ?? "No hay partida",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllcompras,
  listadoCompras,
  compras,
  resumenAcopio,
  totalCompra,
  resumenAcopioid,
  totalCompraId,
};
