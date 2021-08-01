const db = require("../db");

// Buscar todas las sucursales
const findAll = async () => {
  const query = `
    SELECT s."rifSucursal", s."nombre", s."direccion", s."ciudad", e."nombre" || ' ' || e."apellido" AS "nombreEncargado", e."cedEmpleado" AS "cedEncargado", s."fechaInicioEncargado"
    FROM "Sucursales" AS s
    LEFT JOIN "Empleados" AS e
    ON s."rifSucursal" = e."rifSucursal" AND e."tipoEmpleado" = 'encargado'
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar una
const findById = async (rifSucursal) => {
  const query = `
    SELECT * 
    FROM "Sucursales" 
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);
  return rows[0];
};

//Crear una sucursal
const create = async (sucursal) => {
  const query = `
    INSERT INTO "Sucursales"
    ("rifSucursal", "nombre", "direccion", "ciudad", "fechaInvFisico", "fechaInicioEncargado")
    VALUES($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;

  const params = [
    sucursal.rifSucursal,
    sucursal.nombre,
    sucursal.direccion,
    sucursal.ciudad,
    sucursal.fechaInvFisico,
    sucursal.fechaInicioEncargado,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

//Actualizar una sucursal
const update = async (rifSucursal, sucursal) => {
  const query = `
    UPDATE "Sucursales"
    SET "rifSucursal" = $1,
    "nombre" = $2,
    "direccion" = $3,
    "ciudad" = $4,
    "fechaInvFisico" = $5,
    "fechaInicioEncargado" = $6
    WHERE "rifSucursal" = $7
    RETURNING *
  `;

  const params = [
    sucursal.rifSucursal,
    sucursal.nombre,
    sucursal.direccion,
    sucursal.ciudad,
    sucursal.fechaInvFisico,
    sucursal.fechaInicioEncargado,
    rifSucursal,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una sucursal
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
