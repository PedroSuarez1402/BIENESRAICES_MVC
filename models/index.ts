import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';
import Mensaje from './Mensaje.js';

Propiedad.belongsTo(Precio, { foreignKey: 'precioId', as: 'precio' });
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId', as: 'mensajes' });

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario, 
    Mensaje
};