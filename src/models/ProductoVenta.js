const db = require("../db");

// Buscar todos los Productos
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "VistaProductosVentas"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar todos los Productos sucursal
const findAllSucursal = async (rifSucursal) => {
  const query = `
    SELECT * 
    FROM "VistaProductosVentas"
    WHERE "codProducto" IN (
      SELECT "codProducto"
      FROM "Almacena"
      WHERE "rifSucursal" = $1
      AND "existenciaTeorica" > 0
    )
  `;

  const { rows } = await db.query(query, [rifSucursal]);

  return rows;
};

// Buscar por codigo
const findById = async (codProducto) => {
  const query = `
    SELECT *
    FROM "VistaProductosVentas" 
    WHERE "codProducto" = $1
  `;

  const params = [codProducto];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo Producto
const create = async (producto) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const query1 = `
      INSERT INTO "Productos"
      ("nombre", "descripcion", "codLinea", "fabricante", "esEcologico", "precio", "nivelMinimo", "nivelMaximo", "tipoProducto")
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, 'venta')
      RETURNING *
    `;

    const params1 = [
      producto.nombre,
      producto.descripcion,
      producto.codLinea,
      producto.fabricante,
      producto.esEcologico,
      producto.precio,
      producto.nivelMinimo,
      producto.nivelMaximo,
    ];

    const { rows: rows1 } = await client.query(query1, params1);

    const query2 = `
      INSERT INTO "ProductosVentas"
      ("codProducto")
      VALUES($1)
      RETURNING *
    `;

    const params2 = [rows1[0].codProducto];

    const { rows: rows2 } = await client.query(query2, params2);

    await client.query("COMMIT TRANSACTION");

    const newProducto = { ...rows1[0], ...rows2[0] };

    return newProducto;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
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
    WHERE "codProducto" = $9
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
    codProducto,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un producto
const deleteProducto = async (codProducto) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const query1 = `
      DELETE FROM "Productos"
      WHERE "codProducto" = $1
    `;

    const params = [codProducto];

    await client.query(query1, params);

    const query2 = `
      DELETE FROM "ProductosVentas"
      WHERE "codProducto" = $1
    `;

    await client.query(query2, params);

    await client.query("COMMIT TRANSACTION");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

module.exports = { findAll, findAllSucursal, findById, create, update };
module.exports.delete = deleteProducto;
