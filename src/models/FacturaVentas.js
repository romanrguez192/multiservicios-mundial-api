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

// Buscar productos por numero de factura
const findById = async (nroFactura) => {
  const client = await db.getClient();
  try{
    client.query("BEGIN");

    const query = `
      SELECT *
      FROM "DetallesFacturasVentas" 
      WHERE "nroFacturaVenta" = $1
    `;

    const params = [nroFactura];

    const { rows: facturas } = await client.query(query, params);

    const promises = [];

    promises.push(
      Promise.all(
        facturas.map(f => {
          const query1 = `
            SELECT * 
            FROM "Productos"
            WHERE "codProducto" = $1
          `;

          const params1 = [f.codProductoVenta];

          return client.query(query1, params1);
        })
      )
    );

    const productos = await Promise.all(promises);

    const lista = [];
    productos[0].map(p => {    
      p.rows.map(row => {
        const data = {
          codProducto: row.codProducto,
          precio: row.precio,
          nombre: row.nombre,
        };
        if(lista.length > 0){
          lista.map(item => {
            if(item.codProducto !== row.codProducto){
              lista.push(data);
            }
          })
        }else lista.push(data);
      })
    })

    return lista;

  }catch(err){
    await client.query("ROLLBACK");
    throw err;
  }finally{
    client.release();
  }
  
};

const modaliadPago = (cod) => {
  switch(cod){
    case 1: 
      return 'Efectivo'
    case 2:
      return 'Transferencia'
    case 3:
      return 'Tarjeta de crédito'
    case 4:
      return 'Tarjeta de débito'
    case 5:
      return null;
  }
}

// Obtener una factura con sus detalles
const findDetail = async (rifSucursal) => {
  const query1 = `
    SELECT * FROM "FacturasClientes"
    WHERE "rifSucursal" = $1
  `;

  const params1 = [rifSucursal];

  const { rows: facturas } = await db.query(query1, params1);

  if(!facturas) return null;

  const promises = [];

  promises.push(
    Promise.all(
      facturas.map(f => {
        const query = `
          SELECT * FROM "Pagos"
          WHERE "nroPago" = 1
          AND "nroFactura" = $1
        `;
        
        const params = [f.nroFactura];

        return db.query(query, params);
      })
    )
  );

  const rows = await Promise.all(promises);

  const pagos = [];

  if(rows[0]){
    rows[0].map(row => {
      row.rows.map(item => {
        pagos.push(item);
      })
    })
  }

  const data = []
  pagos.forEach(p => {
    facturas.forEach(f => {
      if(p.nroFactura === f.nroFactura){
        const x = {
          nroFactura: p.nroFactura,
          monto: p.monto,
          cedCliente: f.cedCliente,
          fechaFacturacion: f.fechaFacturacion,
          descuento: f.descuento,
          formaPago: modaliadPago(p.codModalidad)
        }
        data.push(x)
      }
    })
  })

  return data;
}

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

module.exports = { findAll, findById, findDetail, create, update };
module.exports.delete = deleteFactura;
