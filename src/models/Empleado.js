const db = require("../db");

// Buscar todos los Empleados
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Empleados"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por cédula
const findById = async (cedula) => {
  const query = `
    SELECT *
    FROM "Empleados" 
    WHERE "cedula" = $1
  `;

  const params = [cedula];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo empleado
const create = async (empleado) => {
  const query = `
    INSERT INTO "Empleados"
    ("cedula", "rifSucursal")
    VALUES($1, $2)
    RETURNING *
  `;

  const params = [
    empleado.cedula,
    empleado.rifSucursal,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un empleado
const update = async (cedula, empleado) => {
  const query = `
    UPDATE "Empleados"
    SET "cedula" = $1,
    "rifSucursal" = $2
    WHERE "cedula" = $3
    RETURNING *
  `;

  const params = [
    empleado.cedula,
    empleado.rifSucursal,
    cedula
  ];

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

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteEmpleado;
