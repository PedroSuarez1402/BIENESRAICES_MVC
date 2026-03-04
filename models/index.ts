import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';
import Mensaje from './Mensaje.js';
import Rol from './Rol.js';
import Permiso from './Permiso.js';
import RolPermiso from './RolPermiso.js';

Propiedad.belongsTo(Precio, { foreignKey: 'precioId', as: 'precio' });
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId', as: 'mensajes' });

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Usuario.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rolId', as: 'usuarios' });

// 2. Relación Muchos a Muchos: Un Rol tiene Muchos Permisos, y viceversa
Rol.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'rolId', as: 'permisos' });
Permiso.belongsToMany(Rol, { through: RolPermiso, foreignKey: 'permisoId', as: 'roles' });

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario, 
    Mensaje,
    Rol,
    Permiso,
    RolPermiso
};