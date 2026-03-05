import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { UsuarioService } from '../services/UsuarioService.js';
import usuarios from '../seed/usuarios.js';

const formularioLogin = (req: Request, res: Response) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken!()
    });
}

const autenticar = async (req: Request, res: Response) => {
    await check('email').isEmail().withMessage('El Email es Obligatorio').run(req);
    await check('password').notEmpty().withMessage('El Password es Obligatorio').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken!(),
            errores: resultado.array()
        });
    }

    const { email, password } = req.body;
    const authResult = await UsuarioService.autenticar(email, password);

    if (!authResult.exito) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken!(),
            errores: authResult.errores
        });
    }

    return res.cookie('_token', authResult.token!, {
        httpOnly: true,
    }).redirect('/mis-propiedades');
}

const cerrarSesion = (req: Request, res: Response) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login');
}

const formularioRegistro = (req: Request, res: Response) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken!()
    });
}

const registrar = async (req: Request, res: Response) => {
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals('password').withMessage('Los Passwords no son iguales').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken!(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    const existeUsuario = await UsuarioService.verificarEmailExistente(req.body.email);

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken!(),
            errores: [{ msg: 'El Usuario ya esta Registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    await UsuarioService.crearUsuario(req.body);

    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmación, presiona en el enlace'
    });
}

const confirmar = async (req: Request, res: Response) => {
    const { token } = req.params;
    const resultado = await UsuarioService.confirmarCuenta(token as string);

    res.render('auth/confirmar-cuenta', {
        pagina: resultado.error ? 'Error al confirmar tu cuenta' : 'Cuenta Confirmada',
        mensaje: resultado.mensaje,
        error: resultado.error
    });
}

const formularioOlvidePassword = (req: Request, res: Response) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken!(),
    });
}

const resetPassword = async (req: Request, res: Response) => {
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken!(),
            errores: resultado.array()
        });
    }

    const resetResult = await UsuarioService.iniciarRecuperacionPassword(req.body.email);

    if (!resetResult.exito) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken!(),
            errores: resetResult.errores
        });
    }

    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: resetResult.mensaje
    });
}

const comprobarToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const resultado = await UsuarioService.verificarTokenRecuperacion(token as string);

    if (!resultado.exito) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: resultado.mensaje,
            error: resultado.error
        });
    }

    res.render('auth/reset-password', {
        pagina: 'Reestablece Tu Password',
        csrfToken: req.csrfToken!()
    });
}

const nuevoPassword = async (req: Request, res: Response) => {
    await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req);
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken!(),
            errores: resultado.array()
        });
    }

    const { token } = req.params;
    const { password } = req.body;
    const passwordResult = await UsuarioService.establecerNuevoPassword(token as string, password);

    if (!passwordResult.exito && passwordResult.redirigir) {
        return res.redirect(passwordResult.redirigir);
    }

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: passwordResult.mensaje
    });
}

const miPerfil = async (req: Request, res: Response) => {
    res.render('auth/perfil', {
        pagina: 'Mi Perfil',
        csrfToken: req.csrfToken!(),
        usuarioInfo: req.usuario
    })
}

const administrarUsuarios = async (req: Request, res: Response) => {
    const usuarios = await UsuarioService.obtenerTodosLosUsuarios();

    res.render('auth/admin-usuarios', {
        pagina: 'Administrar Usuarios',
        csrfToken: req.csrfToken!(),
        usuarios
    })
}

export { formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword, miPerfil, administrarUsuarios }