const db = require("../db");

// Buscar todos los clientes
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Clientes"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por sucursal
const findBySucursal = async (rifSucursal) => {
  const query = `
    SELECT cs.*, EXISTS(
        SELECT *
        FROM "ClientesFrecuentes" AS cf
        WHERE cs."cedCliente" = cf."cedCliente"
        AND cs."rifSucursal" = cf."rifSucursal"
    ) AS "esFrecuente"
    FROM "ClientesSucursales" AS cs
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);
  return rows;
};

// Buscar por cédula
const findById = async (cedCliente) => {
  const query = `
    SELECT *
    FROM "Clientes" 
    WHERE "cedCliente" = $1
  `;

  const params = [cedCliente];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo cliente
const create = async (cliente) => {
  const query = `
    INSERT INTO "Clientes"
    ("cedCliente", "nombre", "email", "tlfPrincipal", "tlfAlternativo")
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const params = [
    cliente.cedCliente,
    cliente.nombre,
    cliente.email,
    cliente.tlfPrincipal,
    cliente.tlfAlternativo,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Actualizar un cliente
const update = async (cedCliente, cliente) => {
  const query = `
    UPDATE "Clientes"
    SET "cedCliente" = $1,
    "nombre" = $2,
    "email" = $3,
    "tlfPrincipal" = $4,
    "tlfAlternativo" = $5
    WHERE "cedCliente" = $6
    RETURNING *
  `;

  const params = [
    cliente.cedCliente,
    cliente.nombre,
    cliente.email,
    cliente.tlfPrincipal,
    cliente.tlfAlternativo,
    cedCliente
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un cliente
const deleteCliente = async (cedCliente) => {
  const query = `
    DELETE FROM "Clientes"
    WHERE "cedCliente" = $1
  `;

  const params = [cedCliente];

  await db.query(query, params);
};

module.exports = { findAll, findBySucursal, findById, create, update };
module.exports.delete = deleteCliente;
