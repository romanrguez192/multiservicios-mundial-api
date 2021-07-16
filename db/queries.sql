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
