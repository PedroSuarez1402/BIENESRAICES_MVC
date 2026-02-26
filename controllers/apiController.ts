import { Request, Response } from 'express';
import { PropiedadService } from '../services/PropiedadService.js';
/**
 * Controlador para la API pública.
 * Exenta de validaciones de sesión, devuelve datos crudos en formato JSON
 * para ser consumidos por el frontend (ej. el mapa interactivo).
 */
const propiedades = async (req: Request, res: Response) => {
    // Delegamos la consulta a la base de datos a nuestro servicio
    const propiedades = await PropiedadService.obtenerTodasConRelaciones();

    // El controlador solo se encarga de responder en formato JSON
    res.json(propiedades);
}

export { propiedades }