

export const validarArchivoExcel = (file: File): { valido: boolean; errores: string[] } => {
    
    const errores: string[] = [];
   
    const tiposPermitidos = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream',
      'application/zip', // Algunos navegadores envían XLSX como ZIP
      '', // Algunos navegadores pueden no enviar tipo
    ];
    console.log("Validando archivo Excel - Nombre:", file.name);
    console.log("Validando archivo Excel - Tipo:", file.type);
    console.log("Tipos permitidos:", tiposPermitidos);
    console.log("Extensión válida:", file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls'));
    
    if (!tiposPermitidos.includes(file.type) && 
        !file.name.toLowerCase().endsWith('.xlsx') && 
        !file.name.toLowerCase().endsWith('.xls')) {
      errores.push('El archivo seleccionado no es un archivo Excel válido (.xlsx o .xls)');
    }
    
    // 2. Comprobar tamaño
    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      errores.push(`El archivo excede el tamaño máximo permitido (5 MB). Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
    
    return {
      valido: errores.length === 0,
      errores: errores
    };
  };
  

  export const mostrarPrevisualizacionExcel = (
    file: File, 
    callback: (previewData: { nombre: string; tamaño: string; tipo: string; ultimaModificacion: string }) => void
  ): void => {
    callback({
      nombre: file.name,
      tamaño: `${(file.size / 1024).toFixed(2)} KB`,
      tipo: file.type,
      ultimaModificacion: new Date(file.lastModified).toLocaleString()
    });
  };