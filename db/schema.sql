--@block
CREATE DOMAIN "domDirecciones" AS VARCHAR(150);
CREATE DOMAIN "domTelefonos" AS VARCHAR(18);
CREATE DOMAIN "domRIF" AS VARCHAR(12);
CREATE DOMAIN "domCedulas" AS INT;
CREATE DOMAIN "domMontos" AS DECIMAL(14, 2) CHECK(VALUE > 0);
CREATE DOMAIN "domModelos" AS VARCHAR(20);
CREATE DOMAIN "domPorcentajes" AS DECIMAL(5, 2) CHECK(VALUE BETWEEN 0 AND 100);
CREATE DOMAIN "domCantidades" AS INT CHECK(VALUE > 0);

--@block
CREATE TABLE "Empleados"(
	"cedEmpleado" "domCedulas" NOT NULL,
	"nombre" VARCHAR(30) NOT NULL,
	"apellido" VARCHAR(30) NOT NULL,
	"telefono" "domTelefonos",
	"direccion" "domDirecciones" NOT NULL,
	"sueldo" "domMontos",
	"usuario" VARCHAR(35) UNIQUE NOT NULL,
	"contrasena" VARCHAR(255) NOT NULL,
	"rifSucursal" "domRIF",
	"tipoEmpleado" VARCHAR(9) NOT NULL,
	CONSTRAINT "tipoEmpleadoValido"
	CHECK("tipoEmpleado" IN ('dueño', 'personal', 'encargado')),
	CONSTRAINT "esDueño"
	CHECK("tipoEmpleado" = 'dueño' OR "rifSucursal" IS NOT NULL),
	PRIMARY KEY("cedEmpleado")
);

--@block
CREATE TABLE "Sucursales"(
	"rifSucursal" "domRIF" NOT NULL,
	"nombre" VARCHAR(40) NOT NULL,
	"direccion" "domDirecciones" NOT NULL,
	"ciudad" VARCHAR(20) NOT NULL,
	"fechaInvFisico" DATE,
	"fechaInicioEncargado" DATE,
	PRIMARY KEY("rifSucursal")
);

--@block 
CREATE TABLE "Vehiculos"(
	"codVehiculo" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"placa" VARCHAR(10) UNIQUE NOT NULL,
	"fechaAdquisicion" DATE NOT NULL,
	"fechaRegistro" TIMESTAMP NOT NULL,
	"cedCliente" "domCedulas" NOT NULL,
	"marca" "domModelos" NOT NULL,
	"modelo" "domModelos" NOT NULL,
	"nombreMecanico" VARCHAR(60),
	"tlfMecanico" "domTelefonos",
	CONSTRAINT "mecanicoValido"
	CHECK("nombreMecanico" IS NOT NULL OR "tlfMecanico" IS NULL),
	PRIMARY KEY("codVehiculo")
);

--@block
CREATE TABLE "TiposVehiculos"(
	"codTipoVehiculo" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"nombre" VARCHAR(30) NOT NULL,
	"descripcion" VARCHAR(500) NOT NULL,
	PRIMARY KEY("codTipoVehiculo")
);

--@block
CREATE TABLE "Clientes"(
	"cedCliente" "domCedulas" NOT NULL,
	"nombre" VARCHAR(60) NOT NULL,
	"email" VARCHAR(40) UNIQUE NOT NULL,
	"tlfPrincipal" "domTelefonos" NOT NULL,
	"tlfAlternativo" "domTelefonos" NOT NULL,
	PRIMARY KEY("cedCliente")
);

--@block
CREATE TABLE "Modelos"(
	"marca" "domModelos" NOT NULL,
	"modelo" VARCHAR(20) NOT NULL,
	"descripcion" VARCHAR(500) NOT NULL,
	"peso" REAL NOT NULL,
	"octanaje" SMALLINT NOT NULL
	CHECK("octanaje" IN (91, 95)),
	"numPuestos" "domCantidades" NOT NULL,
	"tipoAceiteMotor" VARCHAR(20) NOT NULL,
	"tipoAceiteCaja" VARCHAR(20) NOT NULL,
	"tipoRefrigerante" VARCHAR(20) NOT NULL,
	"codTipoVehiculo" INT NOT NULL,
	PRIMARY KEY("marca", "modelo")
);

--@block
CREATE TABLE "MantenimientosPasados"(
	"codVehiculo" INT NOT NULL,
	"fechaMant" DATE NOT NULL,
	"descripcion" VARCHAR(500) NOT NULL,
	PRIMARY KEY("codVehiculo", "fechaMant")
);

