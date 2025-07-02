/**
 * Validates an Excel file to ensure it meets security and format requirements
 * Performs comprehensive checks on file type, extension, and size
 * 
 * @param file - The File object to validate
 * @returns Object containing validation result and any error messages
 */
export const validarArchivoExcel = (file: File): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];
  
  /**
   * Array of acceptable MIME types for Excel files
   * Includes various formats that different browsers might send:
   * - application/vnd.ms-excel: Legacy Excel format (.xls)
   * - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet: Modern Excel (.xlsx)
   * - application/octet-stream: Generic binary format (fallback)
   * - application/zip: Some browsers detect .xlsx as ZIP files
   * - '': Empty string for browsers that don't set MIME type
   */
  const tiposPermitidos = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
    'application/zip', // Some browsers send XLSX files as ZIP
    '', // Some browsers may not send any type
  ];
  
  // Debug logging to help troubleshoot file validation issues
  console.log("Validando archivo Excel - Nombre:", file.name);
  console.log("Validando archivo Excel - Tipo:", file.type);
  console.log("Tipos permitidos:", tiposPermitidos);
  console.log("Extensión válida:", file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls'));
  
  /**
   * File type and extension validation
   * Uses a two-pronged approach for maximum compatibility:
   * 1. Check MIME type against allowed types
   * 2. Check file extension as fallback (more reliable than MIME type)
   */
  if (!tiposPermitidos.includes(file.type) && 
      !file.name.toLowerCase().endsWith('.xlsx') && 
      !file.name.toLowerCase().endsWith('.xls')) {
    errores.push('El archivo seleccionado no es un archivo Excel válido (.xlsx o .xls)');
  }
  
  /**
   * File size validation
   * Enforces a 5MB maximum to prevent:
   * - Server overload
   * - Memory issues during processing
   * - Poor user experience with large uploads
   */
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  
  if (file.size > maxSize) {
    errores.push(`El archivo excede el tamaño máximo permitido (5 MB). Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
  }
  
  // Return validation result with detailed error information
  return {
    valido: errores.length === 0,  // Valid if no errors found
    errores: errores               // Array of error messages for display
  };
};

/**
 * Generates preview information for an Excel file
 * Extracts and formats file metadata for user display
 * 
 * @param file - The File object to preview
 * @param callback - Function to handle the preview data
 */
export const mostrarPrevisualizacionExcel = (
  file: File, 
  callback: (previewData: { 
    nombre: string; 
    tamaño: string; 
    tipo: string; 
    ultimaModificacion: string 
  }) => void
): void => {
  /**
   * Process file metadata and format for display
   * Converts raw file properties into user-friendly strings
   */
  callback({
    nombre: file.name,                                           // Original filename
    tamaño: `${(file.size / 1024).toFixed(2)} KB`,              // Size converted to KB with 2 decimals
    tipo: file.type,                                            // MIME type (may be empty)
    ultimaModificacion: new Date(file.lastModified).toLocaleString()  // Formatted last modified date
  });
};