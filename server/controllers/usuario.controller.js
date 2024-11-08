const pool = require("../db");
const bcrypt = require("bcryptjs");

//------------------------------------ MOSTRAR TODOS LOS USUARIOS --------------------------------------
const getAllusuarios = async (req, res, next) => {
  try {
    const { activo } = req.params;
    const allusuarios = await pool.query(
      "select * from vistausuario WHERE activo = $1",
      [activo]
    );

    // Modificar cada usuario para agregar la URL completa de la imagen
    const usuariosConImagen = allusuarios.rows.map((usuario) => {
      if (usuario.imagen) {
        usuario.imagenUrl = `${req.protocol}://${req.get("host")}/uploads/${
          usuario.imagen
        }`;
      }
      return usuario;
    });

    res.json(usuariosConImagen);
  } catch (error) {
    next(error);
  }
};

//------------------------------------- MOSTRAR UN SOLO USUARIO ----------------------------------------
const getUsuarios = async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const result = await pool.query(
      "SELECT * FROM vistaperfil WHERE codigo = $1",
      [codigo]
    );

    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Usuario no encontrado",
      });

    const usuario = result.rows[0];
    if (usuario.imagen) {
      usuario.imagenUrl = `${req.protocol}://${req.get("host")}/uploads/${
        usuario.imagen
      }`;
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

//---------------CREAR UN NUEVO USUARIO ------------------
const crearUsuarios = async (req, res, next) => {
  try {
    const { nombre, apellido, alias, email, contrasenia } = req.body;
    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    const imagen = req.file ? req.file.filename : null; // Aquí obtenemos el nombre del archivo
    console.log(imagen);
    const fecha_creacion = new Date().toISOString();
    const result = await pool.query(
      `call insertarUsuario ($1, $2, $3, $4, $5, $6, $7)`,
      [nombre, apellido, alias, email, hashedPassword, imagen, fecha_creacion]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// const crearUsuarios = async (req, res, next) => {
//   try {
//     const { nombre, apellido, aliaas, email, contrasenia } = req.body;
//     const hashedPassword = await bcrypt.hash(contrasenia, 10);
//     const result = await pool.query(
//       `call beneficio.insertarUsuario ($1, $2, $3, $4, $5)`,
//       [nombre, apellido, aliaas, email, hashedPassword]
//     );

//     res.json(result.rows[0]);
//   } catch (error) {
//     next(error);
//   }
// };

//--------------------- ACTUALIZAR DATOS DE USUARIO -----------------------------------------

const actualizarUsuarios = async (req, res, next) => {
  const { codigo } = req.params;

  try {
    const { nombre, apellido, alias, telefono, cargo } = req.body;

    const result = await pool.query(
      "UPDATE usuario SET nombre = $1,apellido = $2, aliaas= $3, telefono = $4, fk_cargo = $5 WHERE pk_usuario = $6 RETURNING *",
      [nombre, apellido, alias, telefono, cargo, codigo]
    );
    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//---------------------- ACTIVAR/DESACTIVAR USUARIO --------------------------

const activarUsuarios = async (req, res, next) => {
  const { codigo } = req.params;
  const { estado } = req.body;
  try {
    const result = await pool.query(
      "UPDATE usuario SET activo = $1 WHERE pk_usuario = $2 RETURNING *",
      [estado, codigo]
    );
    if (result.rows.length === 0)
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

//---------------------- ELIMINAR USUARIO --------------------------
const eliminarUsuarios = async (req, res) => {
  const { codigo } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM usuario WHERE pk_usuario = $1",
      [codigo]
    );

    if (result.rowCount === 0)
      return res.status(404).json({
        message: "Usuario no encontrado",
      });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllusuarios,
  getUsuarios,
  crearUsuarios,
  actualizarUsuarios,
  activarUsuarios,
  eliminarUsuarios,
};
