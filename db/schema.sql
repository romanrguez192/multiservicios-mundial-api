--@block
CREATE DOMAIN "domDirecciones" AS VARCHAR(150);
CREATE DOMAIN "domTelefonos" AS VARCHAR(18);
CREATE DOMAIN "domRIF" AS VARCHAR(12);
CREATE DOMAIN "domCodigos" AS VARCHAR(16);
CREATE DOMAIN "domCedulas" AS VARCHAR(13);
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

--@block
CREATE TABLE "Sucursales"(
	"rifSucursal" "domRIF" NOT NULL,
	"nombre" VARCHAR(40) NOT NULL,
	"direccion" "domDirecciones" NOT NULL,
	"ciudad" VARCHAR(20) NOT NULL,
	"cedEncargado" domCedulas NOT NULL,
	"fechaInvFisico" DATE,
	PRIMARY KEY("rifSucursal")
);


--@block
CREATE TABLE "Vehiculos"(
	"codVehiculo" "domCodigos" NOT NULL,
	"placa" VARCHAR(10) UNIQUE NOT NULL,
	"fechaAdiquisicion" DATE NOT NULL,
	"fechaRegistro" DATETIME NOT NULL,
	"cedCliente" "domCedulas" NOT NULL,
	"marca" "domModelos" NOT NULL,
	"modelo" "domModelos" NOT NULL,
	"cedMecanico" "domCedulas",
	PRIMARY KEY("codVehiculo")
);

--@block
CREATE TABLE "TiposVehiculos"(
	"codTipoVehiculo" "domCodigos" NOT NULL,
	"descripcion" VARCHAR(100) NOT NULL,
	PRIMARY KEY("codTipoVehiculo")
);

--@block
CREATE TABLE "Clientes"(
	"cedCliente" "domCedulas" NOT NULL,
	"nombre" VARCHAR(60) NOT NULL,
	"email" VARCHAR(40) UNIQUE NOT NULL,
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
	"codTipoVehiculo" "domCodigos" NOT NULL,
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
	"codVehiculo" "domCodigos" NOT NULL,
	"fechaMant" DATE NOT NULL,
	"descripcion" VARCHAR(100) NOT NULL,
	PRIMARY KEY("codVehiculo", "fechaMant")
);

--@block
CREATE TABLE "Telefonos"(
	"cedCliente" "domCedulas" NOT NULL,
	"nroTelefono" "domTelefonos" NOT NULL,
	PRIMARY KEY("cedCliente", "nroTelefono")
);

--@block
CREATE TABLE "Admite"(
	"rifSucursal" "domRIF" NOT NULL,
	"codTipoVehiculo" "domCodigos" NOT NULL,
	PRIMARY KEY("rifSucursal", "codTipoVehiculo")
);

--@block
CREATE TABLE "Servicios"(
	"codServicio" "domCodigos" NOT NULL,
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
	"codServicio" "domCodigos" NOT NULL,
	PRIMARY KEY("rifSucursal", "codServicio")
);

--@block
CREATE TABLE "Asignado"(
	"cedEmpleado" "domCedulas" NOT NULL,
	"codServicio" "domCodigos" NOT NULL,
	PRIMARY KEY("cedEmpleado", "codServicio")
);

--@block
CREATE TABLE "Coordina"(
	"cedEmpleado" "domCedulas" NOT NULL,
	"codServicio" "domCodigos" NOT NULL,
	PRIMARY KEY("cedEmpleado", "codServicio")
);

--@block
CREATE TABLE "Actividades"(
	"codServicio" "domCodigos" NOT NULL,
	"nroActividad" INT NOT NULL,
	"precio" "domMontos" NOT NULL,
	"descripcion" VARCHAR(100) NOT NULL,
	"capacidad" "domCantidades" NOT NULL,
	PRIMARY KEY("codServicio", "nroActividad")
);

