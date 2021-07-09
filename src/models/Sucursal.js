const db = require("../db");

const findAll = async () => {
  const query = `
    SELECT s."rifSucursal", s."nombre", s."direccion", s."ciudad", t."cedula", t."nombre", t."apellido"
    FROM "Sucursales" AS s
    LEFT JOIN "Encargados" AS e
    ON s."cedEncargado" = e."cedEncargado"
    LEFT JOIN "Trabajadores" AS t
    ON e."cedEncargado" = t."cedEncargado"
  `;

  const { rows } = await db.query(query);

  return rows;
};

const findById = async (rifSucursal) => {
  const query = `SELECT * FROM "Sucursales" WHERE "rifSucursal" = $1`;
  const params = [rifSucursal];

  const { rows } = await db.query(query, params);
  return rows[0];
};

const create = async (sucursal) => {
  const attributes = `("rifSucursal", "nombre", "direccion", "ciudad", "cedEncargado", "fechaInvFisico")`;
  const query = `INSERT INTO "Sucursales" ${attributes} VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
  const params = [
    sucursal.rifSucursal,
    sucursal.nombre,
    sucursal.direccion,
    sucursal.ciudad,
    sucursal.cedEncargado,
    sucursal.fechaInvFisico,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

const update = async (rifSucursal, sucursal) => {
  const query = `
    UPDATE "Sucursales"
    SET "rifSucursal" = $1,
    SET "nombre" = $2,
    SET "direccion" = $3,
    SET "ciudad" = $4,
    SET "cedEncargado = $5,
    SET "fechaInvFisico = $6
    WHERE "rifSucursal" = $7
  `;

  const params = [
    sucursal.rifSucursal,
    sucursal.nombre,
    sucursal.direccion,
    sucursal.ciudad,
    sucursal.cedEncargado,
    sucursal.fechaInvFisico,
    rifSucursal,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

const deleteSucursal = async (rifSucursal) => {
  const query = `
    DELETE FROM "Sucursales"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteSucursal;