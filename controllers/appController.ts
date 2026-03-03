import { Request, Response } from 'express';
import { PropiedadService } from '../services/PropiedadService.js';
import { CategoriaService } from '../services/CategoriaService.js';
import { PrecioService } from '../services/PrecioService.js';

/**
 * Renderiza la pagina principal
 * Orquesta las consultas simultaneas a traves de los servicios para armar la vista
 */

const inicio = async (req: Request, res: Response) => {
    // Ejecutamos todas las consultas al mismo tiempo
    const [ categorias, precios, casas, departamentos ] = await Promise.all([
        CategoriaService.obtenerTodasRaw(),
        PrecioService.obtenerTodosRaw(),
        PropiedadService.obtenerUltimasPorCategoria(1, 3),
        PropiedadService.obtenerUltimasPorCategoria(2, 3),
    ]);

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken!(),
    });
}

/* Muestra el catalogo de propiedades filtrando por categoria */
const categoria = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const categoria = await CategoriaService.obtenerPorId(id as string);
    if (!categoria) {
        return res.redirect('/404');
    }
    
    const propiedades = await PropiedadService.obtenerPorCategoria(id as string);
    
    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades,
        csrfToken: req.csrfToken!(),
    });
}

/**
 * Renderiza la página de error 404 estática.
 */
const noEncontrado = (req: Request, res: Response) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken!()
    });
}

/**
 * Procesa el formulario de búsqueda principal.
 * Valida el input básico y delega la búsqueda por comodines (LIKE) al servicio.
 */
const buscador = async (req: Request, res: Response) => {
    const termino = req.body.termino as string;

    // Validación temprana: Si el término está vacío, lo regresamos a la página anterior
    if (!termino.trim()) {
        return res.redirect('back');
    }

    // Buscamos a través de la Capa de Servicios
    const propiedades = await PropiedadService.buscarPorTitulo(termino);

    res.render('busqueda', {
        pagina: 'Resultados de la Búsqueda',
        propiedades,
        csrfToken: req.csrfToken!()
    });
}

export { inicio, categoria, noEncontrado, buscador }