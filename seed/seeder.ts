import { exit } from 'node:process';
import categorias from './categorias.js';
import precios from './precios.js';
import usuarios from './usuarios.js';
import roles from './roles.js';
import permisos from './permisos.js';
import rolesPermisos from './rolesPermisos.js';

import db from '../config/db.js';
import { Categoria, Precio, Usuario, Rol, Permiso, RolPermiso } from '../models/index.js';

const importarDatos = async (): Promise<void> => {
    try {
        await db.authenticate();
        await db.sync(); // Genera las nuevas columnas y tablas

        // 1. Insertamos las tablas independientes primero
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Rol.bulkCreate(roles),
            Permiso.bulkCreate(permisos)
        ]);

        // 2. Insertamos las tablas que tienen llaves foráneas
        await Promise.all([
            Usuario.bulkCreate(usuarios),
            RolPermiso.bulkCreate(rolesPermisos)
        ]);

        console.log('✅ Datos Importados Correctamente con Roles y Permisos');
        exit(0);
        
    } catch (error) {
        console.log('❌ Error al importar datos:', error);
        exit(1);
    }
}

const eliminarDatos = async (): Promise<void> => {
    try {
        // force: true elimina todas las tablas y las vuelve a crear vacías
        await db.sync({ force: true });
        console.log('✅ Datos Eliminados Correctamente');
        exit(0);
    } catch (error) {
        console.log('❌ Error al eliminar datos:', error);
        exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}