const pool = require("../db");

//------------------------- OBTENER INFORMACION DE PRECIO Y ESTADO INICAL DE LA COMPRA  -------------------------
const acopio = async (req, res, next) => {
  try {
    const precioDiaResult = await pool.query(
      "select preciobase, recolector, socio, especial, fecha from precio_dia order by idpreciodia desc limit 1"
    );
    const precioFleteResult = await pool.query(
      "select precio from precio_flete order by idprecioflete desc limit 1"
    );
    const partidaResult = await pool.query(
      "select partida from partida order by idpartida desc limit 1"
    );

    const precioDia = precioDiaResult.rows[0];
    const precioFlete = precioFleteResult.rows[0];
    const partida = partidaResult.rows[0];

    res.json({ precioDia, precioFlete, partida });
  } catch (error) {
    next(error);
  }
};

//------------------------ VIRIFICAR SI EL USUARIO TIENE UNA COMPRA ACTIVA ------------------------
const verificarCompra = async (req, res, next) => {
  try {
    const verificar = await pool.query(
      "select activo from auxcompra order by idaux desc limit 1"
    );
    res.json(verificar.rows[0].activo);
  } catch (error) {
    next(error);
  }
};

//------------------------- INICIAR COMPRA -------------------------
const inicarCompra = async (req, res, next) => {
  try {
    const activoResult = await pool.query(
      "select activo, fk_usuario from auxcompra order by idaux desc limit 1"
    );
    const activo = activoResult.rows[0].activo;
    const idusuario = activoResult.rows[0].fk_usuario;
    if (activo === true) {
      res.status(400).json({
        message: `No se puede iniciar una nueva compra porque el usuario ${idusuario} tiene iniciado una compra`,
      });
    } else if (activo === false) {
      const { codigo } = req.params;
      const { base, socio, recolector, especial, flete, partida } = req.body;
      const iniciar = await pool.query(
        `call iniciarcompra ($1, $2, $3, $4, $5, $6, $7)`,
        [base, socio, recolector, especial, flete, partida, codigo]
      );

      res.json({
        message: `Compra iniciada por el usuario ${codigo}`,
        data: iniciar.rows.length > 0 ? iniciar.rows[0] : null,
      });
    }
  } catch (error) {
    next(error);
  }
};

//------------------------- REALIZAR COMPRA -------------------------

const comprar = async (req, res, next) => {
  try {
    const {
      id_productor,
      tipo,
      nombre_prod,
      peso_bruto,
      tara,
      consignar,
      observacion,
      con_flete,
      vehiculo,
      codigo,
    } = req.body;
    const activoResult = await pool.query(
      "select activo, fk_usuario from auxcompra order by idaux desc limit 1"
    );
    const PermisoCompraResult = await pool.query(
      "SELECT * FROM permiso where fk_usuario = $1",
      [codigo]
    );
    const activo = activoResult.rows[0].activo;
    const idusuario = activoResult.rows[0].fk_usuario;
    if (activo === true && PermisoCompraResult.rows[0].compra === true) {
      const comprar = await pool.query(
        `call insertarComprobante($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          id_productor,
          tipo,
          nombre_prod,
          peso_bruto,
          tara,
          consignar,
          observacion,
          con_flete,
          vehiculo,
          codigo,
        ]
      );
      res.json(comprar.rows[0]);
    } else {
      if (PermisoCompraResult.rows[0].compra === false) {
        res.status(400).json({
          message: `No se puede ingresar datos porque no tiene permiso para comprar`,
        });
      } else {
        res.status(400).json({
          message: `No se puede ingresar datos porque no se tiene iniciado una compra`,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

//------------------------- ACTUALIZAR COMPRA -------------------------
const actualizarCompra = async (req, res, next) => {
  try {
    const { idcomprobante } = req.params;
    const { peso_bruto, tara, consignar, tipo, observacion } = req.body;

    try {
      const result = await pool.query(
        `call actualizarcomprobante($1, $2, $3, $4, $5, $6 )`,
        [idcomprobante, peso_bruto, tara, consignar, tipo, observacion]
      );
      res.json({
        message: "¡Actualizado!",
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar el comprobante",
        error: error.message,
      });
    }
  } catch (error) {
    next(error);
  }
};
//------------------------- OBTENER UNA COMPRA -------------------------
const getCompra = async (req, res, next) => {
  try {
    const { idcomprobante } = req.params;
    const result = await pool.query(
      "SELECT * FROM vistacomprobante WHERE pk_comprobante = $1",
      [idcomprobante]
    );
    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Compra no encontrada",
      });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//------------------------- TOTAL DE COMPRA -------------------------

const totalCompra = async (req, res, next) => {
  try {
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

    const semana = await pool.query(
      `

 SELECT
        DATE(fecha) AS dia,
        SUM(pesoneto) AS quintales
      FROM  comprobante
      WHERE fecha >= NOW() - INTERVAL '6 days'
      GROUP BY dia
      ORDER BY dia;

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

    res.json({
      compra: compra.rows[0].compra,
      recolector: recolector.rows[0].recolector,
      productor: consignado.rows[0].productor,
      socio: consignado.rows[0].socio,
      consignado: consignado.rows[0].consignado,
      total: total.rows[0]?.total ?? 0,
      costo: costo.rows[0].sum,
      pago: pago.rows[0].sum,
      fecha: fecha.rows[0]?.fecha ?? "No hay fecha",
      semana: semana.rows,
      productores: totalproductores.rows[0].total_productores,
      compras: totalcompra.rows[0].total_productores,
    });
  } catch (error) {
    next(error);
  }
};

//----------------------- RESUMEN ACOPIO -----------------------

const resumenAcopio = async (req, res, next) => {
  try {
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
      compra: compra.rows[0].compra,
      productor: consignado.rows[0].productor,
      socio: consignado.rows[0].socio,
      recolector: recolector.rows[0].recolector,
    });
  } catch (error) {
    next(error);
  }
};

