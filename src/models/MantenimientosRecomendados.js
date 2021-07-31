const db = require("../db");

// Buscar todos los Mantenimientos Recomendados por marca y modelo
const fixTiempoUso = (rows) => {
  rows.forEach((r) => {
    if (r.tiempoUso) {
      const y = r.tiempoUso.years;
      const m = r.tiempoUso.months;
      if(m){
        r.tiempoUso = m + " months"
      }else{
        y > 1
          ? (r.tiempoUso = y + " years")
          : (r.tiempoUso = y + " year")
      }
    }
  });
  
};

const findAll = async (marca, modelo) => {
  const query = `
    SELECT * 
    FROM "ListasMantenimientos"
    WHERE marca = $1
    AND modelo = $2
  `;

  const params = [marca, modelo];

  const { rows } = await db.query(query, params);

  fixTiempoUso(rows);
  console.log(rows)
  return rows;
};

// Buscar por codigo y fecha de mantenimiento
const findById = async (mantenimiento) => {
  const query = `
    SELECT *
    FROM "ListasMantenimientos" 
    WHERE "marca" = $1
    AND "modelo" = $2
    AND "tiempoUso" = $3
    AND kilometraje = $4
    AND mantenimiento = $5
  `;

  const params = [
    mantenimiento.marca,
    mantenimiento.modelo,
    mantenimiento.tiempoUso,
    mantenimiento.kilometraje,
    mantenimiento.mantenimiento,
  ];

  const { rows } = await db.query(query, params);

  fixTiempoUso(rows);

  return rows[0];
};

// Crear nuevo mantenimiento
const create = async (mantenimiento) => {
  const query = `
    INSERT INTO "ListasMantenimientos"
    ("marca", "modelo", "tiempoUso", kilometraje, mantenimiento)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const params = [
    mantenimiento.marca,
    mantenimiento.modelo,
    mantenimiento.tiempoUso,
    mantenimiento.kilometraje,
    mantenimiento.mantenimiento,
  ];

  const { rows } = await db.query(query, params);

  fixTiempoUso(rows);

  return rows[0];
};

// Actualizar un mantenimiento
const update = async (oldMantenimiento, newMantenimiento) => {
  const query = `
    UPDATE "ListasMantenimientos"
    SET marca = $1,
    modelo = $2,
    "tiempoUso" = $3,
    kilometraje = $4,
    mantenimiento = $5
    WHERE "marca" = $6
    AND "modelo" = $7
    AND "tiempoUso" = $8
    AND kilometraje = $9
    AND mantenimiento = $10
    RETURNING *
  `;

  const params = [
    newMantenimiento.marca,
    newMantenimiento.modelo,
    newMantenimiento.tiempoUso,
    newMantenimiento.kilometraje,
    newMantenimiento.mantenimiento,
    oldMantenimiento.marca,
    oldMantenimiento.modelo,
    oldMantenimiento.tiempoUso,
    oldMantenimiento.kilometraje,
    oldMantenimiento.mantenimiento,
  ];

  const { rows } = await db.query(query, params);

  fixTiempoUso(rows);

  return rows[0];
};

// Eliminar un mantenimiento
const deleteMantenimiento = async (mantenimiento) => {
  const query = `
    DELETE FROM "ListasMantenimientos"
    WHERE "marca" = $1
    AND "modelo" = $2
    AND "tiempoUso" = $3
    AND kilometraje = $4
    AND mantenimiento = $5
  `;

  const params = [
    mantenimiento.marca,
    mantenimiento.modelo,
    mantenimiento.tiempoUso,
    mantenimiento.kilometraje,
    mantenimiento.mantenimiento,
  ];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteMantenimiento;
