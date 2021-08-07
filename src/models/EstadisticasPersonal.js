//Estadisticas del personal que realiza mas/menos servicios al mes
const db = require("../db");

const personalServicios = async (rifSucursal) => {
  const query = `
    SELECT e."cedEmpleado", CONCAT(e."nombre", ' ', e."apellido") AS "nombreEmpleado", COUNT(DISTINCT os."nroSolicitud") AS "totalServicios"
    FROM "Empleados" AS e
    LEFT JOIN "OrdenesServicio" AS os
    ON e."cedEmpleado" = os."cedEmpleado"
    WHERE e."rifSucursal" = $1
    GROUP BY e."cedEmpleado", e."nombre"
    ORDER BY "totalServicios" DESC;
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

module.exports = { personalServicios };
