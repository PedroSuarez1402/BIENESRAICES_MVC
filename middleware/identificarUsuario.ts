import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Usuario, Rol } from '../models/index.js';

// Creamos una interfaz para decirle a TS qué datos tiene nuestro Token
interface UserPayload extends JwtPayload {
    id: number;
}

const identificarUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const { _token } = req.cookies;
    if (!_token) {
        req.usuario = null;
        return next();
    }

    try {
        // Le aseguramos a TS que JWT_SECRET es un string y que el resultado es nuestro UserPayload
        const decoded = jwt.verify(_token, process.env.JWT_SECRET as string) as UserPayload;
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id, {
            include: [{ model: Rol, as: 'rol' }]
        });
        
        if (usuario) {
            req.usuario = usuario;
            res.locals.usuario = usuario;
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default identificarUsuario;