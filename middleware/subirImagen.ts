import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { generarId } from '../helpers/tokens.js';

const storage = multer.diskStorage({
    destination: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, './public/uploads/');
    },
    filename: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, generarId() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export default upload;