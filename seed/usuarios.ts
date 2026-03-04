import bcrypt from 'bcrypt';

interface UsuarioSeed {
    nombre: string;
    email: string;
    confirmado: boolean; // TypeScript nos obliga a usar boolean, no números
    password: string;
    rolId: number;
}

const usuarios: UsuarioSeed[] = [
    {
        nombre: 'Juan',
        email: 'juan@juan.com',
        confirmado: true, // Cambiamos el 1 por true
        password: bcrypt.hashSync('password', 10),
        rolId: 1
    },
    {
        nombre: 'Pedro',
        email: 'pedro@pedro.com',
        confirmado: true, // Cambiamos el 1 por true
        password: bcrypt.hashSync('password', 10),
        rolId: 2
    },
    {
        nombre: 'Maria',
        email: 'maria@maria.com',
        confirmado: true, // Cambiamos el 1 por true
        password: bcrypt.hashSync('password', 10),
        rolId: 3
    }
];

export default usuarios;