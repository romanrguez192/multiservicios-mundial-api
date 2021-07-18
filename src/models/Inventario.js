const db = require("../db");

// Buscar todos los productos
const findById = async (rifSucursal) => {
  const query = `
    SELECT a."codProducto", "nombre", "existenciaTeorica", "cantidadFisica" 
    FROM "Almacena" AS a
    JOIN "Productos" AS p
    ON a."codProducto" = p."codProducto"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

module.exports = { findById };
