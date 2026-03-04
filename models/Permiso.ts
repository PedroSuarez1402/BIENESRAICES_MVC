import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db.js';

class Permiso extends Model<InferAttributes<Permiso>, InferCreationAttributes<Permiso>> {
    declare id: CreationOptional<number>;
    declare nombre: string; // Ej: 'crear_propiedad', 'eliminar_usuarios'
    declare descripcion: CreationOptional<string | null>;
}

Permiso.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    descripcion: { type: DataTypes.STRING(150), allowNull: true }
}, { sequelize: db, tableName: 'permisos' });

export default Permiso;