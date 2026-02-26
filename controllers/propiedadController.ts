import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PropiedadService } from '../services/PropiedadService.js';
import { CategoriaService } from '../services/CategoriaService.js';
import { PrecioService } from '../services/PrecioService.js';
import { formatearFecha } from '../helpers/index.js';

const admin = async (req: Request, res: Response) => {
    const paginaActual = req.query.pagina as string;
    const expresion = /^[1-9]$/;

    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1');
    }

    const { id } = req.usuario;
    const resultado = await PropiedadService.obtenerPropiedadesUsuario(id, Number(paginaActual));

    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        ...resultado,
        csrfToken: req.csrfToken!()
    });
}

const crear = async (req: Request, res: Response) => {
    const [categorias, precios] = await PropiedadService.obtenerCategoriasYPrecios();

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken!(),
        categorias,
        precios,
        datos: {}
    });
}

const guardar = async (req: Request, res: Response) => {
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        const [categorias, precios] = await PropiedadService.obtenerCategoriasYPrecios();

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken!(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { id: usuarioId } = req.usuario;
    const propiedadGuardada = await PropiedadService.crearPropiedad(req.body, usuarioId);

    res.redirect(`/propiedades/agregar-imagen/${propiedadGuardada.id}`);
}

const agregarImagen = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.verificarPropiedadParaImagen(id as string, req.usuario.id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken!(),
        propiedad
    });
}

const almacenarImagen = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.verificarPropiedadParaImagen(id as string, req.usuario.id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    try {
        await PropiedadService.almacenarImagenPropiedad(id as string, req.file!.filename);
        next();
    } catch (error) {
        return res.redirect('/mis-propiedades');
    }
}

const editar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.verificarPropiedadUsuario(id as string, req.usuario.id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    const [categorias, precios] = await PropiedadService.obtenerCategoriasYPrecios();

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken!(),
        categorias,
        precios,
        datos: propiedad
    });
}

const guardarCambios = async (req: Request, res: Response) => {
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        const [categorias, precios] = await PropiedadService.obtenerCategoriasYPrecios();

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken!(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { id } = req.params;
    const propiedad = await PropiedadService.verificarPropiedadUsuario(id as string, req.usuario.id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    await PropiedadService.actualizarPropiedad(id as string, req.body);
    res.redirect('/mis-propiedades');
}

const eliminar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.verificarPropiedadUsuario(id as string, req.usuario.id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    await PropiedadService.eliminarPropiedad(id as string);
    res.redirect('/mis-propiedades');
}

const cambiarEstado = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.verificarPropiedadUsuario(id as string, req.usuario.id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    await PropiedadService.cambiarEstadoPropiedad(id as string);
    res.json({ resultado: true });
}

const mostrarPropiedad = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.obtenerPropiedadPublica(id as string);

    if (!propiedad || !propiedad.publicado) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken!(),
        usuario: req.usuario,
        esVendedor: PropiedadService.verificarVendedor(req.usuario?.id, propiedad.usuarioId)
    });
}

const enviarMensaje = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.obtenerPropiedadPublica(id as string);

    if (!propiedad) {
        return res.redirect('/404');
    }

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken!(),
            usuario: req.usuario,
            esVendedor: PropiedadService.verificarVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        });
    }

    const { mensaje } = req.body;
    const { id: propiedadId } = req.params;
    const { id: usuarioId } = req.usuario;

    await PropiedadService.crearMensaje({ mensaje, propiedadId, usuarioId });
    res.redirect('/');
}

const verMensajes = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await PropiedadService.verificarPropiedadUsuario(id as string, req.usuario.id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    const mensajesPropiedad = await PropiedadService.obtenerMensajesPropiedad(id as string);

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: mensajesPropiedad?.mensajes || [],
        formatearFecha
    });
}

export { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes }