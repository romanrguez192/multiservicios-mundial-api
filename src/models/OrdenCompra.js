const db = require("../db");

// Buscar todas de una sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT * 
    FROM "OrdenesCompra"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

// Crear nueva orden
const create = async (orden) => {
  const query = `
    INSERT INTO "OrdenesCompra"
    (fecha, rifProveedor, rifSucursal)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  
  const params = [orden.feha, orden.rifProveedor, orden.rifSucursal];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una orden
const deleteOrden= async (codOrden) => {
  const query = `
    DELETE FROM "OrdenesCompra"
    WHERE "codOrdCompra" = $1
  `;

  const params = [codOrden];

  await db.query(query, params);
};

module.exports = { findAll, create};
module.exports.delete = deleteOrden;
