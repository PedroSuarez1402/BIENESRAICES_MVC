import { Op } from "sequelize";
import { unlink } from 'node:fs/promises';
import { Propiedad, Precio, Categoria, Mensaje, Usuario } from "../models/index.js";
import { esVendedor } from '../helpers/index.js';

export class PropiedadService {
    // Obtiene todas las propiedades con sus relaciones
    static async obtenerTodasConRelaciones() {
        return await Propiedad.findAll({
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' },
            ]
        });
    }
    /**
     * Obtiene las propiedades más recientes filtradas por categoría.
     * @param categoriaId ID de la categoría (ej. 1 para Casas)
     * @param limite Cantidad máxima de registros a devolver
     */
    static async obtenerUltimasPorCategoria(categoriaId: number, limite: number) {
        return await Propiedad.findAll({
            limit: limite,
            where: { categoriaId },
            include: [{ model: Precio, as: 'precio' }],
            order: [['createdAt', 'DESC']]
        });
    }
    /**
     * Obtiene todas las propiedades que pertenecen a una categoría específica.
     */
    static async obtenerPorCategoria(categoriaId: string | number) {
        return await Propiedad.findAll({
            where: { categoriaId },
            include: [{ model: Precio, as: 'precio' }]
        });
    }
    /**
     * Busca propiedades cuyo título coincida parcialmente con el término de búsqueda.
     */
    static async buscarPorTitulo(termino: string) {
        return await Propiedad.findAll({
            where: {
                titulo: {
                    [Op.like]: '%' + termino + '%'
                }
            },
            include: [{ model: Precio, as: 'precio' }]
        });
    }

    /**
     * Obtiene las propiedades del usuario con paginación
     */
    static async obtenerPropiedadesUsuario(usuarioId: number, paginaActual: number = 1) {
        const limit = 10;
        const offset = ((paginaActual * limit) - limit);

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: { usuarioId },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes' }
                ],
            }),
            Propiedad.count({ where: { usuarioId } })
        ]);

        return {
            propiedades,
            total,
            paginas: Math.ceil(total / limit),
            paginaActual,
            offset,
            limit
        };
    }

    /**
     * Obtiene categorías y precios para formularios
     */
    static async obtenerCategoriasYPrecios() {
        return await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);
    }

    /**
     * Crea una nueva propiedad
     */
    static async crearPropiedad(datos: any, usuarioId: number) {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = datos;
        
        return await Propiedad.create({
            titulo, 
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng, 
            precioId, 
            categoriaId, 
            usuarioId, 
            imagen: ''
        });
    }

    /**
     * Verifica si una propiedad existe y pertenece al usuario
     */
    static async verificarPropiedadUsuario(id: string | number, usuarioId: number) {
        const propiedad = await Propiedad.findByPk(id as string);
        
        if (!propiedad || propiedad.usuarioId.toString() !== usuarioId.toString()) {
            return null;
        }
        
        return propiedad;
    }

    /**
     * Verifica si una propiedad está disponible para agregar imagen
     */
    static async verificarPropiedadParaImagen(id: string | number, usuarioId: number) {
        const propiedad = await Propiedad.findByPk(id as string);

        if (!propiedad || propiedad.publicado || usuarioId.toString() !== propiedad.usuarioId.toString()) {
            return null;
        }

        return propiedad;
    }

    /**
     * Almacena la imagen de una propiedad y la publica
     */
    static async almacenarImagenPropiedad(id: string | number, nombreImagen: string) {
        const propiedad = await Propiedad.findByPk(id as string);
        
        if (!propiedad) throw new Error('Propiedad no encontrada');
        
        propiedad.imagen = nombreImagen;
        propiedad.publicado = true;
        
        await propiedad.save();
        return propiedad;
    }

    /**
     * Actualiza los datos de una propiedad
     */
    static async actualizarPropiedad(id: string | number, datos: any) {
        const propiedad = await Propiedad.findByPk(id as string);
        
        if (!propiedad) {
            throw new Error('Propiedad no encontrada');
        }

        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = datos;
        
        propiedad.set({ titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId, categoriaId });
        await propiedad.save();
        
        return propiedad;
    }

    /**
     * Elimina una propiedad y su imagen asociada
     */
    static async eliminarPropiedad(id: string | number) {
        const propiedad = await Propiedad.findByPk(id as string);
        
        if (!propiedad) throw new Error('Propiedad no encontrada');
        

        // Eliminar la imagen del sistema de archivos
        if (propiedad.imagen) {
            try {
                await unlink(`public/uploads/${propiedad.imagen}`);
                console.log(`Se eliminó la imagen física: ${propiedad.imagen}`);
            } catch (error) {
                console.log(`Advertencia: La imagen ${propiedad.imagen} no se encontró en el disco.`);
            }
        }

        await propiedad.destroy();
        return true;
    }

    /**
     * Cambia el estado de publicación de una propiedad
     */
    static async cambiarEstadoPropiedad(id: string | number) {
        const propiedad = await Propiedad.findByPk(id as string);
        
        if (!propiedad) {
            throw new Error('Propiedad no encontrada');
        }

        propiedad.publicado = !propiedad.publicado;
        await propiedad.save();
        
        return propiedad;
    }

    /**
     * Obtiene una propiedad pública con sus relaciones
     */
    static async obtenerPropiedadPublica(id: string | number) {
        return await Propiedad.findByPk(id as string, {
            include: [
                { model: Precio, as: 'precio' },
                { model: Categoria, as: 'categoria' },
            ]
        });
    }

    /**
     * Crea un mensaje para una propiedad
     */
    static async crearMensaje(datos: any) {
        const { mensaje, propiedadId, usuarioId } = datos;
        
        return await Mensaje.create({ 
            mensaje, 
            propiedadId: Number(propiedadId), 
            usuarioId: Number(usuarioId) 
        });
    }

    /**
     * Obtiene los mensajes de una propiedad con información del usuario
     */
    static async obtenerMensajesPropiedad(id: string | number) {
        return await Propiedad.findByPk(id as string, {
            include: [
                {
                    model: Mensaje, as: 'mensajes',
                    include: [{ model: Usuario.scope('eliminarPassword'), as: 'usuario' }]
                },
            ],
        });
    }

    /**
     * Verifica si el usuario es vendedor de la propiedad
     */
    static verificarVendedor(usuarioId: number | undefined, propiedadUsuarioId: number) {
        return esVendedor(usuarioId, propiedadUsuarioId);
    }
}