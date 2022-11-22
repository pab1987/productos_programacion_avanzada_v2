import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import { dataBase } from "../config/dataBase.js";

const Usuario = dataBase.define('usuario', {
  nombre:{
    type: DataTypes.STRING,
    allowNull: false
  }, 
  correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: DataTypes.STRING,
  estado: DataTypes.BOOLEAN
})

export{
  Usuario
}