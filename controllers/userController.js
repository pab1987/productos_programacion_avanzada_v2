import { Usuario } from "../models/UserModel.js";
import { check, validationResult } from "express-validator";
import { enviarCorreo, generarId, reenviarCorreo } from "../helper/funciones.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    nombreVista: "Iniciar Sesion",
  });
};
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    nombreVista: "Nuevo Usuario",
    csrfToken: req.csrfToken(),
  });
};
const crearUsuario = async (req, res) => {
  await check("nombre")
    .notEmpty()
    .withMessage("El campo nombre es obligatorio")
    .run(req);
  await check("correo")
    .isEmail()
    .withMessage("El correo debe llevar un formato valido")
    .run(req);
  await check("contrasena")
    .isLength({ min: 5 })
    .withMessage("La contrasena debe tener minimo 5 caracteres")
    .run(req);
  let listadoErrores = validationResult(req);

  if (!listadoErrores.isEmpty()) {
    return res.render("auth/registro", {
      nombreVista: "Nuevo Usuario",
      csrfToken: req.csrfToken(),
      errores: listadoErrores.array(),
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo,
      },
    });
  }
  const { nombre, correo, contrasena } = req.body;

  const validarUsuario = await Usuario.findOne({ where: { correo } });

  if (validarUsuario) {
    return res.render("auth/registro", {
      nombreVista: "Nuevo Usuario",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El correo ya existe en la base de datos" }],
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo,
      },
    });
  }

  const usuario = await Usuario.create({
    nombre,
    correo,
    contrasena,
    token: generarId(),
  });

  enviarCorreo(usuario);

  res.render("templates/usuarioCreado", {
    nombreVista: "Confirmacion Usuario",
    mensaje:
      "Revisa tu correo electronico para confirmar la creacion de usuario",
  });
};
const activarUsuario = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (usuario) {
    usuario.token = null;
    usuario.estado = true;
    await usuario.save();
    return res.render("templates/usuarioCreado", {
      nombreVista: "Confirmacion Usuario",
      csrfToken: req.csrfToken(),
      mensaje: "Activacion de usuario correcta. Por favor iniciar sesion",
    });
  }

  res.render("templates/usuarioCreado", {
    nombreVista: "Confirmacion Usuario",
    mensaje: "No se pudo activar la cuenta. Token errado o expirado",
  });
};
const formularioRecuperar = (req, res) => {
  res.render("auth/recuperar", {
    nombreVista: "Recuperar Usuario",
    csrfToken: req.csrfToken(),
  });
};
const recuperarContrasena = async (req, res) => {
  await check("correo")
    .isEmail()
    .withMessage("El correo debe llevar un formato valido")
    .run(req);
  let listadoErrores = validationResult(req);

  if (!listadoErrores.isEmpty()) {
    return res.render("auth/recuperar", {
      nombreVista: "Nuevo Usuario",
      csrfToken: req.csrfToken(),
      errores: listadoErrores.array(),
    });
  }

  const { correo } = req.body;
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) {
    return res.render("auth/recuperar", {
      nombreVista: "Nuevo Usuario",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El correo no pertenece a nadie en la base de datos" }],
    });
  }

  usuario.token = generarId();
  await usuario.save();
  reenviarCorreo(usuario)
};

export {
  formularioLogin,
  formularioRegistro,
  formularioRecuperar,
  crearUsuario,
  activarUsuario,
  recuperarContrasena,
};
