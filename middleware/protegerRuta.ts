import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Usuario, Rol, Permiso } from '../models/index.js';

interface UserPayload extends JwtPayload {
    id: number;
}

const protegerRuta = async (req: Request, res: Response, next: NextFunction) => {
    const { _token } = req.cookies;
    if (!_token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET as string) as UserPayload;
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id, {
            include: [
                {
                    model: Rol,
                    as: 'rol',
                    include: [{ model: Permiso, as: 'permisos' }]
                }
            ]
        });
        
        if (usuario) {
            req.usuario = usuario;
            res.locals.usuario = usuario;
        } else {
            return res.redirect('/auth/login');
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default protegerRuta;