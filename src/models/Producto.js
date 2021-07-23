const db = require("../db");

// Buscar todos los Productos
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Productos"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por codigo
const findById = async (codProducto) => {
  const query = `
    SELECT *
    FROM "Productos" 
    WHERE "codProducto" = $1
  `;

  const params = [codProducto];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo Producto
const create = async (producto) => {
  const query = `
    INSERT INTO "Productos"
    ("nombre", "descripcion", "codLinea", "fabricante", "esEcologico", "precio", "nivelMinimo", "nivelMaximo", "tipoProducto")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const params = [
    producto.nombre,
    producto.descripcion,
    producto.codLinea, 
    producto.fabricante,
    producto.esEcologico,
    producto.precio,
    producto.nivelMinimo,
    producto.nivelMaximo,
    producto.tipoProducto
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un producto
const update = async (codProducto, producto) => {
  const query = `
    UPDATE "Productos"
    SET "nombre" = $1,
    "descripcion" = $2,
    "codLinea" = $3,
    "fabricante" = $4,
    "esEcologico" = $5,
    "precio" = $6,
    "nivelMinimo" = $7,
    "nivelMaximo" = $8,
    "tipoProducto" = $9
    WHERE "codProducto" = $10
    RETURNING *
  `;

  const params = [
    producto.nombre,
    producto.descripcion,
    producto.codLinea, 
    producto.fabricante,
    producto.esEcologico,
    producto.precio,
    producto.nivelMinimo,
    producto.nivelMaximo,
    producto.tipoProducto,
    codProducto
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un producto
const deleteProducto = async (codProducto) => {
  const query = `
    DELETE FROM "Productos"
    WHERE "codProducto" = $1
  `;

  const params = [codProducto];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteProducto;
