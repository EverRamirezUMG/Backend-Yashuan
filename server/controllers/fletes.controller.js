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

module.exports = {
  fletes,
};

//where fecha between (select fechainicio( CURRENT_DATE)) and (select fechafin( CURRENT_DATE))
