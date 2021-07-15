const db = require("../db");

// Buscar todos los Proveedores
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Proveedores"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por rif
const findById = async (rifProveedor) => {
  const query = `
    SELECT *
    FROM "Proveedores" 
    WHERE "rifProveedor" = $1
  `;

  const params = [rifProveedor];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo proveedor
const create = async (proveedor) => {
  const query = `
    INSERT INTO "Proveedores"
    ("rifProveedor", "razonSocial", "direccion", "personaContacto", "telefonoCelular", "telefonoLocal")
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const params = [
    proveedor.rifProveedor,
    proveedor.razonSocial,
    proveedor.direccion, 
    proveedor.personaContacto,
    proveedor.telefonoCelular,
    proveedor.telefonoLocal
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un proveedor
const update = async (rifProveedor, proveedor) => {
  const query = `
    UPDATE "Proveedores"
    SET "rifProveedor" = $1,
    "razonSocial" = $2,
    "direccion" = $3,
    "personaContacto" = $4,
    "telefonoCelular" = $5,
    "telefonoLocal" = $6
    WHERE "rifProveedor" = $7
    RETURNING *
  `;

  const params = [
    proveedor.rifProveedor,
    proveedor.razonSocial,
    proveedor.direccion, 
    proveedor.personaContacto,
    proveedor.telefonoCelular,
    proveedor.telefonoLocal,
    rifProveedor
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un proveedor
const deleteProveedor = async (rifProveedor) => {
  const query = `
    DELETE FROM "Proveedores"
    WHERE "rifProveedor" = $1
  `;

  const params = [rifProveedor];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteProveedor;
