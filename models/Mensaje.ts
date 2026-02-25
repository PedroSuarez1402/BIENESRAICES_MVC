import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db.js';

class Mensaje extends Model<InferAttributes<Mensaje>, InferCreationAttributes<Mensaje>> {
    declare id: CreationOptional<number>;
    declare mensaje: string;
    
    // Llaves foráneas que se inyectarán en index.ts
    declare propiedadId: CreationOptional<number>;
    declare usuarioId: CreationOptional<number>;
}

Mensaje.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mensaje: { type: DataTypes.STRING(200), allowNull: false },
    propiedadId: { type: DataTypes.INTEGER, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize: db, tableName: 'mensajes' });

export default Mensaje;