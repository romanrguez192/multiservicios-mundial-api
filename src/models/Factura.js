const db = require("../db");

// Buscar todas las facturas
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Facturas"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por numero de factura
const findById = async (nroFactura) => {
  const query = `
    SELECT *
    FROM "Facturas" 
    WHERE "nroFactura" = $1
  `;

  const params = [nroFactura];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nueva factura
const create = async (factura) => {
  const query = `
    INSERT INTO "Facturas"
    ("fechaFacturacion", "montoTotal", "tipoFactura", "rifSucursal")
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
  
  const params = [
    factura.fechaFacturacion,
    factura.montoTotal,
    factura.tipoFactura, 
    factura.rifSucursal
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar una factura
const update = async (nroFactura, factura) => {
  const query = `
    UPDATE "Facturas"
    SET "fechaFacturacion" = $1,
    "montoTotal" = $2,
    "tipoFactura" = $3,
    "rifSucursal" = $4
    WHERE "nroFactura" = $5
    RETURNING *
  `;

  const params = [
    factura.fechaFacturacion,
    factura.montoTotal,
    factura.tipoFactura, 
    factura.rifSucursal,
    nroFactura
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una factura
const deleteFactura = async (nroFactura) => {
  const query = `
    DELETE FROM "Facturas"
    WHERE "nroFactura" = $1
  `;

  const params = [nroFactura];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteFactura;
