const db = require("../db");

// Buscar todos los modelos
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Modelos"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por marca y modelo
const findById = async (marca, modelo) => {
  const query = `
    SELECT *
    FROM "Modelos" 
    WHERE "marca" = $1
    AND "modelo" = $2
  `;

  const params = [marca, modelo];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo modelo
const create = async (modelo) => {
  const query = `
    INSERT INTO "Modelos"
    ("marca", "modelo", "descripcion", "peso", "octanaje", "numPuestos", "tipoAceiteMotor", "tipoAceiteCaja", "tipoRefrigerante", "codTipoVehiculo")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  const params = [
    modelo.marca,
    modelo.modelo,
    modelo.descripcion,
    modelo.peso,
    modelo.octanaje,
    modelo.numPuestos,
    modelo.tipoAceiteMotor,
    modelo.tipoAceiteCaja,
    modelo.tipoRefrigerante,
    modelo.codTipoVehiculo,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un modelo
const update = async (marca, nombreModelo, modelo) => {
  const query = `
    UPDATE "Modelos"
    SET "marca" = $1,
    "modelo" = $2,
    "descripcion" = $3,
    "peso" = $4,
    "octanaje" = $5,
    "numPuestos" = $6,
    "tipoAceiteMotor" = $7,
    "tipoAceiteCaja" = $8,
    "tipoRefrigerante" = $9,
    "codTipoVehiculo" = $10
    WHERE "marca" = $11
    AND "modelo" = $12
    RETURNING *
  `;

  const params = [
    modelo.marca,
    modelo.modelo,
    modelo.descripcion,
    modelo.peso,
    modelo.octanaje,
    modelo.numPuestos,
    modelo.tipoAceiteMotor,
    modelo.tipoAceiteCaja,
    modelo.tipoRefrigerante,
    modelo.codTipoVehiculo,
    marca,
    nombreModelo
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un modelo
const deleteModelo = async (marca, modelo) => {
  const query = `
    DELETE FROM "Modelos"
    WHERE "marca" = $1
    AND "modelo" = $2
  `;

  const params = [marca, modelo];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteModelo;
