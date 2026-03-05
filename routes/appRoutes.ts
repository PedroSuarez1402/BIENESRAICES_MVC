import express from 'express';
import { inicio, categoria, noEncontrado, buscador } from '../controllers/appController.js';
import identificarUsuario from '../middleware/identificarUsuario.js';

const router = express.Router();

router.get('/', identificarUsuario, inicio);
router.get('/categorias/:id', identificarUsuario, categoria);
router.get('/404', identificarUsuario, noEncontrado);
router.post('/buscador', identificarUsuario, buscador);

export default router;