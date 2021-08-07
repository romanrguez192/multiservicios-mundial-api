const db = require("../db");

// Clientes más/menos frecuentes (servicios)
// TODO: Queda pendiente
const masMenosFrecuencia = async (rifSucursal) => {
  const query = `
    SELECT c."cedCliente", c."nombre", COUNT(*) AS "totalVeces"
    FROM "ClientesSucursales" AS c
    JOIN "Vehiculos" AS v
    ON c."cedCliente" = v."cedCliente"
    JOIN "SolicitudesServicio" AS s
    ON s."codVehiculo" = v."codVehiculo"
    WHERE s."rifSucursal" = c."rifSucursal"
    AND NOW() - s."fechaEntrada" < '4 months'
    GROUP BY c."rifSucursal", c."cedCliente", c."nombre"
  `;

  const params = [rifSucursal];
  console.log(params);
  console.log(query);
  const { rows } = await db.query(query, params);

  return rows;
}

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
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;  
}

module.exports = { noUsanServicio, masMenosFrecuencia };