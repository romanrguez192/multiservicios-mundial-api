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
SELECT a."codProducto", "nombre", p."descripcion", p."codLinea", l."descripcion" AS "descripcionL", "fabricante", "esEcologico", "precio", "nivelMinimo", "nivelMaximo"
FROM "Accesorios" AS a
JOIN "Productos" AS p
ON a."codProducto" = p."codProducto"
JOIN "Lineas" AS l
ON p."codLinea" = l."codLinea";
