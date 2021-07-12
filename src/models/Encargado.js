const db = require("../db");

// Buscar todas los encargados
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Encargados"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por cedula
const findById = async (cedula) => {
  const query = `
    SELECT *
    FROM "Encargados" 
    WHERE "cedula" = $1
  `;

  const params = [cedula];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo encargado
const create = async (encargado) => {
  const query = `
    INSERT INTO "Encargados"
    (cedula)
    VALUES($1)
    RETURNING *
  `;
  
  const params = [encargado.cedula];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un encargado
const update = async (cedula, encargado) => {
  const query = `
    UPDATE "Encargados"
    SET "cedula" = $1
    WHERE "cedula" = $2
    RETURNING *
  `;

  const params = [encargado.cedula, cedula];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un encargado
const deleteEncargado = async (cedula) => {
  const query = `
    DELETE FROM "Encargados"
    WHERE "cedula" = $1
  `;

  const params = [cedula];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteEncargado;
