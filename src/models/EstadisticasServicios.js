// Servicios más/menos solicitados
const db = require("../db");

const serviciosSolicitados = async (rifSucursal) => {
  const query = `
    SELECT s."codServicio", s."nombreServicio", COUNT(DISTINCT ds."nroSolicitud") AS "totalVeces"
    FROM "VistaServiciosOfrecidos" AS s
    LEFT JOIN "DetallesSolicitudes" AS ds
    ON s."codServicio" = ds."codServicio"
    WHERE s."rifSucursal" = $1
    GROUP BY s."codServicio", s."nombreServicio";
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

module.exports = { serviciosSolicitados };
