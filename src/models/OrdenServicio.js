const db = require("../db");

// Buscar todas las ordenes de una solicitud, servicio, actividad
const findAll = async (nroSolicitud, codServicio, nroActividad) => {
  const query = `
    SELECT os.*, p."nombre", e."nombre"
    FROM "OrdenesServicio" AS os
    JOIN "Productos" AS p
    ON os."codProducto" = p."codProducto"
    JOIN "Empleados" AS e
    ON e."cedEmpleado" = os."cedEmpleado"
    WHERE os."nroSolicitud" = $1
    AND os."codServicio" = $2
    AND os."nroActividad" = $3
  `;

  const params = [nroSolicitud, codServicio, nroActividad];

  const { rows } = await db.query(query, params);
  return rows;
}

// Crear orden de servicio
const create = async (orden) => {
    const query = `
      INSERT INTO "OrdenesServicio"
      ("nroSolicitud", "codServicio", "nroActividad", "codProducto", "fecha", "cedEmpleado", "cantidad", "unidadMedida")
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
  
    const params = [
      orden.nroSolicitud,
      orden.codServicio,
      orden.nroActividad,
      orden.codProducto,
      orden.fecha,
      orden.cedEmpleado,
      orden.cantidad,
      orden.unidadMedida,
    ];
  
    const { rows } = await db.query(query, params);
  
    return rows[0];
  };
  
  // Actualizar orden de servicio
  const update = async (nroSolicitud, codServicio, nroActividad, codProducto, fecha, orden) => {
    const query = `
      UPDATE "OrdenesServicio"
      SET "codServicio" = $1,
      "nroActividad" = $2,
      "codProducto" = $3,
      "nroSolicitud" = $4,
      "fecha" = $5,
      "cedEmpleado" = $6,
      "cantidad" = $7,
      "unidadMedida" = $8
      WHERE "nroSolicitud" = $9
      AND "codServicio" = $10
      AND "nroActividad" = $11
      AND "codProducto" = $12
      AND "fecha" = $13
      RETURNING *
    `;
  
    const params = [
      orden.codServicio,
      orden.nroActividad,
      orden.codProducto,
      orden.nroSolicitud,
      orden.fecha,
      orden.cedEmpleado,
      orden.cantidad,
      orden.unidadMedida,
      nroSolicitud,
      codServicio,
      nroActividad,
      codProducto,
      fecha,
    ];
  
    const { rows } = await db.query(query, params);
  
    return rows[0];
  };
  
  // Eliminar un detalle de solicitud
  const deleteOrdenServicio = async (nroSolicitud, codServicio, nroActividad, codProducto, fecha) => {
    const query = `
      DELETE FROM "OrdenesServicio"
      WHERE "nroSolicitud" = $1
      AND "codServicio" = $2
      AND "nroActividad" = $3
      AND "codProducto" = $4
      AND "fecha" = $5
    `;
  
    const params = [
      nroSolicitud,
      codServicio,
      nroActividad,
      codProducto,
      fecha
    ];
  
    await db.query(query, params);
  };
  
  module.exports = { findAll, create, update };
  module.exports.delete = deleteOrdenServicio;