const db = require("../db");

// Buscar todas las servicios asignados a un empleado
const findAll = async (cedEmpleado) => {
  const query = `
    SELECT * 
    FROM "Asignado"
    WHERE "cedEmpleado" = $1
  `;

  const params = [cedEmpleado];

  const { rows } = await db.query(query, params);

  return rows;
};

// Agregar un nuevo servicio a un empleado
const create = async (cedEmpleado, codServicio,) => {
  const query = `
    INSERT INTO "Asignado"
    ("cedEmpleado", "codServicio", "esCoordinador")
    VALUES($1, $2, FALSE)
    RETURNING *
  `;

  const params = [cedEmpleado, codServicio];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un servicio asignado
const deleteServicioAsignado = async (cedEmpleado, codServicio) => {
  const query = `
    DELETE FROM "Asignado"
    WHERE "cedEmpleado" = $1 
    AND "codServicio" = $2
  `;

  const params = [cedEmpleado, codServicio];

  await db.query(query, params);
};

module.exports = { findAll, create };
module.exports.delete = deleteServicioAsignado;
