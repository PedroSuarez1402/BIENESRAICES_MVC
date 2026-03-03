import { Precio } from "../models/index.js";

export class PrecioService {
    // Obtiene todos los precios de la base de datos
    static async obtenerTodosRaw() {
        return await Precio.findAll({ raw: true });
    }
}