import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { csrfSync } from 'csrf-sync';

// En TypeScript con "type": "module", las importaciones locales DEBEN 
// mantener la extensión .js al final, aunque los archivos sean .ts. 
// (Es una regla estricta de Node.js)
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';

// -------------------------------------------------------------------
// 🛠️ EXTENSIÓN DE TIPOS DE EXPRESS (Declaration Merging)
// Le decimos a TypeScript que nuestro Request siempre tendrá csrfToken
// -------------------------------------------------------------------
declare global {
    namespace Express {
        interface Request {
            csrfToken: () => string;
            usuario?: any;
        }
    }
}

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar Cookie Parser
app.use(cookieParser());

// Configuración de CSRF
const { generateToken, csrfSynchronisedProtection } = csrfSync({
    getTokenFromState: (req: Request) => req.cookies.csrfToken, 

    getTokenFromRequest: (req: Request) => {
        return req.body._csrf || (req.headers['csrf-token'] as string);
    },
    storeTokenInState: (req: Request, token: string | null | undefined) => {
        if (token) {
            // Usamos req.res?.cookie para evitar errores de tipado en TS
            req.res?.cookie('csrfToken', token, { httpOnly: true });
        }
    }
});

// Aplicar la protección CSRF en toda la app
app.use(csrfSynchronisedProtection);

// Middleware tipado para no romper controladores que usan req.csrfToken()
app.use((req: Request, res: Response, next: NextFunction) => {
    req.csrfToken = () => generateToken(req);
    next();
});

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('✅ Conexión Correcta a la Base de datos');
} catch (error) {
    console.log('❌ Error en BD:', error);
}

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta Pública
app.use(express.static('public'));

// Routing
app.use('/', appRoutes);
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes);

// Definir un puerto y arrancar el proyecto
// process.env.PORT puede ser string o undefined, TS lo sabe y lo maneja bien
const port: number | string = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 El Servidor está funcionando en el puerto ${port}`);
});