const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const e = require("express");
const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  const { nombre, apellido, alias, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `call insertarUsuario ($1, $2, $3, $4, $5)`,
      [nombre, apellido, alias, email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, contrasenia } = req.body; // Cambiado de correo a email
  console.log(req.body);

  try {
    const user = await pool.query(
      "SELECT * FROM usuario WHERE email = $1 ",
      [email] // Cambiado de correo a email
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials email" });
    }

    const validPassword = await bcrypt.compare(
      contrasenia,
      user.rows[0].contrasenia
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials password" });
    }

    const activo = user.rows[0].activo;
    if (activo === true) {
      console.log("Usuario activo");
      const token = jwt.sign(
        { userId: user.rows[0].pk_usuario },
        process.env.JWT_SECRET,
        {
          expiresIn: "10h",
        }
      );

      res.json({ token });
    } else {
      res.status(401).json({ error: "Usuario inactivo" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Rutas protegidas
// Rutas protegidas
router.get("/home", authenticateToken, (req, res) => {
  //  res.json(req.user);
  res.json("Welcome to the home page");
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
