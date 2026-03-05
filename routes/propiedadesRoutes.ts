import express from 'express';
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/propiedadController.js';
import protegerRuta from "../middleware/protegerRuta.js";
import upload from '../middleware/subirImagen.js';
import identificarUsuario from "../middleware/identificarUsuario.js";
import verificarPermiso from "../middleware/verificarPermiso.js";
import { validarCrearPropiedad, validarEditarPropiedad, validarMensaje } from '../validators/propiedadValidator.js';

const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin);
// 🔒 Aplicamos 'crear_propiedad'
router.get('/propiedades/crear', protegerRuta, verificarPermiso('crear_propiedad'), crear);
router.post('/propiedades/crear', 
    protegerRuta,
    verificarPermiso('crear_propiedad'), 
    validarCrearPropiedad,
    guardar
);

// Agregar imágenes asumo que también requiere crear_propiedad o editar_propiedad
router.get('/propiedades/agregar-imagen/:id', protegerRuta, verificarPermiso('crear_propiedad'), agregarImagen);
router.post('/propiedades/agregar-imagen/:id', protegerRuta, verificarPermiso('crear_propiedad'), upload.single('imagen'), almacenarImagen);

// 🔒 Aplicamos 'editar_propiedad'
router.get('/propiedades/editar/:id', protegerRuta, verificarPermiso('editar_propiedad'), editar);
router.post('/propiedades/editar/:id', 
    protegerRuta,
    verificarPermiso('editar_propiedad'),
    validarEditarPropiedad,
    guardarCambios
);

// 🔒 Aplicamos 'eliminar_propiedad'
router.post('/propiedades/eliminar/:id', protegerRuta, verificarPermiso('eliminar_propiedad'), eliminar);
router.put('/propiedades/:id', protegerRuta, verificarPermiso('editar_propiedad'), cambiarEstado);

// Area Publica
router.get('/propiedad/:id', identificarUsuario, mostrarPropiedad);

// 🔒 Aplicamos 'enviar_mensajes' (Opcional, pero ideal para el Cliente)
router.post('/propiedad/:id',
    identificarUsuario,
    validarMensaje,
    enviarMensaje
);

// 🔒 Aplicamos 'ver_mensajes'
router.get('/mensajes/:id', protegerRuta, verificarPermiso('ver_mensajes'), verMensajes);

export default router;