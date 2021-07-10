const db = require("../db");

// Buscar todos los tipos de vehiculos
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "TiposVehiculos"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por código
const findById = async (codTipoVehiculo) => {
  const query = `
    SELECT *
    FROM "TiposVehiculos" 
    WHERE "codTipoVehiculo" = $1
  `;

  const params = [codTipoVehiculo];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo tipo de vehiculo
const create = async (tipoVehiculo) => {
  const query = `
    INSERT INTO "TiposVehiculos"(descripcion)
    VALUES($1)
    RETURNING *
  `;
  
  const params = [tipoVehiculo.descripcion];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un tipo de vehiculo
const update = async (codTipoVehiculo, tipoVehiculo) => {
  const query = `
    UPDATE "TiposVehiculos"
    SET "descripcion" = $1
    WHERE "codTipoVehiculo" = $2
    RETURNING *
  `;

  const params = [tipoVehiculo.descripcion, codTipoVehiculo];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un tipo de vehiculo
const deleteTipoVehiculo = async (codTipoVehiculo) => {
  const query = `
    DELETE FROM "TiposVehiculos"
    WHERE "codTipoVehiculo" = $1
  `;

  const params = [codTipoVehiculo];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteTipoVehiculo;
