const pool = require("../db");

//------------------------------------ MOSTRAR TODOS LOS USUARIOS --------------------------------------
const productores = async (req, res, next) => {
  try {
    const AllProductores = await pool.query(
      "select * from productor where activo = true order by pk_productor desc"
    );
    res.json(AllProductores.rows);
  } catch (error) {
    next(error);
  }
};

//------------------------- SELECCIONAR UN SOLO PRODUCTOR -------------------------

const productor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productor = await pool.query(
      `select * from productor where pk_productor = $1`,
      [id]
    );
    res.json(productor.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
    next(error);
  }
};
//-------------- CREAR NUEVO PRODUCTOR ----------------

const crearProductor = async (req, res, next) => {
  try {
    const { nombre, telefono } = req.body;
    const newProductor = await pool.query(`call insertarProductor ($1, $2)`, [
      nombre,
      telefono,
    ]);
    res.json(newProductor.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

//-------------- ACTUALIZAR PRODUCTOR ----------------
const actualizarProductor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono } = req.body;
    const result = await pool.query(
      `
       update productor set nombre = $1, telefono = $2 where pk_productor = $3;
      `,
      [nombre, telefono, id]
    );
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Productor actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Productor no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

//----------------------  ELIMINAR PRODUCTOR ---------------------
const eliminarProductor = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await pool.query(
      `
      update productor set activo = false where pk_productor = $1;
    `,
      [id]
    );
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Productor eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Productor no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};

module.exports = {
  productores,
  pagar,
  crearProductor,
  actualizarProductor,
  eliminarProductor,
  productor,
};
