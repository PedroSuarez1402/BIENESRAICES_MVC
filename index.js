import express from 'express'
import cookieParser from 'cookie-parser'
import { csrfSync } from 'csrf-sync'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

// Crear la app
const app = express()

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }))

// Habilitar Cookie Parser
app.use(cookieParser())

const { generateToken, csrfSynchronisedProtection } = csrfSync({
    getTokenFromState: (req) => req.cookies.csrfToken, // Leemos el token de la cookie
    getTokenFromRequest: (req) => req.body._csrf,      // Leemos el token del formulario (input oculto)
    storeTokenInState: (req, token) => {
        // Guardamos el token en una cookie de forma segura
        req.res.cookie('csrfToken', token, { httpOnly: true });
    }
});

// Aplicar la proteccion CSRF en toda la app
app.use(csrfSynchronisedProtection);

// Middleware para no romper controladores que usan req.csrfToken()
app.use((req, res, next) => {
    req.csrfToken = () => generateToken(req);
    next();
});

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conexión Correcta a la Base de datos')
} catch (error) {
    console.log(error)
}

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta Pública
app.use(express.static('public'))

// Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)




// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El Servidor esta funcionando en el puerto ${port}`)
});