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
f
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
    SET "descripcion" = $2,
    SET "codLinea" = $3,
    SET "fabricante" = $4,
    SET "esEcologico" = $5,
    SET "precio" = $6,
    SET "nivelMinimo" = $7,
    SET "nivelMaximo" = $8,
    SET "tipoProducto" = $9
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
