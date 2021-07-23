const db = require("../db");

// Buscar todos los productos
const findAll = async (rifProveedor) => {
  const query = `
    SELECT d."rifProveedor", p."codProducto", p."nombre" 
    FROM "Distribuye" AS d
    JOIN "Productos" AS p
    ON d."codProducto" = p."codProducto"
    WHERE "rifProveedor" = $1
  `;

  const params = [rifProveedor];

  const { rows } = await db.query(query, params);

  return rows;
};

// Agregar un nuevo producto
const create = async (rifProveedor, codProducto) => {
    console.log(rifProveedor, codProducto)
  const query = `
    INSERT INTO "Distribuye"
    ("rifProveedor", "codProducto")
    VALUES($1, $2)
    RETURNING *
  `;

  const params = [rifProveedor, codProducto];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un producto
const deleteProducto = async (rifProveedor, codProducto) => {
  const query = `
    DELETE FROM "Distribuye"
    WHERE "rifProveedor" = $1
    AND "codProducto" = $2
  `;

  const params = [rifProveedor, codProducto];

  await db.query(query, params);
};

module.exports = { findAll, create };
module.exports.delete = deleteProducto;
