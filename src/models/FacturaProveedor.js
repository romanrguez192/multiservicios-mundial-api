const db = require("../db");

// Buscar todas las FacturasProveedores
const findAll = async (rif) => {
  const query = `
    SELECT *
    FROM "FacturasProveedores" fp
    JOIN "OrdenesCompra" oc
    ON fp."codOrdCompra" = oc."codOrdCompra"
    WHERE "rifProveedor" = $1
  `;

  const { rows } = await db.query(query, [rif]);

  return rows;
};

// Buscar por código
const findById = async (codFactura) => {
  const query = `
    SELECT *
    FROM "FacturasProveedores" 
    WHERE "codFactura" = $1
  `;

  const params = [codFactura];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nueva Factura
const create = async (rifSucursal, factura) => {
  const query = `
    INSERT INTO "FacturasProveedores"
    ("fechaFacturacion", "fechaPago", "codOrdCompra")
    VALUES($1, $2, $3)
    RETURNING *
  `;
  
  const params = [factura.fechaFacturacion, factura.fechaPago, factura.codOrdCompra];

  const { rows } = await db.query(query, params);

  const query2 = `
    INSERT INTO "Almacena"("rifSucursal", "codProducto", "existenciaTeorica")
    SELECT $1, "codProducto", "cantidad"
    FROM "Pide" p
    WHERE p."codOrdCompra" = $2
    ON CONFLICT("rifSucursal", "codProducto") DO UPDATE SET "existenciaTeorica" = "Almacena"."existenciaTeorica" + EXCLUDED."existenciaTeorica"
  `;
  
  const params2 = [rifSucursal, factura.codOrdCompra];
 
  await db.query(query2, params2);

  return rows[0];
};

// Actualizar una factura
const update = async (nroFactura, factura) => {
  const query = `
    UPDATE "FacturasProveedores"
    SET "fechaPago" = $1
    WHERE "nroFactura" = $2
    RETURNING *
  `;

  const params = [factura.fechaPago, nroFactura];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una factura
const deleteFactura = async (codFactura) => {
  const query = `
    DELETE FROM "FacturasProveedores"
    WHERE "codFactura" = $1
  `;

  const params = [codFactura];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteFactura;
