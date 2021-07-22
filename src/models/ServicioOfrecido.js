const db = require("../db");

// Buscar todas las servicios de una sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT * 
    FROM "VistaServiciosOfrecidos"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

// Agregar un nuevo servicio a una sucursal
const create = async (servicioOfrecido) => {
  const query = `
    INSERT INTO "Asignado"
    ("codServicio", "cedEmpleado", "esCoordinador")
    VALUES($1, $2, TRUE)
    RETURNING "codServicio", "cedEmpleado" AS "cedCoordinador"
  `;

  const params = [servicioOfrecido.codServicio, servicioOfrecido.cedEmpleado];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// TODO: PENDIENTE EL UPDATE

// Eliminar un servicio ofrecido
const deleteServicioOfrecido = async (codServicio, cedEmpleado) => {
  const query = `
    DELETE FROM "Asignado"
    WHERE "codServicio" = $1 
    AND "cedEmpleado" = $2
  `;

  const params = [codServicio, cedEmpleado];

  await db.query(query, params);
};

module.exports = { findAll, create };
module.exports.delete = deleteServicioOfrecido;
