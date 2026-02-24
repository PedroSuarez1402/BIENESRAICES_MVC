# BienesRaices MVC

Aplicación web de bienes raíces construida con Node.js, Express, Sequelize, MySQL, Pug y Tailwind.

## Tecnologías
- Node.js
- Express
- Sequelize
- MySQL
- Pug
- Tailwind CSS
- Webpack
- Nodemailer (Mailtrap)

## Requisitos previos
- Node.js 18+ (recomendado)
- npm
- MySQL en ejecución (puerto 3306 por defecto)

## Clonar el proyecto
```bash
git clone <URL_DEL_REPOSITORIO>
cd BIENESRAICES_MVC
```

## Instalación
```bash
npm install
```

## Variables de entorno
Crea un archivo `.env` en la raíz del proyecto con este contenido base:

```env
BD_NOMBRE=bienesraices_node_mvc
BD_USER=root
BD_PASS=
BD_HOST=localhost

EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu_usuario_mailtrap
EMAIL_PASS=tu_password_mailtrap

BACKEND_URL=http://localhost
PORT=3000
JWT_SECRET=tu_clave_secreta
```

## Base de datos
Crea la base de datos en MySQL:

```sql
CREATE DATABASE bienesraices_node_mvc;
```

Luego puedes cargar datos iniciales (categorías, precios y un usuario):

```bash
npm run db:importar
```

Usuario semilla:
- Email: `juan@juan.com`
- Password: `password`

Si necesitas limpiar y recrear tablas:

```bash
npm run db:eliminar
```

## Ejecutar en entorno local
En desarrollo (watch de CSS/JS):

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run server
```

En modo normal:

```bash
npm start
```

La app quedará disponible en:
- `http://localhost:3000`

## Scripts disponibles
- `npm run server`: levanta servidor con nodemon
- `npm run dev`: compila assets (Tailwind + Webpack) en modo watch
- `npm run css`: compila Tailwind a `public/css/app.css`
- `npm run js`: compila JS con Webpack
- `npm run db:importar`: inserta datos iniciales
- `npm run db:eliminar`: elimina y recrea tablas

## Notas
- El proyecto usa plantillas Pug en `views/`.
- Los archivos subidos se guardan en `public/uploads/`.
- Para correos de prueba se recomienda Mailtrap.