--@block
CREATE TABLE "Servicios"(
	"codServicio" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"nombre" VARCHAR(60) NOT NULL,
	"descripcion" VARCHAR(500) NOT NULL,
	"minTiempoReserva" INTERVAL,
	"porcentajeAbono" "domPorcentajes",
	CONSTRAINT "abonoValido"
	CHECK("porcentajeAbono" BETWEEN 20 AND 50),
	CONSTRAINT "requiereReserva"
	CHECK(("minTiempoReserva" IS NULL AND "porcentajeAbono" IS NULL) OR ("minTiempoReserva" IS NOT NULL AND "porcentajeAbono" IS NOT NULL)),
	PRIMARY KEY("codServicio")
);

--@block
CREATE TABLE "Asignado"(
	"cedEmpleado" "domCedulas" NOT NULL,
	"codServicio" INT NOT NULL,
	"esCoordinador" BOOL NOT NULL,
	PRIMARY KEY("cedEmpleado", "codServicio")
);

--@block
CREATE TABLE "Actividades"(
	"codServicio" INT NOT NULL,
	"nroActividad" INT NOT NULL,
	"precio" "domMontos" NOT NULL,
	"descripcion" VARCHAR(500) NOT NULL,
	"capacidad" "domCantidades" NOT NULL,
	PRIMARY KEY("codServicio", "nroActividad")
);

--@block
CREATE TABLE "Reservaciones"(
	"nroReserva" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"fechaReserva" TIMESTAMP NOT NULL,
	"codServicio" INT NOT NULL,
	"fechaActividad" TIMESTAMP NOT NULL,
	"montoAbonado" "domMontos" NOT NULL,
	"rifSucursal" "domRIF" NOT NULL,
	"cedCliente" "domCedulas" NOT NULL,
	"nroSolicitud" INT,
	CONSTRAINT "fechasValidas"
	CHECK("fechaReserva" < "fechaActividad"),
	PRIMARY KEY("nroReserva")
);

