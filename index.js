// Importanto la dependencia y extrayeno la funcion de exress
import express from 'express'
import { userRouter } from './routes/userRouter.js'
import { dataBase } from './config/dataBase.js'
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(csurf({cookie: true}));

const puerto = 3000

try {
  await dataBase.authenticate()
  dataBase.sync()
  console.log('Coneccion exitosa a la base de datos')
} catch (error) {
  console.log(error)
}

app.use('/auth', userRouter)
app.set('view engine', 'pug')
app.set('views', './views')

// Levantando el servidor en el peurto con la funcion lister de express
app.listen(puerto, ()=>{
  console.log(`Servidor corriendo en el puerto ${puerto}`)
})