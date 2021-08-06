const db = require("../db");

// Buscar todas las facturas de una sucursal
const findAll = async (rifSucursal) => {
  const query = `
    SELECT * 
    FROM "FacturasClientes"
    WHERE "rifSucursal" = $1
  `;

  const params = [rifSucursal];

  const { rows } = await db.query(query, params);

  return rows;
};

// Buscar por numero de factura
const findById = async (nroFactura) => {
  const query = `
    SELECT *
    FROM "FacturasClientes" 
    WHERE "nroFactura" = $1
  `;

  const params = [nroFactura];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nueva factura
const create = async (factura) => {
  const client = await db.getClient();

  try{
    client.query("BEGIN");

    const query1 = `
      INSERT INTO "FacturasClientes"
      ("fechaFacturacion", "tipoFactura", "rifSucursal", "cedCliente", descuento)
      VALUES(NOW(), 'venta', $1, $2, $3)
      RETURNING *
    `;
    
    const params1 = [
      factura.rifSucursal,
      factura.cedCliente,
      factura.descuento, 
    ];

    const { rows: rows1 } = await client.query(query1, params1);

    const facturaRegistrada = rows1[0];

    const query2 = `
      INSERT INTO "FacturasVentas"
      ("nroFactura", "nroPago")
      VALUES($1, 1)
      RETURNING *
    `;

    const params2 = [facturaRegistrada.nroFactura];

    const { rows: rows2 } = await client.query(query2, params2);
    const facturaVenta = rows2[0];

    const query3 = `
      INSERT INTO "Pagos"
      ("nroFactura", "nroPago", monto, "fechaPago", moneda, "nroTarjeta", banco, "codModalidad")
      VALUES($1, 1, $2, NOW(), $3, $4, $5, $6)
      RETURNING *
    `;

    const params3 = [
      facturaRegistrada.nroFactura,
      factura.monto,
      factura.moneda,
      factura.nroTarjera,
      factura.banco,
      factura.codModalidad
    ];

    const { rows: rows3 } = await client.query(query3, params3);
    const pago = rows3[0];

    const promises = [];
    promises.push(
      Promise.all(
        factura.lista.map(p => {
          const query = `
            INSERT INTO "DetallesFacturasVentas"
            ("nroFacturaVenta", "codProductoVenta", monto)
            VALUES($1, $2, $3)
            RETURNING *
          `;
          const params = [
            facturaRegistrada.nroFactura,
            p.codProducto,
            p.precio * p.cantidad
          ];
          return client.query(query, params);
        })
      )
    );

    await Promise.all(promises);
    await client.query("COMMIT TRANSACTION");

    return [facturaRegistrada, pago];
  }catch(err){
    await client.query("ROLLBACK");
    throw err;
  }finally{
    client.release();
  }
};

// Actualizar una factura
const update = async (nroFactura, factura) => {
  const query = `
    UPDATE "Facturas"
    SET "fechaFacturacion" = $1,
    "montoTotal" = $2,
    "tipoFactura" = $3,
    "rifSucursal" = $4
    WHERE "nroFactura" = $5
    RETURNING *
  `;

  const params = [
    factura.fechaFacturacion,
    factura.montoTotal,
    factura.tipoFactura, 
    factura.rifSucursal,
    nroFactura
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar una factura
const deleteFactura = async (nroFactura) => {
  const query = `
    DELETE FROM "Facturas"
    WHERE "nroFactura" = $1
  `;

  const params = [nroFactura];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteFactura;
