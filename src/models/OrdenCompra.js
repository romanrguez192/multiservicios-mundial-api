const db = require("../db");

// Buscar todas de una sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT
    oc.*,
    TRUE AS "enviada",
    EXISTS ( SELECT * FROM "FacturasProveedores" AS f WHERE f."codOrdCompra" = oc."codOrdCompra" ) AS "recibida"
    FROM
    "OrdenesCompra" AS oc
    WHERE oc."rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

const findProductos = async (codOrdenCompra) => {
  const query = `
    SELECT * 
    FROM "Pide"
    WHERE "codOrdCompra" = $1
  `;

  const params = [codOrdenCompra];

  const { rows } = await db.query(query, params);

  return rows;
};

// Crear nueva orden
const create = async (orden) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const query1 = `
      INSERT INTO "OrdenesCompra"
      ("fecha", "rifProveedor", "rifSucursal")
      VALUES(NOW(), $1, $2)
      RETURNING *
    `;

    const params1 = [orden.rifProveedor, orden.rifSucursal];

    const { rows: rows1 } = await client.query(query1, params1);

    const newOrden = rows1[0];

    const rows2 = await Promise.all(
      orden.pide.map((p) => {
        const query2 = `
          INSERT INTO "Pide"
          ("codOrdCompra", "codProducto", "cantidad")
          VALUES($1, $2, $3)
          RETURNING *
        `;

        const params2 = [newOrden.codOrdCompra, p.codProducto, p.cantidad];

        return client.query(query2, params2);
      })
    );

    const pide = rows2.map((r) => r.rows[0]);

    await client.query("COMMIT TRANSACTION");

    const ordenCompra = [newOrden, pide];

    return ordenCompra;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

// Actualizar una orden
const update = async (codOrdenCompra, orden) => {
  const query = `
    UPDATE "OrdenesCompra"
    SET fecha = $1,
    "rifProveedor" = $2
    WHERE "codOrdCompra" = $3
    RETURNING *
  `;

  const params = [orden.fecha, orden.rifProveedor, codOrdenCompra];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una orden
const deleteOrden = async (codOrden) => {
  const query = `
    DELETE FROM "OrdenesCompra"
    WHERE "codOrdCompra" = $1
  `;

  const params = [codOrden];

  await db.query(query, params);
};

module.exports = { findAll, create, findProductos, update };
module.exports.delete = deleteOrden;
