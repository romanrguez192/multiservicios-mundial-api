const db = require("../db");

// Buscar todos los DebeAplicarse
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "DebeAplicarse"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por marca, modelo y código de producto
const findById = async (marca, modelo, codProductoServicio) => {
  const query = `
    SELECT *
    FROM "DebeAplicarse" 
    WHERE marca = $1
    AND modelo = $2
    AND "codProductoServicio" = $3
  `;

  const params = [marca, modelo, codProductoServicio];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Buscar por marca y modelo 
const findByMarcaModelo = async (marca, modelo) => {
  const query = `
    SELECT *
    FROM "DebeAplicarse" 
    WHERE marca = $1
    AND modelo = $2
  `;

  const params = [marca, modelo];

  const { rows } = await db.query(query, params);
  return rows;
};

// Crear nuevo 
const create = async (debeAplicarse) => {
  const query = `
    INSERT INTO "DebeAplicarse"
    (marca, modelo, "codProductoServicio", "unidadMedida", "cantidad")
    VALUES($1, $2, $3, $4 , $5)
    RETURNING *
  `;

  const params = [
    debeAplicarse.marca,
    debeAplicarse.modelo,
    debeAplicarse.codProductoServicio,
    debeAplicarse.unidadMedida,
    debeAplicarse.cantidad
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar
const update = async (marca, modelo, codProductoServicio, debeAplicarse) => {
  const query = `
    UPDATE "DebeAplicarse"
    SET marca = $1,
    modelo = $2,
    "codProductoServicio" = $3,
    "unidadMedida" = $4,
    cantidad = $5
    WHERE marca = $6
    AND modelo = $7
    AND "codProductoServicio" = $8
    RETURNING *
  `;

  const params = [
    debeAplicarse.marca,
    debeAplicarse.modelo,
    debeAplicarse.codProductoServicio,
    debeAplicarse.unidadMedida,
    debeAplicarse.cantidad,
    marca,
    modelo,
    codProductoServicio
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar 
const deleteDebeAplicarse = async (marca, modelo, codProductoServicio) => {
  const query = `
    DELETE FROM "DebeAplicarse"
    WHERE marca = $1
    AND modelo = $2
    AND "codProductoServicio" = $3
  `;

  const params = [marca, modelo, codProductoServicio];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update, findByMarcaModelo };
module.exports.delete = deleteDebeAplicarse;
