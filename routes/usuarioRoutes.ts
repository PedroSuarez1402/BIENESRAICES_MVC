import express from "express";
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword, miPerfil, administrarUsuarios } from '../controllers/usuarioController.js';
import protegerRuta from "../middleware/protegerRuta.js";
import verificarPermiso from "../middleware/verificarPermiso.js";

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', autenticar);
router.post('/cerrar-sesion', cerrarSesion);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

router.get('/perfil', protegerRuta, miPerfil);

router.get('/administrar-usuarios', protegerRuta, verificarPermiso('administrar_usuarios'), administrarUsuarios);

export default router;