import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db.js';

class Precio extends Model<InferAttributes<Precio>, InferCreationAttributes<Precio>> {
    declare id: CreationOptional<number>;
    declare nombre: string;
}

Precio.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(30), allowNull: false }
}, { sequelize: db, tableName: 'precios' });

export default Precio;