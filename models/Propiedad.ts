import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db.js';
import Mensaje from './Mensaje.js';
import Usuario from './Usuario.js';

class Propiedad extends Model<InferAttributes<Propiedad>, InferCreationAttributes<Propiedad>> {
    declare id: CreationOptional<string>; // UUID
    declare titulo: string;
    declare descripcion: string;
    declare habitaciones: number;
    declare estacionamiento: number;
    declare wc: number;
    declare calle: string;
    declare lat: string;
    declare lng: string;
    declare imagen: string;
    declare publicado: CreationOptional<boolean>;

    // Llaves foráneas
    declare precioId: CreationOptional<number>;
    declare categoriaId: CreationOptional<number>;
    declare usuarioId: CreationOptional<number>;

    // Asociaciones
    declare mensajes?: Mensaje[];
    declare precio?: any;
    declare categoria?: any;
    declare usuario?: any;
}

Propiedad.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    habitaciones: { type: DataTypes.INTEGER, allowNull: false },
    estacionamiento: { type: DataTypes.INTEGER, allowNull: false },
    wc: { type: DataTypes.INTEGER, allowNull: false },
    calle: { type: DataTypes.STRING(60), allowNull: false },
    lat: { type: DataTypes.STRING, allowNull: false },
    lng: { type: DataTypes.STRING, allowNull: false },
    imagen: { type: DataTypes.STRING, allowNull: false },
    publicado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    precioId: { type: DataTypes.INTEGER, allowNull: false },
    categoriaId: { type: DataTypes.INTEGER, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize: db, tableName: 'propiedades' });

export default Propiedad;