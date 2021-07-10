--@block
CREATE DOMAIN "domDirecciones" AS VARCHAR(150);
CREATE DOMAIN "domTelefonos" AS VARCHAR(18);
CREATE DOMAIN "domRIF" AS VARCHAR(12);
CREATE DOMAIN "domCedulas" AS INT;
CREATE DOMAIN "domMontos" AS DECIMAL(14, 2) CHECK(VALUE > 0);
CREATE DOMAIN "domModelos" AS VARCHAR(20);
CREATE DOMAIN "domPorcentajes" AS DECIMAL(5, 2) CHECK(VALUE >= 0 AND VALUE <= 100);
CREATE DOMAIN "domCantidades" AS INT CHECK(VALUE > 0);

--@block
CREATE TABLE "Trabajadores"(
	"cedula" "domCedulas" NOT NULL,
	"nombre" VARCHAR(30) NOT NULL,
	"apellido" VARCHAR(30) NOT NULL,
	"telefono" "domTelefonos",
	"direccion" "domDirecciones" NOT NULL,
	"sueldo" "domMontos" NOT NULL,
	"usuario" VARCHAR(35) UNIQUE NOT NULL,
	"contrasena" VARCHAR(50) NOT NULL,
	"tipoTrabajador" VARCHAR(9) NOT NULL
	CHECK("tipoTrabajador" IN ('dueño', 'empleado', 'encargado')),
	PRIMARY KEY("cedula")
);

--@block
CREATE TABLE "Encargados"(
	"cedula" "domCedulas" NOT NULL,
	PRIMARY KEY("cedula")
);

--@block
CREATE TABLE "Empleados"(
	"cedula" "domCedulas" NOT NULL,
	"rifSucursal" "domRIF" NOT NULL,
	PRIMARY KEY("cedula")
);

--@block LISTO
CREATE TABLE "Sucursales"(
	"rifSucursal" "domRIF" NOT NULL,
	"nombre" VARCHAR(40) NOT NULL,
	"direccion" "domDirecciones" NOT NULL,
	"ciudad" VARCHAR(20) NOT NULL,
	"cedEncargado" "domCedulas" NOT NULL,
	"fechaInvFisico" DATE,
	PRIMARY KEY("rifSucursal")
);


--@block LISTO
CREATE TABLE "Vehiculos"(
	"codVehiculo" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"placa" VARCHAR(10) UNIQUE NOT NULL,
	"fechaAdquisicion" DATE NOT NULL,
	"fechaRegistro" TIMESTAMP NOT NULL,
	"cedCliente" "domCedulas" NOT NULL,
	"marca" "domModelos" NOT NULL,
	"modelo" "domModelos" NOT NULL,
	"cedMecanico" "domCedulas",
	PRIMARY KEY("codVehiculo")
);

--@block LISTO
CREATE TABLE "TiposVehiculos"(
	"codTipoVehiculo" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"descripcion" VARCHAR(100) NOT NULL,
	PRIMARY KEY("codTipoVehiculo")
);

--@block LISTO
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
	"descripcion" VARCHAR(50) NOT NULL,
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
CREATE TABLE "Mecanicos"(
	"cedMecanico" "domCedulas" NOT NULL,
	"nombre" VARCHAR(60) NOT NULL,
	"telefono" "domTelefonos" NOT NULL,
	PRIMARY KEY("cedMecanico")
);

--@block
CREATE TABLE "Mantenimientos"(
	"codVehiculo" INT NOT NULL,
	"fechaMant" DATE NOT NULL,
	"descripcion" VARCHAR(100) NOT NULL,
	PRIMARY KEY("codVehiculo", "fechaMant")
);

--@block
CREATE TABLE "Admite"(
	"rifSucursal" "domRIF" NOT NULL,
	"codTipoVehiculo" INT NOT NULL,
	PRIMARY KEY("rifSucursal", "codTipoVehiculo")
);

--@block
CREATE TABLE "Servicios"(
	"codServicio" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"nombre" VARCHAR(30) NOT NULL,
	"descripcion" VARCHAR(100) NOT NULL,
	"requiereReserva" BOOL NOT NULL,
	"minTiempoReserva" INTERVAL,
	"porcentajeAbono" "domPorcentajes"
	CHECK("porcentajeAbono" >= 20 AND "porcentajeAbono" <= 50),
	PRIMARY KEY("codServicio")
);

