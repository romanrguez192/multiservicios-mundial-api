const db = require("../db");

// Buscar todos los Mecanicos
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Mecanicos"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por cédula
const findById = async (cedMecanico) => {
  const query = `
    SELECT *
    FROM "Mecanicos" 
    WHERE "cedMecanico" = $1
  `;

  const params = [cedMecanico];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo mecanico
const create = async (mecanico) => {
  const query = `
    INSERT INTO "Mecanicos"
    ("cedMecanico", "nombre", "telefono")
    VALUES($1, $2, $3)
    RETURNING *
  `;

  const params = [
    mecanico.cedMecanico,
    mecanico.nombre,
    mecanico.telefono,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un mecanico
const update = async (cedMecanico, mecanico) => {
  const query = `
    UPDATE "Mecanicos"
    SET "cedMecanico" = $1,
    SET "nombre" = $2,
    SET "telefono" = $3
    WHERE "cedMecanico" = $4
    RETURNING *
  `;

  const params = [
    mecanico.cedMecanico,
    mecanico.nombre,
    mecanico.telefono,
    cedMecanico
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un mecanico
const deleteMecanico = async (cedMecanico) => {
  const query = `
    DELETE FROM "Mecanicos"
    WHERE "cedMecanico" = $1
  `;

  const params = [cedMecanico];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteMecanico;
