//Proveedor que suministra más/menos productos
const db = require("../db");

const proveedorProductos = async (rifSucursal) => {
  const query = `
    SELECT prov."rifProveedor", prov."razonSocial", COALESCE(SUM(pide."cantidad"), 0) AS "cantidadTotal"
    FROM "Proveedores" AS prov
    LEFT JOIN "OrdenesCompra" AS oc
    ON prov."rifProveedor" = oc."rifProveedor"
    AND oc."rifSucursal" = $1
    LEFT JOIN "Pide" AS pide
    ON oc."codOrdCompra" = pide."codOrdCompra"
    AND pide."precio" IS NOT NULL
    GROUP BY prov."rifProveedor", prov."razonSocial"
    ORDER BY "cantidadTotal" DESC;
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

module.exports = { proveedorProductos };
