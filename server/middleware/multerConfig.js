const multer = require("multer");
const path = require("path");

// Configuración de multer para almacenar las imágenes en una carpeta
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.resolve("./uploads")); // Aquí puedes cambiar el directorio de almacenamiento
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

module.exports = multer({ storage: storage });
