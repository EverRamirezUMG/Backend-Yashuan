const pool = require("../db");

//------------------------------------ MOSTRAR TODOS LOS USUARIOS --------------------------------------
const productores = async (req, res, next) => {
  try {
    const AllProductores = await pool.query("select * from productor");
    res.json(AllProductores.rows);
  } catch (error) {
    next(error);
  }
};

//------------------------- PAGAR CONSIGNADO -------------------------

const pagar = async (req, res, next) => {
  try {
    const { idcomprobante } = req.params;
    const pagar = await pool.query(
      `update comprobante set pago = total where pk_comprobante = $1
`,
      [idcomprobante]
    );
    res.json(pagar.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  productores,
  pagar,
};
