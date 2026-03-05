import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from '../config/db.js';

class RolPermiso extends Model<InferAttributes<RolPermiso>, InferCreationAttributes<RolPermiso>> {
    declare rolId: number;
    declare permisoId: number;
}

RolPermiso.init({
    rolId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    permisoId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false }
}, { sequelize: db, tableName: 'roles_permisos', timestamps: false });

export default RolPermiso;