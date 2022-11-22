import nodemailer from 'nodemailer';

const generarId = () =>
  Math.random().toString(32).substring(2) + Date.now().toString(32);

const authenticated = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "dd9d894248a8ed",
    pass: "72e6af35fc7032"
  },
});

const enviarCorreo = async (usuario) => {
  const { nombre, correo, contrasena, token } = usuario;

  await authenticated.sendMail({
    from: "proyectonodejs@developer.com",
    sender: "Jaime Zapata Valencia",
    to: correo,
    subject: "Creacion de usuario",
    html: `
        <h1 style="color: red; text-align: center;">Bienvenido a Proyectos Node JS</h1>
        <h2>Hola ${nombre}</h2>
        <h3>Instrucciones de activacion</h3>
        <ul>
          <li>Correo: ${correo}</li>
          <li>Contrasena: ${contrasena}</li>
        </ul>
  
        <p>Para confirmar usuario dar click en el enlace adjunto a este correo</p>
        <p><a href="http://localhost:3000/auth/confirmarUsuario/${token}">Activar usuario</a></p>
      `,
  });
};

const reenviarCorreo = async (usuario) => {
  const { nombre, correo, contrasena, token } = usuario;

  await authenticated.sendMail({
    from: "proyectonodejs@developer.com",
    sender: "Jaime Zapata Valencia",
    to: correo,
    subject: "Recuperar contraseña",
    html: `
        <h1 style="color: red; text-align: center;">Bienvenido a Proyectos Node JS</h1>
        <h2>Hola ${nombre}</h2>
        <h3>Instrucciones de recuperación/cambio</h3>
        <ul>
          <li>Correo: ${correo}</li>
        </ul>
  
        <p>Para cambiar la contraseña dar click en el enlace adjunto a este correo</p>
        <p><a href="http://localhost:3000/auth/recupear/${token}">Recuperar contraseña</a></p>
        <p>Si no fuite tu quien pidió recupear contraseña, ignora este correo</p>
      `,
  });
};

export { 
  enviarCorreo, 
  generarId,
  reenviarCorreo
};