//------------------------- FINALIZAR COMPRA -------------------------
const finalizarCompra = async (req, res, next) => {
  try {
    const { maduro, codigo } = req.body;
    const finalizar = await pool.query(`call finalizarcompra ($1, $2)`, [
      maduro,
      codigo,
    ]);
    res.json(finalizar.rows[0]);
  } catch (error) {
    next(error);
  }
};

//------------ PRECIO DEL DIA ----------------
const getPrecioDia = async (req, res, next) => {
  try {
    const allPrecio = await pool.query(
      "SELECT * FROM precio_dia order by idpreciodia desc limit 1"
    );
    res.json(allPrecio.rows);
  } catch (error) {
    next(error);
  }
};

//--------------  GENERAR COMPROBANTE DE COMPRA ----------------
const comprobante = async (req, res, next) => {
  const { codigo_productor, nombre_productor } = req.query;
  try {
    if (
      codigo_productor === "null" ||
      codigo_productor === "undefined" ||
      codigo_productor === null
    ) {
      const comprobante = await pool.query(
        `select * from vistacomprobante  where nombre = $1 and compra = (select idcompra from compra order by idcompra desc limit 1) order by compra limit 1 
      `,
        [nombre_productor]
      );
      res.json(comprobante.rows);
    } else {
      const comprobante = await pool.query(
        `select * from vistacomprobante  where pk_productor = $1 and compra = (select idcompra from compra order by idcompra desc limit 1) order by compra limit 1
`,
        [codigo_productor]
      );

      res.json(comprobante.rows);
    }
  } catch (error) {
    next(error);
  }
};

const getAllcompras = async (req, res, next) => {
  try {
    const allcompras = await pool.query(
      "select * from vistacomprobante  where compra = (select idcompra from compra order by idcompra desc limit 1)"
    );
    res.json(allcompras.rows);
  } catch (error) {
    next(error);
  }
};

const vehiculos = async (req, res, next) => {
  try {
    const allvehiculo = await pool.query(
      `
select 
pk_vehiculo as codigo,
marca || ' ' || color as vehiculo,
aliaas as alias
from vehiculo where activo = true
`
    );
    res.json(allvehiculo.rows);
  } catch (error) {
    next(error);
  }
};

//------------------------- TIPO PRODUCTOR -------------------------
const tipo_productor = async (req, res, next) => {
  try {
    const allTipo = await pool.query(`select * from tipo_productor`);
    res.json(allTipo.rows);
  } catch (error) {
    next(error);
  }
};

//--------------- ELIMINAR COMPRA ----------------

const eliminarCompra = async (req, res, next) => {
  try {
    const { idcomprobante } = req.params;
    const result = await pool.query(
      "DELETE FROM comprobante WHERE pk_comprobante = $1",
      [idcomprobante]
    );

    if (result.rowCount === 0)
      return res.status(404).json({
        message: "Compra no encontrada",
      });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  acopio,
  getPrecioDia,
  getAllcompras,
  inicarCompra,
  finalizarCompra,
  verificarCompra,
  comprar,
  resumenAcopio,
  totalCompra,
  vehiculos,
  comprobante,
  actualizarCompra,
  getCompra,
  tipo_productor,
  eliminarCompra,
};
