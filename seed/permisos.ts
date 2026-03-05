interface PermisoSeed {
    nombre: string;
    descripcion: string;
}

const permisos: PermisoSeed[] = [
    { nombre: 'crear_propiedad', descripcion: 'Puede crear nuevas propiedades' },            // ID: 1
    { nombre: 'editar_propiedad', descripcion: 'Puede editar sus propiedades' },             // ID: 2
    { nombre: 'eliminar_propiedad', descripcion: 'Puede eliminar sus propiedades' },         // ID: 3
    { nombre: 'ver_mensajes', descripcion: 'Puede leer mensajes de sus propiedades' },       // ID: 4
    { nombre: 'enviar_mensajes', descripcion: 'Puede contactar a los vendedores' },          // ID: 5
    { nombre: 'administrar_usuarios', descripcion: 'Puede ver y eliminar a otros usuarios' } // ID: 6
];

export default permisos;