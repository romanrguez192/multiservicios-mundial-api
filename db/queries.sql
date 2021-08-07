-- Productos para servicio
CREATE VIEW "VistaProductosServicios" AS
SELECT ps."codProducto", "nombre", p."descripcion", p."codLinea", l."descripcion" AS "descripcionL", "fabricante", "esEcologico", "precio", "nivelMinimo", "nivelMaximo"
FROM "ProductosServicios" AS ps
JOIN "Productos" AS p
ON ps."codProducto" = p."codProducto"
JOIN "Lineas" AS l
ON p."codLinea" = l."codLinea";

-- Productos para venta
CREATE VIEW "VistaProductosVentas" AS
SELECT pv."codProducto", "nombre", p."descripcion", p."codLinea", l."descripcion" AS "descripcionL", "fabricante", "esEcologico", "precio", "nivelMinimo", "nivelMaximo"
FROM "ProductosVentas" AS pv
JOIN "Productos" AS p
ON pv."codProducto" = p."codProducto"
JOIN "Lineas" AS l
ON p."codLinea" = l."codLinea";

-- Servicios ofrecidos por una sucursal
CREATE VIEW "VistaServiciosOfrecidos" AS
SELECT "rifSucursal", a."codServicio", s."nombre" AS "nombreServicio", a."cedEmpleado" AS "cedCoordinador", CONCAT(e."nombre", ' ', e."apellido") AS "nombreCoordinador"
FROM "Asignado" AS a
JOIN "Empleados" AS e
ON a."cedEmpleado" = e."cedEmpleado"
JOIN "Servicios" AS s
ON a."codServicio" = s."codServicio"
WHERE "esCoordinador" = TRUE;

-- Clientes de cada sucursal
CREATE VIEW "ClientesSucursales" AS
SELECT "rifSucursal", c.*
FROM "Clientes" AS c
JOIN "Reservaciones" AS r
ON c."cedCliente" = r."cedCliente"
UNION
SELECT "rifSucursal", c.*
FROM "Clientes" AS c
JOIN "Vehiculos" AS v
ON c."cedCliente" = v."cedCliente"
JOIN "SolicitudesServicio" AS s
ON v."codVehiculo" = s."codVehiculo"
UNION
SELECT "rifSucursal", c.*
FROM "Clientes" AS c
JOIN "FacturasClientes" AS f
ON c."cedCliente" = f."cedCliente";

-- Clientes frecuentes
CREATE VIEW "ClientesFrecuentes" AS
SELECT c."rifSucursal", c."cedCliente", c."nombre", COUNT(*) / 4 AS "promedio",
CASE
	WHEN COUNT(*) / 4 BETWEEN 1 AND 2 THEN 5
	WHEN COUNT(*) / 4 BETWEEN 3 AND 5 THEN 10
	WHEN COUNT(*) / 4 >= 6 THEN 15
END AS "descuento"
FROM "ClientesSucursales" AS c
JOIN "Vehiculos" AS v
ON c."cedCliente" = v."cedCliente"
JOIN "SolicitudesServicio" AS s
ON s."codVehiculo" = v."codVehiculo"
WHERE s."rifSucursal" = c."rifSucursal"
AND NOW() - s."fechaEntrada" < '4 months'
GROUP BY c."rifSucursal", c."cedCliente", c."nombre"
HAVING COUNT(*) / 4 >= 1;

-- QUERIES DE ESTADÍSTICAS

-- Clientes más/menos frecuentes (servicios)
SELECT c."cedCliente", c."nombre", COUNT(s."nroSolicitud") AS "totalVeces"
FROM "ClientesSucursales" AS c
LEFT JOIN "Vehiculos" AS v
ON c."cedCliente" = v."cedCliente"
LEFT JOIN "SolicitudesServicio" AS s
ON s."codVehiculo" = v."codVehiculo"
AND s."rifSucursal" = c."rifSucursal"
WHERE c."rifSucursal" = $1
GROUP BY c."cedCliente", c."nombre"
ORDER BY "totalVeces" DESC;

