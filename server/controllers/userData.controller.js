const pool = require("../db");

//------------------------------------- MOSTRAR UN SOLO USUARIO POR EMAIL ----------------------------------------
const getEmailUsuarios = async (req, res, next) => {
  try {
    const { email } = req.params;
    const result = await pool.query(
      "SELECT * FROM vistausuario WHERE email = $1",
      [email]
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

module.exports = {
  getEmailUsuarios,
};
