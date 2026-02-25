import { Request, Response } from 'express';
import { Sequelize, Op } from 'sequelize';
import { Precio, Categoria, Propiedad } from '../models/index.js';

const inicio = async (req: Request, res: Response) => {
    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: { categoriaId: 1 },
            include: [{ model: Precio, as: 'precio' }],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: { categoriaId: 2 },
            include: [{ model: Precio, as: 'precio' }],
            order: [['createdAt', 'DESC']]
        })
    ]);

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken!()
    });
}

const categoria = async (req: Request, res: Response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id as string);
    if (!categoria) {
        return res.redirect('/404');
    }

    const propiedades = await Propiedad.findAll({
        where: { categoriaId: id as string },
        include: [{ model: Precio, as: 'precio' }]
    });

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades,
        csrfToken: req.csrfToken!()
    });
}

const noEncontrado = (req: Request, res: Response) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken!()
    });
}

const buscador = async (req: Request, res: Response) => {
    const termino = req.body.termino as string;

    if (!termino.trim()) {
        return res.redirect('back');
    }

    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Op.like]: '%' + termino + '%'
            }
        },
        include: [{ model: Precio, as: 'precio' }]
    });

    res.render('busqueda', {
        pagina: 'Resultados de la Búsqueda',
        propiedades,
        csrfToken: req.csrfToken!()
    });
}

export { inicio, categoria, noEncontrado, buscador }