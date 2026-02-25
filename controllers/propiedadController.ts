import { Request, Response, NextFunction } from 'express';
import { unlink } from 'node:fs/promises';
import { validationResult } from 'express-validator';
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js';
import { esVendedor, formatearFecha } from '../helpers/index.js';

const admin = async (req: Request, res: Response) => {
    const paginaActual = req.query.pagina as string;
    const expresion = /^[1-9]$/;

    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1');
    }

    const { id } = req.usuario;
    const limit = 10;
    const offset = ((Number(paginaActual) * limit) - limit);

    const [propiedades, total] = await Promise.all([
        Propiedad.findAll({
            limit,
            offset,
            where: { usuarioId: id },
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Precio, as: 'precio' },
                { model: Mensaje, as: 'mensajes' }
            ],
        }),
        Propiedad.count({ where: { usuarioId: id } })
    ]);

    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        propiedades,
        csrfToken: req.csrfToken!(),
        paginas: Math.ceil(total / limit),
        paginaActual: Number(paginaActual),
        total,
        offset,
        limit
    });
}

const crear = async (req: Request, res: Response) => {
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

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
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken!(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;
    const { id: usuarioId } = req.usuario;

    // ¡Adiós try/catch!
    const propiedadGuardada = await Propiedad.create({
        titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId, categoriaId, usuarioId, imagen: ''
    });

    res.redirect(`/propiedades/agregar-imagen/${propiedadGuardada.id}`);
}

const agregarImagen = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id as string);

    if (!propiedad || propiedad.publicado || req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
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
    const propiedad = await Propiedad.findByPk(id as string);

    if (!propiedad || propiedad.publicado || req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    // req.file ya está tipado gracias a @types/multer
    propiedad.imagen = req.file!.filename; 
    propiedad.publicado = true;

    await propiedad.save();
    next();
}

const editar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id as string);

    if (!propiedad || propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

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
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

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
    const propiedad = await Propiedad.findByPk(id as string);

    if (!propiedad || propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;

    propiedad.set({ titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId, categoriaId });
    await propiedad.save();

    res.redirect('/mis-propiedades');
}

const eliminar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id as string);

    if (!propiedad || propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    await unlink(`public/uploads/${propiedad.imagen}`);
    console.log(`Se eliminó la imagen ${propiedad.imagen}`);

    await propiedad.destroy();
    res.redirect('/mis-propiedades');
}

const cambiarEstado = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id as string);

    if (!propiedad || propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    propiedad.publicado = !propiedad.publicado;
    await propiedad.save();

    res.json({ resultado: true });
}

const mostrarPropiedad = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id as string, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' },
        ]
    });

    if (!propiedad || !propiedad.publicado) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken!(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    });
}

const enviarMensaje = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id as string, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' },
        ]
    });

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
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        });
    }

    const { mensaje } = req.body;
    const { id: propiedadId } = req.params;
    const { id: usuarioId } = req.usuario;

    await Mensaje.create({ mensaje, propiedadId: Number(propiedadId), usuarioId: Number(usuarioId) });
    res.redirect('/');
}

const verMensajes = async (req: Request, res: Response) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id as string, {
        include: [
            {
                model: Mensaje, as: 'mensajes',
                include: [{ model: Usuario.scope('eliminarPassword'), as: 'usuario' }]
            },
        ],
    });

    if (!propiedad || propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    });
}

export { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes }