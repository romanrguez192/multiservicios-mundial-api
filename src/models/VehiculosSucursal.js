const db = require("../db");

// Buscar todos los tipos de vehiculos que ofrece la sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT a."codTipoVehiculo", tv."nombre", tv."descripcion"
    FROM "Admite" AS a
    JOIN "TiposVehiculos" AS tv
    ON a."codTipoVehiculo" = tv."codTipoVehiculo"
    WHERE a."rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);
  return rows;
};

const create = async (admite) => {
  const query = `
    INSERT INTO "Admite"
    (rifSucursal, codTipoVehiculo)
    VALUES($1, $2)
    RETURNING *
  `;

  const params = [admite.rifSucursal, admite.codTipoVehiculo];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un vehiculo
const deleteVehiculoSucursal = async (rifSucursal, codVehiculo) => {
  const query = `
    DELETE FROM "Admite"
    WHERE "rifSurcursal" = $1
    AND "codVehiculo" = $2
  `;

  const params = [rifSucursal, codVehiculo];

  await db.query(query, params);
};

module.exports = { findAll, create };
module.exports.delete = deleteVehiculoSucursal;