--@block
CREATE TABLE "Ofrece"(
	"rifSucursal" "domRIF" NOT NULL,
	"codServicio" INT NOT NULL,
	PRIMARY KEY("rifSucursal", "codServicio")
);

--@block
CREATE TABLE "Asignado"(
	"cedEmpleado" "domCedulas" NOT NULL,
	"codServicio" INT NOT NULL,
	PRIMARY KEY("cedEmpleado", "codServicio")
);

--@block
CREATE TABLE "Coordina"(
	"cedEmpleado" "domCedulas" NOT NULL,
	"codServicio" INT NOT NULL,
	PRIMARY KEY("cedEmpleado", "codServicio")
);

--@block
CREATE TABLE "Actividades"(
	"codServicio" INT NOT NULL,
	"nroActividad" INT NOT NULL,
	"precio" "domMontos" NOT NULL,
	"descripcion" VARCHAR(100) NOT NULL,
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
	PRIMARY KEY("nroReserva")
);

--@block
CREATE TABLE "Facturas"(
	"nroFactura" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"fechaFacturacion" TIMESTAMP NOT NULL,
	"montoTotal" "domMontos" NOT NULL,
	"tipoFactura" VARCHAR(12) NOT NULL
	CHECK("tipoFactura" IN ('cliente', 'proveedor')),
	"rifSucursal" "domRIF" NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasServicios"(
	"nroFactura" INT NOT NULL,
	"nroSolicitud" INT NOT NULL,
	PRIMARY KEY("nroFactura");
);

