interface RolPermisoSeed {
    rolId: number;
    permisoId: number;
}

const rolesPermisos: RolPermisoSeed[] = [
    // --- Permisos del ADMIN (Tiene todos) ---
    { rolId: 1, permisoId: 1 },
    { rolId: 1, permisoId: 2 },
    { rolId: 1, permisoId: 3 },
    { rolId: 1, permisoId: 4 },
    { rolId: 1, permisoId: 5 },
    { rolId: 1, permisoId: 6 },

    // --- Permisos del ASESOR/VENDEDOR ---
    { rolId: 2, permisoId: 1 },
    { rolId: 2, permisoId: 2 },
    { rolId: 2, permisoId: 3 },
    { rolId: 2, permisoId: 4 },

    // --- Permisos del CLIENTE/COMPRADOR ---
    { rolId: 3, permisoId: 5 }
];

export default rolesPermisos;