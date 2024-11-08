const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const usuarioRouter = require("./routes/usuario.routes");
const userDataRouter = require("./routes/userData.routes");
const permisosRouter = require("./routes/permiso.routes");
const preciodiaRouter = require("./routes/preciodia.routes");
const productoresRouter = require("./routes/productores.routes");
const costoProduccionRouter = require("./routes/costoproduccion.routes");
const rendimientoRouter = require("./routes/remdimiento.routes");
const inventarioRouter = require("./routes/inventario.routes");
const muestrasRouter = require("./routes/muestras.routes");
const resumenRouter = require("./routes/resumen.routes");
const compraRouter = require("./routes/compra.routes");
const ventasRouter = require("./routes/ventas.routes");
const envioRouter = require("./routes/envio.routes");
const clientesRouter = require("./routes/clientes.routes");
const fletesRouter = require("./routes/fletes.routes");
const vehiculosRouter = require("./routes/vehiculos.routes");
const procesosRouter = require("./routes/procesos.routes");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/", authRoutes);
app.use("/", usuarioRouter);
app.use("/", userDataRouter);
app.use("/permiso", permisosRouter);
app.use("/", preciodiaRouter);
app.use("/productores", productoresRouter);
app.use("/acopio", compraRouter);
app.use("/resumen", resumenRouter);
app.use("/inventario", inventarioRouter);
app.use("/costoproduccion", costoProduccionRouter);
app.use("/rendimiento", rendimientoRouter);
app.use("/muestras", muestrasRouter);
app.use("/ventas", ventasRouter);
app.use("/envio", envioRouter);
app.use("/clientes", clientesRouter);
app.use("/fletes", fletesRouter);
app.use("/vehiculos", vehiculosRouter);
app.use("/procesos", procesosRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