--@block
CREATE TABLE "Reservaciones"(
	"nroReserva" "domCodigos" NOT NULL,
	"fechaReserva" DATETIME NOT NULL,
	"codServicio" "domCodigos" NOT NULL,
	"fechaActividad" DATETIME NOT NULL,
	"montoAbonado" "domMontos" NOT NULL,
	"rifSucursal" "domRIF" NOT NULL,
	"cedCliente" "domCedulas" NOT NULL,
	PRIMARY KEY("nroReserva")
);

--@block
CREATE TABLE "Facturas"(
	"nroFactura" "domCodigos" NOT NULL,
	"fechaFacturacion" DATETIME NOT NULL,
	"montoTotal" "domMontos" NOT NULL,
	"tipoFactura" VARCHAR(12) NOT NULL
	CHECK("tipoFactura" IN ('cliente', 'proveedor')),
	"rifSucursal" "domRIF" NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasServicios"(
	"nroFactura" "domCodigos" NOT NULL,
	"nroSolicitud" "domCodigos" NOT NULL,
	PRIMARY KEY("nroFactura");
);

--@block
CREATE TABLE "FacturasClientes"(
	"nroFactura" "domCodigos" NOT NULL,
	"descuento" "domPorcentajes"
	CHECK("descuento" >= 5 AND "descuento" <= 15),
	"tipoCompra" VARCHAR(13) NOT NULL
	CHECK("tipoCompra" IN ('accesorio', 'servicio')),
	"cedCliente" "domCedulas" NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasAccesorios"(
	"nroFactura" "domCodigos" NOT NULL,
	"nroPago" "domCodigos" NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "FacturasProveedores"(
	"nroFactura" "domCodigos" NOT NULL,
	"fechaPago" DATETIME NOT NULL,
	"rifProveedor" "domRIF" NOT NULL,
	PRIMARY KEY("nroFactura")
);

--@block
CREATE TABLE "Pagos"(
	"nroPago" "domCodigos" NOT NULL,
	"monto" "domMontos" NOT NULL,
	"fechaPago" DATETIME NOT NULL,
	"modalidad" VARCHAR(13) NOT NULL
	CHECK("modalidad" IN ('efectivo', 'tarjeta', 'transferencia')),
	"tipoPago" VARCHAR(10) NOT NULL
	CHECK("tipoPago" IN ('reserva', 'servicio', 'accesorio')),
	"nroReserva" "domCodigos",
	"nroFacturaServ" "domCodigos",
	"moneda" VARCHAR(7) NOT NULL
	CHECK("moneda" IN ('bolívar', 'divisa')),
	"tipoTarjeta" VARCHAR (7)
	CHECK("tipoTarjeta" IN ('débito', 'crédito')),
	"nroTarjeta" INT,
	PRIMARY KEY("nroPago")
);

--@block
CREATE TABLE "Productos"(
	"codProducto" "domCodigos" NOT NULL,
	"nombre" VARCHAR(30) NOT NULL,
	"descripcion" VARCHAR(80) NOT NULL,
	"codLinea" "domCodigos" NOT NULL,
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
	"codProducto" "domCodigos" NOT NULL,
	PRIMARY KEY("codProducto")
);

--@block
CREATE TABLE "Lineas"(
	"codLinea" "domCodigos" NOT NULL,
	"descripcion" VARCHAR(80) NOT NULL,
	PRIMARY KEY("codLinea")
);

--@block
CREATE TABLE "Accesorios"(
	"codProducto" "domCodigos" NOT NULL,
	PRIMARY KEY("codProducto")
);

--@block
CREATE TABLE "SolicitudesServicio"(
	"nroSolicitud" "domCodigos" NOT NULL,
	"fechaEntrada" DATETIME NOT NULL,
	"fechaSalidaEstimada" DATETIME NOT NULL,
	"fechaSalidaReal" DATETIME,
	"codVehiculo" "domCodigos" NOT NULL,
	"rifSucursal" "domRIF" NOT NULL,
	"autorizado" VARCHAR(60),
	"status" VARCHAR(10) CHECK("status" IN ("en proceso", "terminada")),
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
	"nroSolicitud" "domCodigos" NOT NULL,
	"codServicio" "domCodigos" NOT NULL,
	"nroActividad" INT NOT NULL,
	"codProducto" "domCodigos" NOT NULL,
	"fecha" DATETIME NOT NULL,
	"cedEmpleado" "domCedulas" NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	"unidadMedida" VARCHAR(12) NOT NULL,
	PRIMARY KEY("nroSolicitud", "codServicio", "nroActividad", "codProducto", "fecha")
);

--@block
CREATE TABLE "OrdenesCompra"(
	"codOrdCompra" "domCodigos" NOT NULL,
	"fecha" DATETIME NOT NULL,
	"rifProveedor" "domCodigos" NOT NULL,
	"rifSucursal" "domCodigos" NOT NULL,
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
	"codProducto" "domCodigos" NOT NULL,
	PRIMARY KEY("rifProveedor", "codProducto")
);

--@block
CREATE TABLE "Pide"(
	"codOrdCompra" "domCodigos" NOT NULL,
	"codProducto" "domCodigos" NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	PRIMARY KEY("codOrdCompra", "codProducto")
);

--@block
CREATE TABLE "Almacena"(
	"rifSucursal" "domRIF" NOT NULL,
	"codProducto" "domCodigos" NOT NULL,
	"existenciaTeorica" INT CHECK("existenciaTeorica" >= 0),
	"cantidadFisica" INT CHECK("cantidadFisica" >= 0),
	PRIMARY KEY("rifSucursal", "codProducto")
);

--@block
CREATE TABLE "Ajusta"(
	"rifSucursal" "domRIF" NOT NULL,
	"codProducto" "domCodigos" NOT NULL,
	"fechaAjuste" DATETIME NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	"tipoAjuste" VARCHAR(8)
	CHECK("tipoAjuste" IN ('faltante', 'sobrante')),
	PRIMARY KEY("rifSucursal", "codProducto")
);

--@block
CREATE TABLE "DetallesSolicitudes"(
	"nroSolicitud" "domCodigos" NOT NULL,
	"codServicio" "domCodigos" NOT NULL,
	"numActividad" INT NOT NULL,
	"monto" "domMontos" NOT NULL,
	PRIMARY KEY("nroSolicitud", "codServicio", "numActividad")
);

--@block
CREATE TABLE "Lista"(
	"nroFacturaProv" "domCodigos" NOT NULL,
	"codProducto" "domCodigos" NOT NULL,
	"cantidad" "domCantidades" NOT NULL,
	"precio" "domMontos" NOT NULL,
	PRIMARY KEY("nroFacturaProv", "codProducto")
);

--@block
CREATE TABLE "Muestra"(
	"nroFacturaAcces" "domCodigos" NOT NULL,
	"codAccesorio" "domCodigos" NOT NULL,
	"monto" "domMontos" NOT NULL,
	PRIMARY KEY("nroFacturaServ", "codAccesorio")
);

--@block
CREATE TABLE "DebeAplicarse"(
	"marca" "domModelos" NOT NULL,
	"modelo" VARCHAR(20) NOT NULL,
	"codProducto" "domCodigos" NOT NULL,
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
ON UPDATE CASCADE ON DELETE SET NULL,
ADD FOREIGN KEY("cedEncargado")
REFERENCES "Encargados"
ON UPDATE CASCADE ON DELETE RESTRICT;

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
ALTER TABLE "Telefonos"
ADD FOREIGN KEY("cedCliente")
REFERENCES "Clientes"
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
ALTER TABLE "Lista"
ADD FOREIGN KEY("nroFacturaProv")
REFERENCES "FacturasProveedores"
ON UPDATE CASCADE ON DELETE CASCADE,
ADD FOREIGN KEY("codProducto")
REFERENCES "Productos"
ON UPDATE CASCADE ON DELETE CASCADE;

--@block
ALTER TABLE "Muestra"
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
