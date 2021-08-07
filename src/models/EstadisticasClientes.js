const db = require("../db");

// Clientes más/menos frecuentes (servicios)
const masMenosFrecuencia = async (rifSucursal) => {
  const query = `
    SELECT c."cedCliente", c."nombre", COUNT(s."nroSolicitud") AS "totalVeces"
    FROM "ClientesSucursales" AS c
    LEFT JOIN "Vehiculos" AS v
    ON c."cedCliente" = v."cedCliente"
    LEFT JOIN "SolicitudesServicio" AS s
    ON s."codVehiculo" = v."codVehiculo"
    AND s."rifSucursal" = c."rifSucursal"
    WHERE c."rifSucursal" = $1
    GROUP BY c."cedCliente", c."nombre"
    ORDER BY "totalVeces" DESC;
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

// Clientes que no usan los servicios tras reservar
const noUsanServicio = async (rifSucursal) => {
  const query = `
    SELECT DISTINCT c."cedCliente", c."nombre", COUNT(*) AS "totalVeces"
    FROM "Clientes" AS c
    JOIN "Reservaciones" AS r
    ON c."cedCliente" = r."cedCliente"
    WHERE r."rifSucursal" = $1
    AND r."status" = 'perdida'
    GROUP BY c."cedCliente", c."nombre"
    ORDER BY "totalVeces" DESC;
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

module.exports = { noUsanServicio, masMenosFrecuencia };
