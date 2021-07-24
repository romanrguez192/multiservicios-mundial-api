const db = require("../db");
const bcrypt = require("bcrypt");

const login = async (usuario, contrasena) => {
  const query = `
    SELECT "cedEmpleado", e."nombre", "apellido", "telefono", e."direccion", "sueldo", "usuario", "contrasena", "tipoEmpleado", s."rifSucursal", s."nombre" AS "nombreSucursal"
    FROM "Empleados" AS e 
    JOIN "Sucursales" AS s
    ON e."rifSucursal" = s."rifSucursal"
    WHERE "usuario" = $1
  `;

  const { rows } = await db.query(query, [usuario]);

  if (rows.length === 0) {
    return null;
  }

  const match = await bcrypt.compare(contrasena, rows[0].contrasena);

  if (match) {
    delete rows[0].contrasena;
    return rows[0];
  }

  return null;
};

// Buscar todos los Empleados por sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT "cedEmpleado", "nombre", "apellido", "telefono", "direccion", "sueldo", "tipoEmpleado"
    FROM "Empleados"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

// Buscar por cédula
const findById = async (cedula) => {
  const query = `
    SELECT *
    FROM "Empleados" 
    WHERE "cedEmpleado" = $1
  `;

  const params = [cedula];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo empleado
const create = async (empleado) => {
  const hashedPass = await bcrypt.hash(empleado.contrasena, 10);

  const query = `
    INSERT INTO "Empleados"
    ("cedEmpleado", "nombre", "apellido", "telefono", "direccion", "usuario", "contrasena", "sueldo", "tipoEmpleado", "rifSucursal")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, 'personal', $9)
    RETURNING *
  `;

  const params = [
    empleado.cedula,
    empleado.nombre,
    empleado.apellido,
    empleado.telefono,
    empleado.direccion,
    empleado.usuario,
    hashedPass,
    empleado.sueldo,
    empleado.rifSucursal,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un empleado //TODO: Cambiar esto y el Delete
const update = async (cedula, empleado) => {
  const query = `
    UPDATE "Empleados"
    SET "cedula" = $1,
    "rifSucursal" = $2
    WHERE "cedula" = $3
    RETURNING *
  `;

  const params = [empleado.cedula, empleado.rifSucursal, cedula];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un empleado
const deleteEmpleado = async (cedula) => {
  const query = `
    DELETE FROM "Empleados"
    WHERE "cedula" = $1
  `;

  const params = [cedula];

  await db.query(query, params);
};

module.exports = { login, findAll, findById, create, update };
module.exports.delete = deleteEmpleado;
