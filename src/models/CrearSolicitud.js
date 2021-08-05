const db = require("../db");

// jaja si que te esperabas que hiciera el componente se llama crear solicitud
const create = async (rifSucursal, codServicio, nroActividad, monto, solicitud) => {
  const client = await db.getClient();

  try{

    client.query("BEGIN");

    const query1 = `
      INSERT INTO "SolicitudesServicio"
      ("fechaEntrada", "fechaSalidaEstimada", "fechaSalidaReal", "codVehiculo", "rifSucursal", autorizado)
      VALUES  ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const params1 = [
      solicitud.fechaEntrada, 
      solicitud.fechaSalidaEstimada,
      solicitud.fechaSalidaReal,
      solicitud.codVehiculo,
      rifSucursal,
      solicitud.autorizado,
    ];

    const { rows: rows1 } = await client.query(query1, params1);

    const query2 = `
      INSERT INTO "DetallesSolicitudes"
      ("nroSolicitud", "codServicio", "nroActividad", monto)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `;

    const params2 = [
      rows1[0].nroSolicitud,
      codServicio, 
      nroActividad,
      monto
    ];

    const { rows: rows2 } = await client.query(query2, params2);
    
    const newSolicitud = {...rows1[0], ...rows2[0]};

    return newSolicitud;

  }catch(err){
    await client.query("ROLLBACK");
    throw err;
  }finally{
    client.release();
  }
}

module.exports = { create };