//Estadisticas de las marcas mas atendidas por servicio
const db = require("../db");

const marcasMasAtendidas = async (rifSucursal) => {
    const query = `
    SELECT s."codServicio", s."nombre", v."marca", COUNT(DISTINCT ss."nroSolicitud") AS "totalVeces"
    FROM "Servicios" AS s
    JOIN "DetallesSolicitudes" AS ds
    ON s."codServicio" = ds."codServicio"
    JOIN "SolicitudesServicio" AS ss
    ON ss."nroSolicitud" = ds."nroSolicitud"
    JOIN "Vehiculos" AS v
    ON ss."codVehiculo" = v."codVehiculo"
    WHERE ss."rifSucursal" = $1
    GROUP BY s."codServicio", s."nombre", v."marca";
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

module.exports = { marcasMasAtendidas };