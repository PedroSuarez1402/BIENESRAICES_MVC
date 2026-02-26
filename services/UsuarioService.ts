import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarJWT, generarId } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

export class UsuarioService {
    /**
     * Autentica un usuario con email y password
     */
    static async autenticar(email: string, password: string) {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return {
                exito: false,
                errores: [{ msg: 'El Usuario No Existe' }]
            };
        }

        if (!usuario.confirmado) {
            return {
                exito: false,
                errores: [{ msg: 'Tu Cuenta no ha sido Confirmada' }]
            };
        }

        if (!usuario.verificarPassword(password)) {
            return {
                exito: false,
                errores: [{ msg: 'El Password es Incorrecto' }]
            };
        }

        const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

        return {
            exito: true,
            usuario,
            token
        };
    }

    /**
     * Verifica si un email ya está registrado
     */
    static async verificarEmailExistente(email: string) {
        return await Usuario.findOne({ where: { email } });
    }

    /**
     * Crea un nuevo usuario
     */
    static async crearUsuario(datos: any) {
        const { nombre, email, password } = datos;
        
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            token: generarId()
        });

        // Enviar email de confirmación
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token!
        });

        return usuario;
    }

    /**
     * Confirma la cuenta de un usuario mediante token
     */
    static async confirmarCuenta(token: string) {
        const usuario = await Usuario.findOne({ where: { token } });

        if (!usuario) {
            return {
                exito: false,
                mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
                error: true
            };
        }

        usuario.token = null;
        usuario.confirmado = true;
        await usuario.save();

        return {
            exito: true,
            mensaje: 'La cuenta se confirmó Correctamente',
            error: false
        };
    }

    /**
     * Inicia el proceso de recuperación de password
     */
    static async iniciarRecuperacionPassword(email: string) {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return {
                exito: false,
                errores: [{ msg: 'El Email no Pertenece a ningún usuario' }]
            };
        }

        usuario.token = generarId();
        await usuario.save();

        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token!
        });

        return {
            exito: true,
            mensaje: 'Hemos enviado un email con las instrucciones'
        };
    }

    /**
     * Verifica si el token de recuperación es válido
     */
    static async verificarTokenRecuperacion(token: string) {
        const usuario = await Usuario.findOne({ where: { token } });

        if (!usuario) {
            return {
                exito: false,
                mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
                error: true
            };
        }

        return {
            exito: true,
            usuario
        };
    }

    /**
     * Establece un nuevo password para el usuario
     */
    static async establecerNuevoPassword(token: string, password: string) {
        const usuario = await Usuario.findOne({ where: { token } });

        if (!usuario) {
            return {
                exito: false,
                redirigir: '/auth/login'
            };
        }

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        usuario.token = null;
        await usuario.save();

        return {
            exito: true,
            mensaje: 'El Password se guardó correctamente'
        };
    }

    /**
     * Busca un usuario por su email
     */
    static async buscarPorEmail(email: string) {
        return await Usuario.findOne({ where: { email } });
    }

    /**
     * Busca un usuario por su token
     */
    static async buscarPorToken(token: string) {
        return await Usuario.findOne({ where: { token } });
    }

    /**
     * Verifica si un usuario está confirmado
     */
    static verificarUsuarioConfirmado(usuario: any) {
        return usuario.confirmado;
    }

    /**
     * Verifica el password de un usuario
     */
    static verificarPassword(usuario: any, password: string) {
        return usuario.verificarPassword(password);
    }
}