--@block
CREATE TABLE "FacturasClientes"(
	"nroFactura" INT NOT NULL,
	"descuento" "domPorcentajes"
	CHECK("descuento" >= 5 AND "descuento" <= 15),
	"tipoCompra" VARCHAR(13) NOT NULL
	CHECK("tipoCompra" IN ('accesorio', 'servicio')),
	"cedCliente" "domCedulas" NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasAccesorios"(
	"nroFactura" INT NOT NULL,
	"nroPago" INT NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasProveedores"(
	"nroFactura" INT NOT NULL,
	"fechaPago" TIMESTAMP NOT NULL,
	"rifProveedor" "domRIF" NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "Pagos"(
	"nroPago" INT GENERATED ALWAYS AS IDENTITY NOT NULL,
	"monto" "domMontos" NOT NULL,
	"fechaPago" TIMESTAMP NOT NULL,
	"modalidad" VARCHAR(13) NOT NULL
	CHECK("modalidad" IN ('efectivo', 'tarjeta', 'transferencia')),
	"tipoPago" VARCHAR(10) NOT NULL
	CHECK("tipoPago" IN ('reserva', 'servicio', 'accesorio')),
	"nroReserva" INT,
	"nroFacturaServ" INT,
	"moneda" VARCHAR(7) NOT NULL
	CHECK("moneda" IN ('bolívar', 'divisa')),
	"tipoTarjeta" VARCHAR (7)
	CHECK("tipoTarjeta" IN ('débito', 'crédito')),
	"nroTarjeta" INT,
	PRIMARY KEY("nroPago")
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
	"nivelMinimo" INT CHECK("nivelMinimo" >= 0),
	"nivelMaximo" INT CHECK("nivelMaximo" > "nivelMinimo"),
	"tipoProducto" VARCHAR(9)
	CHECK("tipoProducto" IN ('accesorio', 'servicio')),
	PRIMARY KEY("codProducto")
);

--@block
CREATE TABLE "ProductosServicios"(
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
CREATE TABLE "Accesorios"(
	"codProducto" INT NOT NULL,
	PRIMARY KEY("codProducto")
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
	"status" VARCHAR(10) CHECK('status' IN ('en proceso', 'terminada')),
	CONSTRAINT entradaSalida CHECK("fechaEntrada" < "fechaSalidaEstimada"),
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
	PRIMARY KEY("nroSolicitud", "codServicio", "numActividad")
);

--@block
CREATE TABLE "DetallesFacturasProv"(
	"nroFacturaProv" INT NOT NULL,
	"codProducto" INT NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	"precio" "domMontos" NOT NULL,
	PRIMARY KEY("nroFacturaProv", "codProducto")
);

--@block
CREATE TABLE "DetallesFacturasAcces"(
	"nroFacturaAcces" INT NOT NULL,
	"codAccesorio" INT NOT NULL,
	"monto" "domMontos" NOT NULL,
	PRIMARY KEY("nroFacturaServ", "codAccesorio")
);

--@block
CREATE TABLE "DebeAplicarse"(
	"marca" "domModelos" NOT NULL,
	"modelo" VARCHAR(20) NOT NULL,
	"codProducto" INT NOT NULL,
	"unidadMedida" VARCHAR(12) NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	PRIMARY KEY("marca", "modelo", "codProducto")
);

--@block
ALTER TABLE "Encargados"
ADD FOREIGN KEY("cedula")
REFERENCES "Trabajadores"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Empleados"
ADD FOREIGN KEY("cedula")
REFERENCES "Trabajadores"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Sucursales"
ADD FOREIGN KEY("cedEncargado")
REFERENCES "Encargados"
ON UPDATE CASCADE ON DELETE RESTRICT;

--@block
ALTER TABLE "Vehiculos"
ADD FOREIGN KEY("cedCliente")
REFERENCES "Clientes"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("marca", "modelo")
REFERENCES "Modelos"("marca", "modelo")
ON UPDATE CASCADE ON DELETE RESTRICT,
ADD FOREIGN KEY("cedMecanico")
REFERENCES "Mecanicos"
ON UPDATE CASCADE ON DELETE SET NULL;

--@block
ALTER TABLE "Modelos"
ADD FOREIGN KEY("codTipoVehiculo")
REFERENCES "TiposVehiculos"
ON UPDATE CASCADE ON DELETE RESTRICT;

--@block
ALTER TABLE "Mantenimientos"
ADD FOREIGN KEY("codVehiculo")
REFERENCES "Encargados"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Admite"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codTipoVehiculo")
REFERENCES "TiposVehiculos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Ofrece"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Asignado"
ADD FOREIGN KEY("cedEmpleado")
REFERENCES "Empleados"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Coordina"
ADD FOREIGN KEY("cedEmpleado")
REFERENCES "Empleados"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Actividades"
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Reservaciones"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("cedCliente")
REFERENCES "Clientes"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio")
REFERENCES "Servicios"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Facturas"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "FacturasClientes"
ADD FOREIGN KEY("nroFactura")
REFERENCES "Facturas"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("cedCliente")
REFERENCES "Clientes"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "FacturasServicios"
ADD FOREIGN KEY("nroFactura")
REFERENCES "FacturasClientes"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("nroSolicitud")
REFERENCES "SolicitudesServicio"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "FacturasAccesorios"
ADD FOREIGN KEY("nroFactura")
REFERENCES "FacturasClientes"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("nroPago")
REFERENCES "Pagos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "FacturasProveedores"
ADD FOREIGN KEY("nroFactura")
REFERENCES "Facturas"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("rifProveedor")
REFERENCES "Proveedores"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Pagos"
ADD FOREIGN KEY("nroReserva")
REFERENCES "Reservaciones"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("nroFacturaServ")
REFERENCES "FacturasServicios"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Productos"
ADD FOREIGN KEY("codLinea")
REFERENCES "Lineas"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "ProductosServicios"
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Accesorios"
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
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
REFERENCES "ProductosServicios"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("cedEmpleado")
REFERENCES "Empleados"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "OrdenesCompra"
ADD FOREIGN KEY("rifProveedor")
REFERENCES "Proveedores"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "ListasMantenimientos"
ADD FOREIGN KEY("marca", "modelo")
REFERENCES "Modelos"("marca", "modelo")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Distribuye"
ADD FOREIGN KEY("rifProveedor")
REFERENCES "Proveedores"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Pide"
ADD FOREIGN KEY("codOrdCompra")
REFERENCES "OrdenesCompra"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Almacena"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Ajusta"
ADD FOREIGN KEY("rifSucursal")
REFERENCES "Sucursales"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "DetallesSolicitudes"
ADD FOREIGN KEY("nroSolicitud")
REFERENCES "SolicitudesServicio"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codServicio", "nroActividad")
REFERENCES "Actividades"("codServicio", "nroActividad")
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "DetallesFacturasProv"
ADD FOREIGN KEY("nroFacturaProv")
REFERENCES "FacturasProveedores"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "DetallesFacturasAcces"
ADD FOREIGN KEY("nroFacturaAcces")
REFERENCES "FacturasAccesorios"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codAccesorio")
REFERENCES "Accesorios"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "DebeAplicarse"
ADD FOREIGN KEY("marca", "modelo")
REFERENCES "Modelos"("marca", "modelo")
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "ProductosServicios"
ON UPDATE CASCADE ON DELETE CASCADE;
