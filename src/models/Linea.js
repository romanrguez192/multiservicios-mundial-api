const db = require("../db");

// Buscar todas las Lineas
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Lineas"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por código
const findById = async (codLinea) => {
  const query = `
    SELECT *
    FROM "Lineas" 
    WHERE "codLinea" = $1
  `;

  const params = [codLinea];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nueva Linea
const create = async (linea) => {
  const query = `
    INSERT INTO "Lineas"
    (descripcion)
    VALUES($1)
    RETURNING *
  `;
  
  const params = [linea.descripcion];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar una linea
const update = async (codLinea, linea) => {
  const query = `
    UPDATE "Lineas"
    SET "descripcion" = $1
    WHERE "codLinea" = $2
    RETURNING *
  `;

  const params = [linea.descripcion, codLinea];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una linea
const deleteLinea = async (codLinea) => {
  const query = `
    DELETE FROM "Lineas"
    WHERE "codLinea" = $1
  `;

  const params = [codLinea];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteLinea;
