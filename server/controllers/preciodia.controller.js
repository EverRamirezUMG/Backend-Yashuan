const pool = require("../db");

//------------------------------------ MOSTRAR TODOS LOS PRECIOS --------------------------------------
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

//------------------------------------- CREAR NUEVOS PRECIOS ----------------------------------------

module.exports = {
  getPrecioDia,
};
