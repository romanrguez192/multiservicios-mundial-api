const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Empleado = require("./models/Empleado");
const Trabajador = require("./models/Trabajador");
const Encargado = require("./models/Encargado");


const initialize = (passport) => {
  const authenticateUser = async(usuario, contrasena, done) => {
    try{
      const trabajador = await Trabajador.login(usuario, contrasena)
      
      if (!trabajador) 
        return done(null, false, { message: "Usuario o contraseña inválidos" })
      

      if (trabajador.tipoTrabajador === "empleado") {
        const empleado = await Empleado.findById(trabajador.cedula);
        return done(null, empleado);
      }
    
      if (trabajador.tipoTrabajador === "encargado") {
        const encargado = await Encargado.findById(trabajador.cedula);
        return done(null, encargado)
      }

      // //Contraseña incorrecta
      // if(contrasena !== user.contrasena) return done(null, false)
      
      // const match = await bcrypt.compare(contrasena, user.contrasena)
      // if(match.valueOf()){
      //   //la contraseña es correcta
      // }
    
    }catch(err){
      return done(err)
    }
  }


  passport.use(new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena'
  }, authenticateUser))


  passport.serializeUser((user, done) => done(null, user.cedula));

  passport.deserializeUser(async(cedula, done) => {
    try{
      // Se verifica si es empleado
      const empleado = await Empleado.findById(cedula)
      if(empleado) return done(null, empleado)

      // Se verifica si es encargado
      const encargado = await Encargado.findById(cedula)
      if(encargado) return done(null, encargado)

      return done(null, false, { message: `No se encontro el trabajador por la cedula ${cedula}`})
    }catch(err){
      return done(err)
    }
  })
}

module.exports = initialize;