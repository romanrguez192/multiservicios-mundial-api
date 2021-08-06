//Producto con más/menos ventas
const db = require("../db");

const productosVendidos = async (rifSucursal) => {
  const query = `
    SELECT p."codProducto", p."nombre", COUNT(DISTINCT df."nroFacturaVenta") AS "totalVentas"
    FROM "VistaProductosVentas" AS p
    LEFT JOIN "DetallesFacturasVentas" AS df
    ON p."codProducto" = df."codProductoVenta"
    LEFT JOIN "FacturasVentas" AS fv
    ON df."nroFacturaVenta" = fv."nroFactura"
    LEFT JOIN "FacturasClientes" AS fc
    ON fv."nroFactura" = fc."nroFactura"
    AND fc."rifSucursal" = $1
    GROUP BY p."codProducto", p."nombre";
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

module.exports = { productosVendidos };
