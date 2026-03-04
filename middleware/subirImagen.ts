// -------------------------------------------------------------------
// 🚀 Middleware de Carga de Archivos con Multer
// Este archivo configura 'multer' para gestionar la subida de archivos.
// Define el destino de almacenamiento y genera un nombre de archivo único
// para cada imagen, evitando colisiones y manteniendo la extensión original.
// -------------------------------------------------------------------
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { generarId } from '../helpers/tokens.js';

const storage = multer.diskStorage({
    // ¡Magia aquí! Al pasar un simple string en lugar de una función, 
    // Multer se encarga de crear la carpeta si no existe.
    destination: './public/uploads/',
    
    filename: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, generarId() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export default upload;