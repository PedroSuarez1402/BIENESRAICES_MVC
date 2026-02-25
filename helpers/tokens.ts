import jwt from 'jsonwebtoken';

// Interface para los datos que vamos a encriptar en el JWT
interface JwtDatos {
    id: number;
    nombre: string;
}

const generarJWT = (datos: JwtDatos): string => {
    return jwt.sign(
        { id: datos.id, nombre: datos.nombre }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '1d' }
    );
};

const generarId = (): string => Math.random().toString(32).substring(2) + Date.now().toString(32);

export { generarJWT, generarId };