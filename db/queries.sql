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

// TODO: OJO si creo una vista para las SS quizás se simplifique
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
