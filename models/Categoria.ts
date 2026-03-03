import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db from '../config/db.js';

class Categoria extends Model<InferAttributes<Categoria>, InferCreationAttributes<Categoria>> {
    declare id: CreationOptional<number>;
    declare nombre: string;
}

Categoria.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(30), allowNull: false }
}, { sequelize: db, tableName: 'categorias' });

export default Categoria;