const pool = require("../db");

//------------------------ VERIFICAR SI EL USUARIO TIENE UNA COMPRA ACTIVA ------------------------
const costoproduccion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = await pool.query(
      `SELECT 
        partida.idpartida AS id, 
        partida.partida,
        partida.fechabodega AS fecha_bodega, 
        proceso.proceso,
       ROUND( ingreso_pergamino.cantidad, 2) as cantidad,
        ROUND(partida.rendimiento, 4) AS rendimiento,
         ROUND(partida.pesototalmaduro, 2) as pesototalmaduro,
        precio_dia.preciobase AS precio
      FROM partida 
      LEFT JOIN ingreso_pergamino ON partida.idpartida = ingreso_pergamino.fk_partida
      LEFT JOIN proceso ON ingreso_pergamino.fk_proceso = proceso.idproceso
      LEFT JOIN compra ON compra.fk_partida = idpartida
      LEFT JOIN precio_dia ON compra.fk_preciodia = precio_dia.idpreciodia 
      WHERE fk_proceso = $1`,
      [id]
    );

    const gastobeneficio = await pool.query(
      `select * from beneficio order by id desc limit 1`
    );

    const beneficiog = parseFloat(gastobeneficio.rows[0]?.beneficio ?? 0);
    const otros = parseFloat(gastobeneficio.rows[0]?.otros ?? 0);
    const total = beneficiog + otros ?? 0;

    const resultados = datos?.rows.map((row) => {
      const costoTotalMaduro = row.pesototalmaduro * row.precio ?? 0;
      const beneficio = parseFloat((row?.cantidad * total ?? 0).toFixed(2));
      const costoTotalBeneficio = costoTotalMaduro + beneficio ?? 0;
      const costoQuintal =
        row.cantidad > 0 ? costoTotalBeneficio / row.cantidad : 0; // Evitar división por cero

      return {
        id: row.id,
        partida: row.partida,
        fecha_bodega: row.fecha_bodega,
        proceso: row.proceso,
        cantidad: row.cantidad,
        precio: row.precio,
        rendimiento: row.rendimiento,
        pesototalmaduro: row.pesototalmaduro,
        costoTotalMaduro,
        beneficio,
        costoTotalBeneficio,
        costoQuintal,
      };
    });

    res.json(resultados); // Retornar el array de resultados como JSON
  } catch (error) {
    next(error);
  }
};

//------------------ OBTENER GASTO DE BENEFICIO ------------------
const gastoBeneficio = async (req, res, next) => {
  try {
    const gastobeneficio = await pool.query(
      `select * from beneficio order by id desc limit 1`
    );

    res.json(gastobeneficio.rows[0]);
  } catch (error) {
    next(error);
  }
};

//--------------- INGRESAR DATOS DE GASTO DE BENEFICIO ----------------
const ingresarGastoBeneficio = async (req, res, next) => {
  try {
    const { beneficio, otros } = req.body;
    const result = await pool.query(`call insertargastobeneficio ($1, $2)`, [
      beneficio,
      otros,
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { costoproduccion, gastoBeneficio, ingresarGastoBeneficio };
