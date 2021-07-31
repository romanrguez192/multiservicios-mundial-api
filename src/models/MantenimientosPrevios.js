const db = require("../db");

// Buscar todas los Mantenimientos Pasados
const findAll = async (codVehiculo) => {
  const query = `
    SELECT * 
    FROM "MantenimientosPasados"
    WHERE "codVehiculo" = $1
  `;

  const params = [codVehiculo];

  const { rows } = await db.query(query, params);

  return rows;
};

// Buscar por codigo de vehiculo y fecha de mantenimiento
const findById = async (codVehiculo, fechaMant) => {
  const query = `
    SELECT *
    FROM "MantenimientosPasados" 
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
    INSERT INTO "MantenimientosPasados"
    ("codVehiculo", "fechaMant", descripcion)
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
    UPDATE "MantenimientosPasados"
    SET "codVehiculo" = $1,
    "fechaMant" = $2,
    descripcion = $3
    WHERE "codVehiculo" = $4
    AND "fechaMant" = $5
    RETURNING *
  `;

  const params = [
    mantenimiento.codVehiculo,
    mantenimiento.fechaMant,
    mantenimiento.descripcion,
    codVehiculo,
    fechaMant,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un mantenimiento
const deleteMantenimiento = async (codVehiculo, fechaMant) => {
  const query = `
    DELETE FROM "MantenimientosPasados"
    WHERE "codVehiculo" = $1
    AND "fechaMant" = $2
  `;

  const params = [codVehiculo, fechaMant];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteMantenimiento;