-- Clientes que no usan los servicios tras reservar
SELECT DISTINCT c."cedCliente", c."nombre", COUNT(*) AS "totalVeces"
FROM "Clientes" AS c
JOIN "Reservaciones" AS r
ON c."cedCliente" = r."cedCliente"
WHERE r."rifSucursal" = $1
AND r."status" = 'perdida'
GROUP BY c."cedCliente", c."nombre"
ORDER BY "totalVeces" DESC;

-- Marcas más atendidas por servicio
SELECT s."codServicio", s."nombre", v."marca", COUNT(DISTINCT ss."nroSolicitud") AS "totalVeces"
FROM "Servicios" AS s
JOIN "DetallesSolicitudes" AS ds
ON s."codServicio" = ds."codServicio"
JOIN "SolicitudesServicio" AS ss
ON ss."nroSolicitud" = ds."nroSolicitud"
JOIN "Vehiculos" AS v
ON ss."codVehiculo" = v."codVehiculo"
WHERE ss."rifSucursal" = $1
GROUP BY s."codServicio", s."nombre", v."marca";

-- Personal que realiza más/menos servicios
SELECT e."cedEmpleado", CONCAT(e."nombre", ' ', e."apellido") AS "nombreEmpleado", COUNT(DISTINCT os."nroSolicitud") AS "totalServicios"
FROM "Empleados" AS e
LEFT JOIN "OrdenesServicio" AS os
ON e."cedEmpleado" = os."cedEmpleado"
WHERE e."rifSucursal" = $1
GROUP BY e."cedEmpleado", e."nombre"
ORDER BY "totalServicios" DESC;

-- Producto con más/menos ventas
SELECT p."codProducto", p."nombre", COUNT(DISTINCT df."nroFacturaVenta") AS "totalVentas"
FROM "VistaProductosVentas" AS p
LEFT JOIN "DetallesFacturasVentas" AS df
ON p."codProducto" = df."codProductoVenta"
LEFT JOIN "FacturasVentas" AS fv
ON df."nroFacturaVenta" = fv."nroFactura"
LEFT JOIN "FacturasClientes" AS fc
ON fv."nroFactura" = fc."nroFactura"
AND fc."rifSucursal" = $1
GROUP BY p."codProducto", p."nombre"
ORDER BY "totalVentas" DESC;

-- Servicios más/menos solicitados
SELECT s."codServicio", s."nombreServicio", COUNT(DISTINCT ds."nroSolicitud") AS "totalVeces"
FROM "VistaServiciosOfrecidos" AS s
LEFT JOIN "DetallesSolicitudes" AS ds
ON s."codServicio" = ds."codServicio"
WHERE s."rifSucursal" = $1
GROUP BY s."codServicio", s."nombreServicio"
ORDER BY "totalVeces" DESC;

-- Proveedor que suministra más/menos productos
SELECT prov."rifProveedor", prov."razonSocial", COALESCE(SUM(pide."cantidad"), 0) AS "cantidadTotal"
FROM "Proveedores" AS prov
LEFT JOIN "OrdenesCompra" AS oc
ON prov."rifProveedor" = oc."rifProveedor"
AND oc."rifSucursal" = $1
LEFT JOIN "Pide" AS pide
ON oc."codOrdCompra" = pide."codOrdCompra"
AND pide."precio" IS NOT NULL
GROUP BY prov."rifProveedor", prov."razonSocial"
ORDER BY "cantidadTotal" DESC;

-- Índices
CREATE UNIQUE INDEX "usuarioIndex"
ON "Empledos"("usuario");

CREATE INDEX "empleadoIndex"
ON "Empledos"("rifSucursal");

CREATE UNIQUE INDEX "placaIndex"
ON "Vehiculos"("placa");

CREATE INDEX "vehiculoIndex"
ON "Vehiculos"("cedCliente");

CREATE INDEX "reservaRifIndex"
ON "Reservaciones"("rifSucursal");

CREATE INDEX "reservaCedIndex"
ON "Reservaciones"("cedCliente");

CREATE INDEX "facturasIndex"
ON "FacturasClientes"("rifSucursal");

CREATE INDEX "solicitudesIndex"
ON "SolicitudesServicio"("rifSucursal");

CREATE UNIQUE INDEX "provIndex"
ON "Proveedores"("razonSocial");

CREATE INDEX "ordCompraIndex"
ON "OrdenesCompra"("rifSucursal");

