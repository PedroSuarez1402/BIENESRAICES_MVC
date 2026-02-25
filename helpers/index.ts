const esVendedor = (usuarioId: number | undefined, propiedadUsuarioId: number): boolean => {
    return usuarioId === propiedadUsuarioId;
}

const formatearFecha = (fecha: string | Date): string => {
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10);

    const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    };

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones);
}

export { esVendedor, formatearFecha };