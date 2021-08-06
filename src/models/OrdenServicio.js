const db = require("../db");


// Buscar todas las ordenes de una solicitud
const findAll = async (nroSolicitud) => {
  const query = `
    SELECT * 
    FROM "OrdenesServicio"
    WHERE "nroSolicitud" = $1
  `;

  const params = [nroSolicitud];

  const { rows } = await db.query(query, params);
  return rows;
}

// Crear orden de servicio
const create = async (orden) => {
    const query = `
      INSERT INTO "OrdenesServicio"
      ("codServicio", "nroActividad", "codProducto", "fecha", "cedEmpleado", "cantidad", "unidadMedida")
      VALUES($1, $2, $3, NOW(), $4, $5, $6)
      RETURNING *
    `;
  
    const params = [
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
      WHERE "nroSolicitud" = $5
      AND "codServicio" = $6
      AND "nroActividad" = $7
      AND "codProducto" = $8
      AND "fecha" = $9
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