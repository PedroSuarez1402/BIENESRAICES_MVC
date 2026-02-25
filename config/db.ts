import { Sequelize } from "sequelize";

// 🕵️‍♂️ Esta línea nos dirá la verdad en la terminal
console.log("Intentando conectar a MySQL con el usuario:", process.env.BD_USER);

const db = new Sequelize(
    process.env.BD_NOMBRE as string,
    process.env.BD_USER as string,
    process.env.BD_PASS ?? '',
    {
        host: process.env.BD_HOST as string,
        port: 3306,
        dialect: 'mysql',
        define: {
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default db;