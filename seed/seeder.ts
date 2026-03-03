import { exit } from 'node:process';
import categorias from './categorias.js';
import precios from './precios.js';
import usuarios from './usuarios.js';
import db from '../config/db.js';
import { Categoria, Precio, Usuario } from '../models/index.js';

const importarDatos = async (): Promise<void> => {
    try {
        // Autenticar 
        await db.authenticate();

        // Generar las Columnas
        await db.sync();

        // Insertamos los datos
        // TypeScript sabe que bulkCreate recibe un array que coincida con los modelos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ]);

        console.log('✅ Datos Importados Correctamente');
        exit(0); // 0 significa que terminó con éxito
        
    } catch (error) {
        console.log('❌ Error al importar datos:', error);
        exit(1); // 1 significa que hubo un error
    }
}

const eliminarDatos = async (): Promise<void> => {
    try {
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