const pool = require("../db");

//------------------ MOSTRAR TODOS LOS CLIENTES ------------------

const clientes = async (req, res, next) => {
  try {
    const clientes = await pool.query(`select 
pk_cliente as id,
nombre,
telefono,
email,
dpi, 
fecha_creacion as fecha
from cliente
order by pk_cliente desc
`);
    res.json(clientes.rows);
  } catch (error) {
    next(error);
  }
};

//------------------ MOSTRAR UN SOLO CLIENTE ------------------
const cliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await pool.query(
      `select 
    pk_cliente as id,
    nombre,
    telefono,
    email,
    dpi,
    fecha_creacion as fecha
    from cliente where pk_cliente = $1
    `,
      [id]
    );
    const compras = await pool.query(
      `SELECT COUNT(pk_venta) 
FROM venta
WHERE fk_cliente = $1`,
      [id]
    );
    const muestras = await pool.query(
      `SELECT COUNT(idmuestra) 
FROM muestra
WHERE fk_cliente = $1`,
      [id]
    );

    const info = cliente.rows[0] || null;
    const comprasCount = compras.rows[0].count || 0;
    const muestrasCount = muestras.rows[0].count || 0;
    const result = { ...info, compras: comprasCount, muestras: muestrasCount };
    res.json(result);
  } catch (error) {
    next(error);
  }
};

//------------------ MOSTRAR TODOS LOS CLIENTES ------------------

const rangoClientes = async (req, res, next) => {
  try {
    const { fecha1, fecha2 } = req.query;
    const clientes = await pool.query(
      `select 
pk_cliente as id,
nombre,
telefono,
email,
dpi, 
fecha_creacion as fecha
from cliente where fecha_creacion between $1 and $2
`,
      [fecha1, fecha2]
    );
    res.json(clientes.rows);
  } catch (error) {
    next(error);
  }
};

//------------------- CREAR CLIENTE -------------------
const ingresarClientes = async (req, res, next) => {
  try {
    const { nombre, telefono, email, dpi } = req.body;
    const clientes = await pool.query(
      `
        CALL insertarCliente ( $1, $2, $3, $4)

`,
      [nombre, telefono, email, dpi]
    );
    res.json(clientes.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  clientes,
  ingresarClientes,
  rangoClientes,
  cliente,
};
