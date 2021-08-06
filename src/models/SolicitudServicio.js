const db = require("../db");

// Buscar por rif de sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT *
    FROM "SolicitudesServicio" 
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);
  return rows;
};

// Buscar por número
const findById = async (nroSolicitud) => {
  const query = `
    SELECT *
    FROM "SolicitudesServicio" 
    WHERE "nroSolicitud" = $1
  `;

  const params = [nroSolicitud];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nueva
const create = async (solicitud) => {
  const client = await db.getClient();

  try {
    client.query("BEGIN");

    const query1 = `
      INSERT INTO "SolicitudesServicio"
      ("fechaEntrada", "fechaSalidaEstimada", "codVehiculo", "rifSucursal", "nombreAutorizado", "tlfAutorizado")
      VALUES (NOW(), $1, $2, $3, $4, $5)
      RETURNING *
    `;

    const params1 = [
      solicitud.fechaSalidaEstimada,
      solicitud.codVehiculo,
      solicitud.rifSucursal,
      solicitud.nombreAutorizado,
      solicitud.tlfAutorizado,
    ];

    const { rows: rows1 } = await client.query(query1, params1);

    const fichaRegistro = rows1[0];

    const promises = [];

    if (solicitud.reservas) {
      promises.push(
        Promise.all(
          solicitud.reservas.map((r) => {
            const query2 = `
              UPDATE "Reservaciones"
              SET "status" = 'atendida'
              WHERE "nroReserva" = $1
           `;

            const params2 = [r.nroReserva];

            return client.query(query2, params2);
          })
        )
      );
    }

    const servicios = [];

    if (solicitud.reservas) {
      servicios.push(...solicitud.reservas.map((r) => r.codServicio));
    }

    if (solicitud.servicios) {
      servicios.push(...solicitud.servicios.map((s) => s.codServicio));
    }

    promises.push(
      Promise.all(
        servicios.map((s) => {
          const query3 = `
            INSERT INTO "DetallesSolicitudes"
            ("nroSolicitud", "codServicio", "nroActividad", monto)
            SELECT $1, $2, "nroActividad", "precio"
            FROM "Actividades"
            WHERE "codServicio" = $2;
          `;

          const params3 = [fichaRegistro.nroSolicitud, s];

          return client.query(query3, params3);
        })
      )
    );

    await Promise.all(promises);
    await client.query("COMMIT TRANSACTION");

    return fichaRegistro;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Actualizar
const update = async (nroSolicitud, solicitud) => {
  const query = `
    UPDATE "SolicitudesServicio"
    SET "fechaEntrada" = $1,
    "fechaSalidaEstimada" = $2,
    "fechaSalidaReal" = $3,
    "codVehiculo" = $4,
    autorizado = $5
    WHERE "nroSolicitud" = $6
    RETURNING *
  `;

  const params = [
    solicitud.fechaEntrada,
    solicitud.fechaSalidaEstimada,
    solicitud.fechaSalidaReal,
    solicitud.codVehiculo,
    solicitud.autorizado,
    nroSolicitud,
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar
const deleteSolicitudServicio = async (nroSolicitud) => {
  const query = `
    DELETE FROM "SolicitudesServicio"
    WHERE "nroSolicitud" = $1
  `;

  const params = [nroSolicitud];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteSolicitudServicio;
