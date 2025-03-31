import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  LinearProgress,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ImportResultsDisplay from '../ImportResultsDisplay';

// Definir el API base URL
const API_BASE_URL = 'http://localhost:8000';

// Interfaz para los resultados del procesamiento
interface ProcessingResults {
  success: boolean;
  msg?: string;
  message?: string;
  insertados?: number;
  totalProcesados?: number;
  errores?: Array<{
    estudiante: string;
    error: string;
  }>;
}

// Interfaz para las propiedades del modal
interface ModalImportarExcelProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const ModalImportarExcel: React.FC<ModalImportarExcelProps> = ({
  open,
  onClose,
  onImportComplete
}) => {
  // Estados
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [processingResults, setProcessingResults] = React.useState<ProcessingResults | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Resetear el modal cuando se abre
  React.useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setError(null);
      setUploadProgress(0);
      setProcessingResults(null);
    }
  }, [open]);

  // Manejar la selección de archivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setError(null);
    setProcessingResults(null);

    if (files && files.length > 0) {
      const file = files[0];

      console.log("Archivo seleccionado - Nombre:", file.name);
      console.log("Archivo seleccionado - Tipo:", file.type);
      console.log("Archivo seleccionado - Tamaño:", file.size);
      
      // Validar que sea un archivo Excel
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError('Solo se permiten archivos Excel (.xlsx, .xls)');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. El tamaño máximo permitido es 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  // Manejar clic en el botón de seleccionar archivo
  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Cancelar la selección de archivo
  const handleCancelSelection = () => {
    setSelectedFile(null);
    setProcessingResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Subir archivo Excel con monitoreo de progreso
  const handleUploadExcel = async () => {
    if (!selectedFile) {
      setError('Por favor, seleccione un archivo primero');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);
    setProcessingResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Crear un objeto XMLHttpRequest para monitorear el progreso
      const xhr = new XMLHttpRequest();

      // Configurar la promesa para la respuesta
      const uploadPromise = new Promise<ProcessingResults>((resolve, reject) => {
        xhr.open('POST', `${API_BASE_URL}/estudiantes/importar-excel`);

        // Evento para monitorear el progreso de la carga
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(percentComplete);
          }
        };

        // Eventos para manejar la respuesta
        xhr.onload = () => {
          console.log("Status de respuesta:", xhr.status);
          console.log("Respuesta completa:", xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log("Datos parseados:", data);
              resolve(data as ProcessingResults);
            } catch (error) {
              console.error("Error al parsear respuesta:", error);
              reject(new Error('Error al analizar la respuesta del servidor'));
            }
          } else {
            // Manejar diferentes códigos de error HTTP
            switch (xhr.status) {
              case 400:
                reject(new Error('Archivo con formato incorrecto'));
                break;
              case 413:
                reject(new Error('El archivo es demasiado grande'));
                break;
              case 500:
                reject(new Error('Error en el servidor'));
                break;
              default:
                reject(new Error(`Error HTTP: ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error('Error de red al intentar conectar con el servidor'));
        };

        xhr.ontimeout = () => {
          reject(new Error('Tiempo de espera agotado. Compruebe su conexión'));
        };

        // Enviar la solicitud
        xhr.send(formData);
      });

      // Esperar la respuesta
      const data = await uploadPromise;

      // Establecer progreso completo
      setUploadProgress(100);
      setProcessingResults(data);

      // Procesar resultado
      if (data.success) {
        setTimeout(() => {
          onImportComplete(); // Notificar que la importación se ha completado
        }, 2000); // Darle tiempo al usuario para ver el resultado
      } else {
        setError(`Error al procesar archivo: ${data.msg || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setError(`${error instanceof Error ? error.message : 'Error de conexión con el servidor'}`);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Vista previa del archivo seleccionado
  const FilePreview = ({ file }: { file: File }) => {
    return (
      <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
        <Typography variant="subtitle1" gutterBottom>
          Información del archivo:
        </Typography>
        <Typography variant="body2">
          <strong>Nombre:</strong> {file.name}
        </Typography>
        <Typography variant="body2">
          <strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB
        </Typography>
        <Typography variant="body2">
          <strong>Tipo:</strong> {file.type || 'Archivo Excel'}
        </Typography>
      </Paper>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={processingResults?.success ? onImportComplete : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="modal-subir-excel-title"
    >
      <DialogTitle id="modal-subir-excel-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Subir Archivo Excel</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!processingResults && (
          <Box sx={{ py: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <Box
              sx={{
                p: 3,
                border: '2px dashed #ccc',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'background.default',
                mb: 2,
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
              onClick={handleSelectFileClick}
            >
              {selectedFile ? (
                <Box>
                  <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UploadFileIcon color="primary" sx={{ mr: 1 }} />
                    <strong>Archivo seleccionado:</strong> {selectedFile.name}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1">
                    Haz clic para seleccionar un archivo Excel o arrástralo aquí
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Solo se permiten archivos Excel (.xlsx, .xls)
                  </Typography>
                </Box>
              )}
            </Box>

            {selectedFile && (
              <>
                <FilePreview file={selectedFile} />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FileUploadIcon />}
                    onClick={handleUploadExcel}
                    disabled={uploading}
                  >
                    {uploading ? 'Subiendo...' : 'Subir Archivo'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleCancelSelection}
                    disabled={uploading}
                  >
                    Cancelar
                  </Button>
                </Box>
              </>
            )}

            {uploading && (
              <Box sx={{ mt: 3, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {uploadProgress === 100 ? 'Procesando datos...' : `Subiendo: ${uploadProgress.toFixed(0)}%`}
                  </Typography>
                  {uploading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  color={uploadProgress === 100 ? "success" : "primary"}
                />
              </Box>
            )}
          </Box>
        )}

        {processingResults && (
          <ImportResultsDisplay results={processingResults} />
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        {processingResults?.success ? (
          <Button
            onClick={onImportComplete}
            variant="contained"
            color="primary"
          >
            Completar
          </Button>
        ) : (
          <>
            <Button
              onClick={onClose}
              color="inherit"
              disabled={uploading}
            >
              Cancelar
            </Button>
            {selectedFile && !processingResults && (
              <Button
                onClick={handleUploadExcel}
                variant="contained"
                color="primary"
                startIcon={uploading ? <CircularProgress size={20} /> : <FileUploadIcon />}
                disabled={uploading}
              >
                {uploading ? 'Subiendo...' : 'Subir Archivo'}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalImportarExcel;