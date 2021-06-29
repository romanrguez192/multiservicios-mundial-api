require("dotenv").config();

const app = require("./app");
const db = require("./db");

const main = async () => {
  app.listen(app.get("port"), () =>
    console.log(`Server listening on port ${app.get("port")}`)
  );

  try {
    const client = await db.connect();
    console.log("Conectado a la base de datos");
    client.release();
  } catch (error) {
    console.error("Error al conectar: ", err.stack);
  }
};

main();
