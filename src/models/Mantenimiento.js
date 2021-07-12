const db = require("../db");

// Buscar todos los Mantenimientos
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Mantenimientos"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por codigo y fecha de mantenimiento
const findById = async (codVehiculo, fechaMant) => {
  const query = `
    SELECT *
    FROM "Mantenimientos" 
    WHERE "codVehiculo" = $1
    AND "fechaMant" = $2
  `;

  const params = [codVehiculo, fechaMant];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo mantenimiento
const create = async (mantenimiento) => {
  const query = `
    INSERT INTO "Mantenimientos"
    ("codVehiculo", "fechaMant", "descripcion")
    VALUES($1, $2, $3)
    RETURNING *
  `;

  const params = [
    mantenimiento.codVehiculo,
    mantenimiento.fechaMant,
    mantenimiento.descripcion,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un mantenimiento
const update = async (codVehiculo, fechaMant, mantenimiento) => {
  const query = `
    UPDATE "Mantenimientos"
    SET "codVehiculo" = $1,
    SET "fechaMant" = $2,
    SET "descripcion" = $3
    WHERE "codVehiculo" = $4
    AND "fechaMant" = $5
    RETURNING *
  `;

  const params = [
    mantenimiento.codVehiculo,
    mantenimiento.fechaMant,
    mantenimiento.descripcion,
    codVehiculo,
    fechaMant
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un mantenimiento
const deleteMantenimiento = async (codVehiculo, fechaMant) => {
  const query = `
    DELETE FROM "Mantenimientos"
    WHERE "codVehiculo" = $1
    AND "fechaMant" = $2
  `;

  const params = [codVehiculo, fechaMant];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteMantenimiento;
