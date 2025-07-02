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

// Base URL for API endpoints - centralized configuration for easy environment changes
const API_BASE_URL = 'http://localhost:8000';

// Interface defining the structure of processing results from the server
// This represents the response after uploading and processing an Excel file
interface ProcessingResults {
  success: boolean;           // Overall operation success status
  msg?: string;              // Error message (alternative naming)
  message?: string;          // Success/info message (alternative naming)
  insertados?: number;       // Number of records successfully inserted
  totalProcesados?: number;  // Total number of records processed
  errores?: Array<{          // Array of specific processing errors
    estudiante: string;      // Student identifier that failed
    error: string;           // Description of the specific error
  }>;
}

// Interface defining the props for the Excel import modal component
interface ModalImportarExcelProps {
  open: boolean;                    // Controls modal visibility
  onClose: () => void;             // Callback when modal is closed
  onImportComplete: () => void;    // Callback when import process is successfully completed
}

// Main component for handling Excel file import with progress tracking and error handling
const ModalImportarExcel: React.FC<ModalImportarExcelProps> = ({
  open,
  onClose,
  onImportComplete
}) => {
  // State management for upload progress tracking (0-100 percentage)
  const [uploadProgress, setUploadProgress] = React.useState(0);
  
  // State to store the currently selected file for upload
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
  // State to track whether an upload operation is currently in progress
  const [uploading, setUploading] = React.useState(false);
  
  // State for storing and displaying error messages to the user
  const [error, setError] = React.useState<string | null>(null);
  
  // State to store the results after processing the uploaded file
  const [processingResults, setProcessingResults] = React.useState<ProcessingResults | null>(null);
  
  // Reference to the hidden file input element for programmatic file selection
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Effect hook to reset modal state when it opens
   * Ensures clean state for each new import operation
   */
  React.useEffect(() => {
    if (open) {
      setSelectedFile(null);        // Clear any previously selected file
      setError(null);               // Clear any previous error messages
      setUploadProgress(0);         // Reset progress to zero
      setProcessingResults(null);   // Clear any previous processing results
    }
  }, [open]);

  /**
   * Handles file selection from the file input element
   * Validates file type and size before accepting the selection
   * @param event - Change event from the file input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setError(null);                 // Clear any previous errors
    setProcessingResults(null);     // Clear previous results

    if (files && files.length > 0) {
      const file = files[0];

      // Log file information for debugging purposes
      console.log("Archivo seleccionado - Nombre:", file.name);
      console.log("Archivo seleccionado - Tipo:", file.type);
      console.log("Archivo seleccionado - Tamaño:", file.size);
      
      // Validate file extension - only Excel files are allowed
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError('Solo se permiten archivos Excel (.xlsx, .xls)');
        return;
      }

      // Validate file size - maximum 5MB to prevent server overload
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. El tamaño máximo permitido es 5MB');
        return;
      }

      // File passes validation - store it in state
      setSelectedFile(file);
    }
  };

  /**
   * Programmatically triggers the file input dialog
   * Called when user clicks on the drop zone area
   */
  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Cancels the current file selection and resets related state
   * Allows user to start over with file selection
   */
  const handleCancelSelection = () => {
    setSelectedFile(null);          // Remove selected file
    setProcessingResults(null);     // Clear any results
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input value
    }
  };

  /**
   * Handles the Excel file upload process with real-time progress tracking
   * Uses XMLHttpRequest for progress monitoring and FormData for file upload
   * Manages all aspects of the upload lifecycle including error handling
   */
  const handleUploadExcel = async () => {
    // Validate that a file has been selected before proceeding
    if (!selectedFile) {
      setError('Por favor, seleccione un archivo primero');
      return;
    }

    // Initialize upload state
    setUploading(true);             // Set uploading flag to show progress UI
    setError(null);                 // Clear any previous errors
    setUploadProgress(0);           // Reset progress counter
    setProcessingResults(null);     // Clear previous results

    try {
      // Prepare form data for multipart file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Create XMLHttpRequest for advanced progress tracking capabilities
      const xhr = new XMLHttpRequest();

      // Create a Promise wrapper around XMLHttpRequest for async/await syntax
      const uploadPromise = new Promise<ProcessingResults>((resolve, reject) => {
        // Configure the HTTP request
        xhr.open('POST', `${API_BASE_URL}/estudiantes/importar-excel`);

        /**
         * Progress event handler for upload progress tracking
         * Updates the progress bar in real-time as file uploads
         */
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(percentComplete);
          }
        };

        /**
         * Success/Error response handler
         * Processes the server response and handles various HTTP status codes
         */
        xhr.onload = () => {
          console.log("Status de respuesta:", xhr.status);
          console.log("Respuesta completa:", xhr.responseText);
          
          // Check if request was successful (2xx status codes)
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              // Parse JSON response from server
              const data = JSON.parse(xhr.responseText);
              console.log("Datos parseados:", data);
              resolve(data as ProcessingResults);
            } catch (error) {
              console.error("Error al parsear respuesta:", error);
              reject(new Error('Error al analizar la respuesta del servidor'));
            }
          } else {
            // Handle different HTTP error status codes with specific messages
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

        /**
         * Network error handler
         * Handles cases where the request couldn't be completed due to network issues
         */
        xhr.onerror = () => {
          reject(new Error('Error de red al intentar conectar con el servidor'));
        };

        /**
         * Timeout error handler
         * Handles cases where the request takes too long to complete
         */
        xhr.ontimeout = () => {
          reject(new Error('Tiempo de espera agotado. Compruebe su conexión'));
        };

        // Send the actual HTTP request with the form data
        xhr.send(formData);
      });

      // Wait for the upload to complete and get the response
      const data = await uploadPromise;

      // Set progress to 100% when upload completes
      setUploadProgress(100);
      setProcessingResults(data);

      // Process the server response
      if (data.success) {
        // If successful, notify parent component after a brief delay
        // The delay allows user to see the success message
        setTimeout(() => {
          onImportComplete(); // Trigger parent's import completion callback
        }, 2000);
      } else {
        // If processing failed, show the error message from server
        setError(`Error al procesar archivo: ${data.msg || 'Error desconocido'}`);
      }
    } catch (error) {
      // Handle any errors that occurred during the upload process
      console.error('Error al subir archivo:', error);
      setError(`${error instanceof Error ? error.message : 'Error de conexión con el servidor'}`);
      setUploadProgress(0); // Reset progress on error
    } finally {
      // Always reset uploading state when operation completes (success or failure)
      setUploading(false);
    }
  };

  /**
   * Component for displaying file information preview
   * Shows file details before upload to confirm selection
   * @param file - The selected file object
   */
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
      onClose={processingResults?.success ? onImportComplete : onClose} // Smart close behavior based on success state
      maxWidth="sm"
      fullWidth
      aria-labelledby="modal-subir-excel-title"
    >
      {/* Modal Header with title and close button */}
      <DialogTitle id="modal-subir-excel-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Subir Archivo Excel</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Main modal content area */}
      <DialogContent>
        {/* Error message display - only shown when there's an error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* File selection and upload interface - hidden when showing results */}
        {!processingResults && (
          <Box sx={{ py: 3 }}>
            {/* Hidden file input element - triggered programmatically */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* File drop zone and selection area */}
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
              {/* Conditional display based on whether a file is selected */}
              {selectedFile ? (
                // Show selected file information
                <Box>
                  <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UploadFileIcon color="primary" sx={{ mr: 1 }} />
                    <strong>Archivo seleccionado:</strong> {selectedFile.name}
                  </Typography>
                </Box>
              ) : (
                // Show file selection prompt
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

            {/* File preview and action buttons - only shown when file is selected */}
            {selectedFile && (
              <>
                {/* Display file information preview */}
                <FilePreview file={selectedFile} />

                {/* Action buttons for upload and cancel */}
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

            {/* Upload progress indicator - only shown during upload */}
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

        {/* Results display component - only shown after processing completes */}
        {processingResults && (
          <ImportResultsDisplay results={processingResults} />
        )}
      </DialogContent>

      <Divider />

      {/* Modal footer with action buttons */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        {/* Conditional button display based on processing state */}
        {processingResults?.success ? (
          // Show completion button when import was successful
          <Button
            onClick={onImportComplete}
            variant="contained"
            color="primary"
          >
            Completar
          </Button>
        ) : (
          // Show cancel and upload buttons during file selection/upload
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