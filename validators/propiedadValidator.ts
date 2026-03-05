import { body } from 'express-validator';

// Validaciones para crear una propiedad
export const validarCrearPropiedad = [
    body('titulo')
        .notEmpty()
        .withMessage('El Titulo del Anuncio es Obligatorio'),
    
    body('descripcion')
        .notEmpty()
        .withMessage('La Descripción no puede ir vacia')
        .isLength({ max: 200 })
        .withMessage('La Descripción es muy larga'),
    
    body('categoria')
        .isNumeric()
        .withMessage('Selecciona una categoría'),
    
    body('precio')
        .isNumeric()
        .withMessage('Selecciona un rango de Precios'),
    
    body('habitaciones')
        .isNumeric()
        .withMessage('Selecciona la Cantidad de Habitaciones'),
    
    body('estacionamiento')
        .isNumeric()
        .withMessage('Selecciona la Cantidad de Estacionamientos'),
    
    body('wc')
        .isNumeric()
        .withMessage('Selecciona la Cantidad de Baños'),
    
    body('lat')
        .notEmpty()
        .withMessage('Ubica la Propiedad en el Mapa')
];

// Validaciones para editar una propiedad
export const validarEditarPropiedad = [
    body('titulo')
        .notEmpty()
        .withMessage('El Titulo del Anuncio es Obligatorio'),
    
    body('descripcion')
        .notEmpty()
        .withMessage('La Descripción no puede ir vacia')
        .isLength({ max: 200 })
        .withMessage('La Descripción es muy larga'),
    
    body('categoria')
        .isNumeric()
        .withMessage('Selecciona una categoría'),
    
    body('precio')
        .isNumeric()
        .withMessage('Selecciona un rango de Precios'),
    
    body('habitaciones')
        .isNumeric()
        .withMessage('Selecciona la Cantidad de Habitaciones'),
    
    body('estacionamiento')
        .isNumeric()
        .withMessage('Selecciona la Cantidad de Estacionamientos'),
    
    body('wc')
        .isNumeric()
        .withMessage('Selecciona la Cantidad de Baños'),
    
    body('lat')
        .notEmpty()
        .withMessage('Ubica la Propiedad en el Mapa')
];

// Validaciones para enviar mensajes
export const validarMensaje = [
    body('mensaje')
        .isLength({ min: 20 })
        .withMessage('El Mensaje no puede ir vacio o es muy corto')
];
