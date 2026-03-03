import { Categoria } from "../models/index.js";

export class CategoriaService {
    // Obtiene todos las categorias de la base de datos
    static async obtenerTodasRaw() {
        return await Categoria.findAll({ raw: true });
    }
    
    // Obtiene una categoria por su ID
    static async obtenerPorId(id: string | number) {
        return await Categoria.findByPk(id);
    }
}