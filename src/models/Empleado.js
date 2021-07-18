const db = require("../db");

// Buscar todos los Empleados
const findAll = async () => {
  const query = `
    SELECT * 
    FROM "Empleados"
  `;

  const { rows } = await db.query(query);

  return rows;
};

// Buscar por cédula
const findById = async (cedula) => {
  const query = `
    SELECT *
    FROM "VistaEmpleados" 
    WHERE "cedula" = $1
  `;

  const params = [cedula];

  const { rows } = await db.query(query, params);
  return rows[0];
};

// Crear nuevo empleado
const create = async (empleado) => {

  const client = await db.getClient();

  try {
    await client.query('BEGIN')
    
    const query1 = `
      INSERT INTO "Trabajadores"
      ("cedula", "nombre", "apellido", "telefono", "direccion", "usuario", "contrasena", "sueldo", "tipoTrabajador")
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, 'empleado')
      RETURNING *
    `;

    const params1 = [
      empleado.cedula,
      empleado.nombre,
      empleado.apellido,
      empleado.telefono,
      empleado.direccion,
      empleado.usuario,
      empleado.contrasena,
      empleado.sueldo,
    ]

    const { rows: rows1 } = await client.query(query1, params1);

    const query2 = `
      INSERT INTO "Empleados"
      ("cedula", "rifSucursal")
      VALUES($1, $2)
      RETURNING *
    `;

    const params2 = [
      empleado.cedula,
      empleado.rifSucursal,
    ];

    const { rows: rows2 } = await client.query(query2, params2);

    await client.query('COMMIT TRANSACTION');

    const newEmpleado = { ...rows1[0], ...rows2[0] };

    return newEmpleado;

  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

};

// Actualizar un empleado
const update = async (cedula, empleado) => {
  const query = `
    UPDATE "Empleados"
    SET "cedula" = $1,
    "rifSucursal" = $2
    WHERE "cedula" = $3
    RETURNING *
  `;

  const params = [
    empleado.cedula,
    empleado.rifSucursal,
    cedula
  ];

  const { rows } = await db.query(query, params);

  return rows[0];
};

// Eliminar un empleado
const deleteEmpleado = async (cedula) => {
  const query = `
    DELETE FROM "Empleados"
    WHERE "cedula" = $1
  `;

  const params = [cedula];

  await db.query(query, params);
};

module.exports = { findAll, findById, create, update };
module.exports.delete = deleteEmpleado;
