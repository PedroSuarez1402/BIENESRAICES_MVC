import { Request, Response, NextFunction } from 'express';

const verificarPermiso = (permisoRequerido: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1. Verificamos que exista el usuario y tenga un rol
        if (!req.usuario || !req.usuario.rol) {
            return res.redirect('/auth/login');
        }

        // 2. Buscamos si dentro de su lista de permisos está el que la ruta exige
        const tienePermiso = req.usuario.rol.permisos.some(
            (permiso: any) => permiso.nombre === permisoRequerido
        );

        if (!tienePermiso) {
            // Si no tiene el permiso, lo devolvemos a sus propiedades
            // (En un futuro podríamos crear una vista '403 Acceso Denegado')
            return res.redirect('/mis-propiedades');
        }

        // 3. Si tiene el permiso, lo dejamos pasar al controlador
        next();
    };
};

export default verificarPermiso;