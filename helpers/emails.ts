import nodemailer from 'nodemailer';

// Definimos la estructura exacta que deben tener los datos
interface EmailDatos {
    email: string;
    nombre: string;
    token: string;
}

const emailRegistro = async (datos: EmailDatos): Promise<void> => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST as string,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASS as string
        }
    });

    const { email, nombre, token } = datos;

    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu Cuenta en BienesRaices.com',
        text: 'Confirma tu Cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a> </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    });
}

const emailOlvidePassword = async (datos: EmailDatos): Promise<void> => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST as string,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASS as string
        }
    });

    const { email, nombre, token } = datos;

    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu Password en BienesRaices.com',
        text: 'Reestablece tu Password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password en bienesRaices.com</p>

            <p>Sigue el siguiente enlace para generar un password nuevo: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer Password</a> </p>

            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `
    });
}

export { emailRegistro, emailOlvidePassword };