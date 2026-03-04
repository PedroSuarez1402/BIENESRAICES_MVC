import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

class Usuario extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>> {
    declare id: CreationOptional<number>;
    declare nombre: string;
    declare email: string;
    declare password: string;
    declare token: CreationOptional<string | null>;
    declare rolId: CreationOptional<number | null>;
    declare confirmado: CreationOptional<boolean | null>;

    // Método de instancia limpio gracias a las Clases ES6
    verificarPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}

Usuario.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    token: DataTypes.STRING,
    rolId: DataTypes.INTEGER,
    confirmado: DataTypes.BOOLEAN
}, {
    sequelize: db,
    tableName: 'usuarios',
    hooks: {
        beforeCreate: async (usuario: Usuario) => {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
});

export default Usuario;