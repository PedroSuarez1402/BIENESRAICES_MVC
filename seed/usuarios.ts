import bcrypt from 'bcrypt';

interface UsuarioSeed {
    nombre: string;
    email: string;
    confirmado: boolean; // TypeScript nos obliga a usar boolean, no números
    password: string;
}

const usuarios: UsuarioSeed[] = [
    {
        nombre: 'Juan',
        email: 'juan@juan.com',
        confirmado: true, // Cambiamos el 1 por true
        password: bcrypt.hashSync('password', 10)
    }
];

export default usuarios;