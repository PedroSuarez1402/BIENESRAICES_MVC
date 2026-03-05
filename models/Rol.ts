import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db.js';

class Rol extends Model<InferAttributes<Rol>, InferCreationAttributes<Rol>> {
    declare id: CreationOptional<number>;
    declare nombre: string; // Ej: 'Admin', 'Asesor', 'Cliente'
}

Rol.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(30), allowNull: false, unique: true }
}, { sequelize: db, tableName: 'roles' });

export default Rol;