--@block
CREATE TABLE "FacturasClientes"(
	"nroFactura" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"fechaFacturacion" TIMESTAMP NOT NULL,
	"tipoFactura" VARCHAR(8) NOT NULL,
	"rifSucursal" "domRIF" NOT NULL,
	"cedCliente" "domCedulas" NOT NULL,
	"descuento" "domPorcentajes"
	CONSTRAINT "tipoFacturaValido"
	CHECK("tipoFactura" IN ('servicio', 'venta')),
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasServicios"(
	"nroFactura" INT NOT NULL,
	"nroSolicitud" INT NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasVentas"(
	"nroFactura" INT NOT NULL,
	"nroPago" INT NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasProveedores"(
	"nroFactura" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"fechaPago" TIMESTAMP NOT NULL,
	"fechaFacturacion" TIMESTAMP NOT NULL,
	"codOrdCompra" INT NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "Pagos"(
	"nroFactura" INT NOT NULL,
	"nroPago" INT NOT NULL,
	"monto" "domMontos" NOT NULL,
	"fechaPago" TIMESTAMP NOT NULL,
	"moneda" VARCHAR(7) NOT NULL
	CHECK("moneda" IN ('bolívar', 'divisa')),
	"nroTarjeta" INT,
	"banco" VARCHAR(30),
	"codModalidad" INT NOT NULL,
	PRIMARY KEY("nroFactura", "nroPago")
);


--@block
CREATE TABLE "Modalidades"(
	"codModalidad" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"nombreModalidad" VARCHAR(30) NOT NULL,
	PRIMARY KEY("codModalidad")
);

--@block
CREATE TABLE "Productos"(
	"codProducto" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"nombre" VARCHAR(30) NOT NULL,
	"descripcion" VARCHAR(80) NOT NULL,
	"codLinea" INT NOT NULL,
	"fabricante" VARCHAR(20) NOT NULL,
	"esEcologico" BOOL NOT NULL,
	"precio" "domMontos" NOT NULL,
	"nivelMinimo" INT NOT NULL CHECK("nivelMinimo" >= 0),
	"nivelMaximo" INT NOT NULL CHECK("nivelMaximo" > "nivelMinimo"),
	"tipoProducto" VARCHAR(8) NOT NULL
	CHECK("tipoProducto" IN ('venta', 'servicio')),
	PRIMARY KEY("codProducto")
);

--@block
CREATE TABLE "ProductosServicios"(
	"codProducto" INT NOT NULL,
	PRIMARY KEY("codProducto")
);

--@block
CREATE TABLE "ProductosVentas"(
	"codProducto" INT NOT NULL,
	PRIMARY KEY("codProducto")
);

--@block
CREATE TABLE "Lineas"(
	"codLinea" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"descripcion" VARCHAR(80) NOT NULL,
	PRIMARY KEY("codLinea")
);

--@block
CREATE TABLE "SolicitudesServicio"(
	"nroSolicitud" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"fechaEntrada" TIMESTAMP NOT NULL,
	"fechaSalidaEstimada" TIMESTAMP NOT NULL,
	"fechaSalidaReal" TIMESTAMP,
	"codVehiculo" INT NOT NULL,
	"rifSucursal" "domRIF" NOT NULL,
	"autorizado" VARCHAR(60),
	CONSTRAINT "entradaSalida" CHECK("fechaEntrada" < "fechaSalidaEstimada"),
	PRIMARY KEY("nroSolicitud")
);

--@block
CREATE TABLE "Proveedores"(
	"rifProveedor" "domRIF" NOT NULL,
	"razonSocial" VARCHAR(50) NOT NULL,
	"direccion" "domDirecciones" NOT NULL,
	"personaContacto" VARCHAR(60) NOT NULL,
	"telefonoCelular" "domTelefonos" NOT NULL,
	"telefonoLocal" "domTelefonos" NOT NULL,
	PRIMARY KEY("rifProveedor")
);

--@block
CREATE TABLE "OrdenesServicio"(
	"nroSolicitud" INT NOT NULL,
	"codServicio" INT NOT NULL,
	"nroActividad" INT NOT NULL,
	"codProducto" INT NOT NULL,
	"fecha" TIMESTAMP NOT NULL,
	"cedEmpleado" "domCedulas" NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	"unidadMedida" VARCHAR(12) NOT NULL,
	PRIMARY KEY("nroSolicitud", "codServicio", "nroActividad", "codProducto", "fecha")
);

--@block
CREATE TABLE "OrdenesCompra"(
	"codOrdCompra" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"fecha" TIMESTAMP NOT NULL,
	"rifProveedor" "domRIF" NOT NULL,
	"rifSucursal" "domRIF" NOT NULL,
	PRIMARY KEY("codOrdCompra")
);

--@block
CREATE TABLE "ListasMantenimientos"(
	"marca" "domModelos" NOT NULL,
	"modelo" "domModelos" NOT NULL,
	"tiempoUso" INTERVAL NOT NULL,
	"kilometraje" REAL NOT NULL CHECK("kilometraje" >= 0),
	"mantenimiento" VARCHAR(100) NOT NULL,
	PRIMARY KEY("marca", "modelo", "tiempoUso", "kilometraje", "mantenimiento")
);

--@block
CREATE TABLE "Admite"(
	"rifSucursal" "domRIF" NOT NULL,
	"codTipoVehiculo" INT NOT NULL,
	PRIMARY KEY("rifSucursal", "codTipoVehiculo")
);

--@block
CREATE TABLE "Distribuye"(
	"rifProveedor" "domRIF" NOT NULL,
	"codProducto" INT NOT NULL,
	PRIMARY KEY("rifProveedor", "codProducto")
);

--@block
CREATE TABLE "Pide"(
	"codOrdCompra" INT NOT NULL,
	"codProducto" INT NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	"precio" "domMontos",
	PRIMARY KEY("codOrdCompra", "codProducto")
);

--@block
CREATE TABLE "Almacena"(
	"rifSucursal" "domRIF" NOT NULL,
	"codProducto" INT NOT NULL,
	"existenciaTeorica" INT CHECK("existenciaTeorica" >= 0),
	"cantidadFisica" INT CHECK("cantidadFisica" >= 0),
	PRIMARY KEY("rifSucursal", "codProducto")
);

--@block
CREATE TABLE "Ajusta"(
	"rifSucursal" "domRIF" NOT NULL,
	"codProducto" INT NOT NULL,
	"fechaAjuste" TIMESTAMP NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	"tipoAjuste" VARCHAR(8)
	CHECK("tipoAjuste" IN ('faltante', 'sobrante')),
	PRIMARY KEY("rifSucursal", "codProducto")
);

--@block
CREATE TABLE "DetallesSolicitudes"(
	"nroSolicitud" INT NOT NULL,
	"codServicio" INT NOT NULL,
	"nroActividad" INT NOT NULL,
	"monto" "domMontos" NOT NULL,
	PRIMARY KEY("nroSolicitud", "codServicio", "nroActividad")
);

--@block
CREATE TABLE "DetallesFacturasVentas"(
	"nroFacturaVenta" INT NOT NULL,
	"codProductoVenta" INT NOT NULL,
	"monto" "domMontos" NOT NULL,
	PRIMARY KEY("nroFacturaVenta", "codProductoVenta")
);

--@block
CREATE TABLE "DebeAplicarse"(
	"marca" "domModelos" NOT NULL,
	"modelo" VARCHAR(20) NOT NULL,
	"codProductoServicio" INT NOT NULL,
	"unidadMedida" VARCHAR(12) NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	PRIMARY KEY("marca", "modelo", "codProductoServicio")
);

--@block
ALTER TABLE "Empleados"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"("rifSucursal")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Vehiculos"
ADD FOREIGN KEY("cedCliente")
REFERENCES "Clientes"("cedCliente")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("marca", "modelo")
REFERENCES "Modelos"("marca", "modelo")
ON UPDATE CASCADE ON DELETE RESTRICT;

--@block
ALTER TABLE "Modelos"
ADD FOREIGN KEY("codTipoVehiculo")
REFERENCES "TiposVehiculos"("codTipoVehiculo")
ON UPDATE CASCADE ON DELETE RESTRICT;

--@block
ALTER TABLE "MantenimientosPasados"
ADD FOREIGN KEY("codVehiculo")
REFERENCES "Vehiculos"("codVehiculo")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Admite"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"("rifSucursal")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codTipoVehiculo")
REFERENCES "TiposVehiculos"("codTipoVehiculo")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Asignado"
ADD FOREIGN KEY("cedEmpleado")
REFERENCES "Empleados"("cedEmpleado")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"("codServicio")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Actividades"
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"("codServicio")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Reservaciones"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"("rifSucursal")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("cedCliente")
REFERENCES "Clientes"("cedCliente")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"("codServicio")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("nroSolicitud")
REFERENCES "SolicitudesServicio"("nroSolicitud")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "FacturasClientes"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("cedCliente")
REFERENCES "Clientes"("cedCliente")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "FacturasServicios"
ADD FOREIGN KEY("nroFactura")
REFERENCES "FacturasClientes"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("nroSolicitud")
REFERENCES "SolicitudesServicio"("nroSolicitud")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "FacturasVentas"
ADD FOREIGN KEY("nroFactura")
REFERENCES "FacturasClientes"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Pagos"
ADD FOREIGN KEY("nroFactura")
REFERENCES "FacturasClientes"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codModalidad")
REFERENCES "Modalidades"("codModalidad")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Productos"
ADD FOREIGN KEY("codLinea")
REFERENCES "Lineas"("codLinea")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "ProductosServicios"
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "ProductosVentas"
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "SolicitudesServicio"
ADD FOREIGN KEY("codVehiculo")
REFERENCES "Vehiculos"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "OrdenesServicio"
ADD FOREIGN KEY("nroSolicitud", "codServicio", "nroActividad")
REFERENCES "DetallesSolicitudes"("nroSolicitud", "codServicio", "nroActividad")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "ProductosServicios"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("cedEmpleado")
REFERENCES "Empleados"("cedEmpleado")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "OrdenesCompra"
ADD FOREIGN KEY("rifProveedor")
REFERENCES "Proveedores"("rifProveedor")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"("rifSucursal")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "ListasMantenimientos"
ADD FOREIGN KEY("marca", "modelo")
REFERENCES "Modelos"("marca", "modelo")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Distribuye"
ADD FOREIGN KEY("rifProveedor")
REFERENCES "Proveedores"("rifProveedor")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Pide"
ADD FOREIGN KEY("codOrdCompra")
REFERENCES "OrdenesCompra"("codOrdCompra")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Almacena"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"("rifSucursal")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Ajusta"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"("rifSucursal")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "DetallesSolicitudes"
ADD FOREIGN KEY("nroSolicitud")
REFERENCES "SolicitudesServicio"("nroSolicitud")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio", "nroActividad")
REFERENCES "Actividades"("codServicio", "nroActividad")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "DetallesFacturasVentas"
ADD FOREIGN KEY("nroFacturaVenta")
REFERENCES "FacturasVentas"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProductoVenta")
REFERENCES "ProductosVentas"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "DebeAplicarse"
ADD FOREIGN KEY("marca", "modelo")
REFERENCES "Modelos"("marca", "modelo")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProductoServicio")
REFERENCES "ProductosServicios"("codProducto")
ON UPDATE CASCADE ON DELETE CASCADE;
