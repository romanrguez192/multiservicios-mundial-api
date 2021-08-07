const db = require("../db");

// Buscar por rif de sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT *, "fechaSalidaReal" IS NOT NULL AS "finalizada"
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
    SELECT ss.*, ss."fechaSalidaReal" IS NOT NULL AS "finalizada", v."placa" AS "placa", v."marca", v."modelo", c."cedCliente", c."nombre" AS "nombreCliente"
    FROM "SolicitudesServicio" AS ss
    JOIN "Vehiculos" AS v
    ON ss."codVehiculo" = v."codVehiculo"
    JOIN "Clientes" AS c
    ON v."cedCliente" = c."cedCliente"
    WHERE "nroSolicitud" = $1
  `;

  const params = [nroSolicitud];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Obtener sus servicios
const findServicios = async (nroSolicitud) => {
  const query = `
    SELECT *
    FROM "Servicios"
    WHERE "codServicio" IN (
        SELECT "codServicio"
        FROM "DetallesSolicitudes"
        WHERE "nroSolicitud" = $1)
  `;

  const params = [nroSolicitud];

  const { rows } = await db.query(query, params);
  return rows;
};

// Obtener sus detalles
const findDetalles = async (nroSolicitud, codServicio) => {
  const query = `
    SELECT ds.*, a."descripcion",
    EXISTS(SELECT *
        FROM "OrdenesServicio" AS os
        WHERE os."nroSolicitud" = ds."nroSolicitud"
        AND os."codServicio" = ds."codServicio"
        AND os."nroActividad" = ds."nroActividad"
        ) AS "ejecutada"
    FROM "DetallesSolicitudes" AS ds
    JOIN "Actividades" AS a
    ON ds."codServicio" = a."codServicio"
    AND ds."nroActividad" = a."nroActividad"
    WHERE ds."nroSolicitud" = $1
    AND ds."codServicio" = $2
  `;

  const params = [nroSolicitud, codServicio];

  const { rows } = await db.query(query, params);
  return rows;
};

// Crear nueva
const create = async (solicitud) => {
  const client = await db.getClient();

  try {
    client.query("BEGIN");

    if (solicitud.nombreAutorizado === "") {
      solicitud.nombreAutorizado = null;
    }

    if (solicitud.tlfAutorizado === "") {
      solicitud.tlfAutorizado = null;
    }

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
              SET "nroSolicitud" = $1,
              "status" = 'atendida'
              WHERE "nroReserva" = $2
            `;

            const params2 = [fichaRegistro.nroSolicitud, r.nroReserva];

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
            ("nroSolicitud", "codServicio", "nroActividad", "monto")
            SELECT $1, "codServicio", "nroActividad", "precio"
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

module.exports = {
  findAll,
  findServicios,
  findDetalles,
  findById,
  create,
  update,
};
module.exports.delete = deleteSolicitudServicio;
