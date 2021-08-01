CREATE VIEW "VistaSucursales" AS
SELECT s."rifSucursal", s."nombre", s."direccion", s."ciudad", t."cedula" AS "cedulaE", t."nombre" AS "nombreE", t."apellido" AS "apellidoE"
FROM "Sucursales" AS s
LEFT JOIN "Encargados" AS e
ON s."cedEncargado" = e."cedEncargado"
LEFT JOIN "Trabajadores" AS t
ON e."cedEncargado" = t."cedEncargado";

CREATE VIEW "VistaEmpleados" AS
SELECT "Empleados"."cedula", "nombre", "apellido", "rifSucursal", "telefono", "direccion", "sueldo", "usuario", "tipoTrabajador"
FROM "Empleados"
JOIN "Trabajadores"
ON "Empleados"."cedula" = "Trabajadores"."cedula";

CREATE VIEW "VistaEncargados" AS
SELECT "Encargados"."cedula", "nombre", "apellido", "fechaInicio", "telefono", "direccion", "sueldo", "usuario", "tipoTrabajador"
FROM "Encargados"
JOIN "Trabajadores"
ON "Encargados"."cedula" = "Trabajadores"."cedula";

CREATE VIEW "VistaProductosServicios" AS
SELECT ps."codProducto", "nombre", p."descripcion", p."codLinea", l."descripcion" AS "descripcionL", "fabricante", "esEcologico", "precio", "nivelMinimo", "nivelMaximo"
FROM "ProductosServicios" AS ps
JOIN "Productos" AS p
ON ps."codProducto" = p."codProducto"
JOIN "Lineas" AS l
ON p."codLinea" = l."codLinea";

CREATE VIEW "VistaProductosVentas" AS
SELECT pv."codProducto", "nombre", p."descripcion", p."codLinea", l."descripcion" AS "descripcionL", "fabricante", "esEcologico", "precio", "nivelMinimo", "nivelMaximo"
FROM "ProductosVentas" AS pv
JOIN "Productos" AS p
ON pv."codProducto" = p."codProducto"
JOIN "Lineas" AS l
ON p."codLinea" = l."codLinea";

CREATE VIEW "VistaServiciosOfrecidos" AS
SELECT "rifSucursal", a."codServicio", s."nombre" AS "nombreServicio", a."cedEmpleado" AS "cedCoordinador", CONCAT(e."nombre", ' ', e."apellido") AS "nombreCoordinador"
FROM "Asignado" AS a
JOIN "Empleados" AS e
ON a."cedEmpleado" = e."cedEmpleado"
JOIN "Servicios" AS s
ON a."codServicio" = s."codServicio"
WHERE "esCoordinador" = TRUE;

CREATE VIEW "ClientesSucursales" AS
SELECT DISTINCT c."cedCliente", c."nombre", c."email", c."tlfPrincipal", c."tlfAlternativo"
FROM "Clientes" AS c, "Reservaciones" AS r, "SolicitudesServicio" AS s, "Facturas" as f
WHERE c."cedCliente" = r."cedCliente"
OR c."cedCliente" = s."cedCliente"
OR c."cedCliente" = f."cedCliente";

-- TODO: OJO si creo una vista para las SS quizás se simplifique
CREATE VIEW "ClientesSucursales" AS
SELECT "rifSucursal", c."cedCliente", "nombre", "email", "tlfPrincipal", "tlfAlternativo"
FROM "Clientes" AS c
JOIN "Reservaciones" AS r
ON c."cedCliente" = r."cedCliente"
UNION
SELECT "rifSucursal", c."cedCliente", "nombre", "email", "tlfPrincipal", "tlfAlternativo"
FROM "Clientes" AS c
JOIN "Vehiculos" AS v
ON c."cedCliente" = v."cedCliente"
JOIN "SolicitudesServicio" AS s
ON v."codVehiculo" = s."codVehiculo"
UNION
SELECT "rifSucursal", c."cedCliente", "nombre", "email", "tlfPrincipal", "tlfAlternativo"
FROM "Clientes" AS c
JOIN "FacturasClientes" AS f
ON c."cedCliente" = f."cedCliente";

-- QUERIES DE ESTADÍSTICAS

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

-- Clientes que no usan los servicios tras reservar
SELECT DISTINCT c."cedCliente", c."nombre", COUNT(*) AS "totalVeces"
FROM "Clientes" AS c
JOIN "Reservaciones" AS r
ON c."cedCliente" = r."cedCliente"
WHERE r."rifSucursal" = $1
AND r."status" = 'perdida'
GROUP BY c."cedCliente", c."nombre";

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

-- Personal que realiza más servicios por mes
-- TODO: El mes
SELECT e."cedEmpleado", CONCAT(e."nombre", ' ', e."apellido") AS "nombreEmpleado", COUNT(DISTINCT os."nroSolicitud") AS "totalServicios"
FROM "Empleados" AS e
JOIN "OrdenesServicio" AS os
ON e."cedEmpleado" = os."cedEmpleado"
WHERE e."rifSucursal" = '799072750'
GROUP BY e."cedEmpleado", e."nombre";