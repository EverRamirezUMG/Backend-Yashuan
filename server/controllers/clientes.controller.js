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
from cliente where activo = true
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
from cliente where activo = true and fecha_creacion between $1 and $2
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

//------------- Actualizar Cliente ------------------
const actualizarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;
    const result = await pool.query(
      `
       update cliente set nombre = $1, telefono = $2, email = $3 where pk_cliente = $4;
      `,
      [nombre, telefono, email, id]
    );
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Cliente actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    next(error);
  }
};

// ----------------------- DESACRTIVAR CLIENTE -----------------------

const desactivarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clientes = await pool.query(
      `
         update cliente set activo = false where pk_cliente = $1;
  
  `,
      [id]
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
  actualizarCliente,
  desactivarCliente,
};
