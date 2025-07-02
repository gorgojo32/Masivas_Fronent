import * as React from 'react';
import { 
  Button, 
  Grid, 
  CircularProgress, 
  Typography, 
  Container, 
  Box, 
  Snackbar, 
  Alert, 
  AlertProps, 
  useTheme,
  useMediaQuery,
  Paper,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  LinearProgress,
  Tooltip,
  Stack
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DinamicTable from '../Components/DinamicTableEstudiantes';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import UploadIcon from '@mui/icons-material/Upload';
import ModalImportarExcel from '../Components/Modal/ModalExel';

// Interface defining the structure of student data from the API
// Represents a complete student record with all database fields
interface EstudianteData {
  id_estudiante: number;        // Unique identifier for the student
  nombre: string;               // Student's first name
  apellido: string;             // Student's last name
  email: string;                // Student's email address
  telefono: string;             // Student's phone number
  carrera: string;              // Student's major/career field
  semestre: number;             // Current semester (1-12)
  promedio: number;             // Student's GPA/average grade
  fecha_registro: string;       // Registration date (ISO string)
  estado: number;               // Student status (1=active, 0=inactive)
}

// Interface for managing alert/notification messages
// Controls the display of success, error, and info messages to users
interface AlertMessage {
  message: string;                    // Text content of the alert
  severity: AlertProps['severity'];   // Type of alert (success, error, warning, info)
  open: boolean;                     // Controls alert visibility
}

/**
 * Main component for student management
 * Provides comprehensive CRUD operations, Excel import/export, and data visualization
 * Handles all student-related operations including API communication and UI state
 */
export default function ImportarEstudiantes() {

  // State management for component data and UI
  const [estudiantes, setEstudiantes] = React.useState<EstudianteData[]>([]);  // Array of student records
  const [loading, setLoading] = React.useState<boolean>(false);                // General loading state
  const [uploading, setUploading] = React.useState<boolean>(false);            // Upload-specific loading state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);   // Currently selected Excel file
  const [alert, setAlert] = React.useState<AlertMessage>({                     // Alert message state
    message: '',
    severity: 'info',
    open: false
  });
  const [processingResults, setProcessingResults] = React.useState<any>(null); // Results from import operations
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);     // Import modal visibility
  
  // Theme and responsive design hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // Detect mobile screens
  const fileInputRef = React.useRef<HTMLInputElement>(null);     // Reference to hidden file input

  /**
   * Utility function to display alert messages to users
   * Centralizes alert management for consistent user feedback
   * @param message - Text to display in the alert
   * @param severity - Type of alert (success, error, warning, info)
   */
  const showAlert = (message: string, severity: AlertProps['severity'] = 'info') => {
    setAlert({
      message,
      severity,
      open: true
    });
  };

  /**
   * Closes the currently displayed alert
   * Hides the alert by setting open to false
   */
  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  /**
   * Fetches student data from the API
   * Handles loading states, error management, and data processing
   * Called on component mount and after data modifications
   */
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      console.log("Intentando conectar a:", `http://localhost:8000/estudiantes`);
      const response = await fetch(`http://localhost:8000/estudiantes`);
      
      console.log("Respuesta del servidor:", response);
      
      // Check if HTTP request was successful
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Datos recibidos:", data);
      
      // Process API response based on success flag
      if (data.success) {
        setEstudiantes(data.data);  // Update state with student array
      } else {
        showAlert(`Error al cargar estudiantes: ${data.msg || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
      showAlert(`Error al cargar estudiantes: ${error instanceof Error ? error.message : 'Error de conexión'}`, 'error');
    } finally {
      setLoading(false);  // Always clear loading state
    }
  };

  /**
   * Effect hook to load initial data when component mounts
   * Ensures student data is available immediately when page loads
   */
  React.useEffect(() => {
    fetchEstudiantes();
  }, []);

  /**
   * Handles file selection from file input
   * Validates file type before accepting the selection
   * @param event - Change event from the file input element
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file extension - only Excel files allowed
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showAlert('Por favor, seleccione un archivo Excel válido (.xlsx o .xls)', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  /**
   * Programmatically triggers the file input dialog
   * Provides a custom UI while using the native file picker
   */
  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Downloads an Excel template for student data import
   * Provides users with a properly formatted template to fill out
   * Handles file download using blob and temporary URL creation
   */
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/estudiantes/plantilla-excel`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Create blob from response for file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary download link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_estudiantes.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up temporary objects and DOM elements
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showAlert('Plantilla descargada correctamente', 'success');
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      showAlert(`Error al descargar plantilla: ${error instanceof Error ? error.message : 'Error de conexión'}`, 'error');
    }
  };

  /**
   * Exports all current student data to an Excel file
   * Generates a downloadable Excel file with current timestamp
   * Useful for backups, reports, and data analysis
   */
  const handleExportAllStudents = async () => {
    try {
      setLoading(true);  // Show loading indicator during export
      
      // Request Excel export from API
      const response = await fetch(`http://localhost:8000/estudiantes/exportar-excel`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Process response as downloadable file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create download with timestamp in filename
      const a = document.createElement('a');
      a.href = url;
      const fechaActual = new Date().toISOString().split('T')[0];  // YYYY-MM-DD format
      a.download = `estudiantes_${fechaActual}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up resources
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showAlert('Lista de estudiantes exportada correctamente', 'success');
    } catch (error) {
      console.error('Error al exportar estudiantes:', error);
      showAlert(`Error al exportar estudiantes: ${error instanceof Error ? error.message : 'Error de conexión'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the Excel import modal
   * Triggers the import workflow for uploading student data
   */
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  /**
   * Closes the Excel import modal
   * Hides the import dialog without performing any actions
   */
  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  /**
   * Handles completion of the import process
   * Refreshes the student list to show newly imported data
   * Called after successful import operations
   */
  const handleImportComplete = () => {
    fetchEstudiantes(); // Refresh the student list with new data
  };

  /**
   * Deletes a student record from the database
   * Sends DELETE request to API and refreshes the list on success
   * @param id - Unique identifier of the student to delete
   */
  const handleDeleteEstudiante = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/estudiantes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process deletion result
      if (data.success) {
        fetchEstudiantes(); // Refresh the list to remove deleted student
        showAlert("Estudiante eliminado correctamente", "success");
      } else {
        showAlert(`Error: ${data.msg || 'Error desconocido'}`, "error");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      showAlert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an existing student record in the database
   * Sends PUT request with updated student data
   * @param estudiante - Student object with updated information
   */
  const handleUpdateEstudiante = async (estudiante: any) => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/estudiantes/${estudiante.id_estudiante}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estudiante)  // Send updated student data as JSON
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process update result
      if (data.success) {
        fetchEstudiantes(); // Refresh list to show updated data
        showAlert("Estudiante actualizado correctamente", "success");
      } else {
        showAlert(`Error: ${data.msg || 'Error desconocido'}`, "error");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      showAlert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Column definitions for the data grid
   * Defines how each student field should be displayed in the table
   * Includes formatting, alignment, and responsive sizing
   */
  const columns: GridColDef[] = [
    { 
      field: "id_estudiante", 
      headerName: "ID", 
      width: 70,
      align: 'center',
      headerAlign: 'center' 
    },
    { 
      field: "nombre", 
      headerName: "Nombre", 
      width: 150,
      flex: 1  // Responsive width based on available space
    },
    { 
      field: "apellido", 
      headerName: "Apellido", 
      width: 150,
      flex: 1 
    },
    { 
      field: "email", 
      headerName: "Email", 
      width: 200,
      flex: 1.5  // Takes more space due to longer content
    },
    { 
      field: "telefono", 
      headerName: "Teléfono", 
      width: 120,
      flex: 0.8 
    },
    { 
      field: "carrera", 
      headerName: "Carrera", 
      width: 200,
      flex: 1.5 
    },
    { 
      field: "semestre", 
      headerName: "Semestre", 
      width: 90,
      align: 'center',
      headerAlign: 'center',
      type: 'number' 
    },
    { 
      field: "promedio", 
      headerName: "Promedio", 
      width: 90,
      align: 'center',
      headerAlign: 'center',
      type: 'number',
      // Custom formatter for GPA display - shows 2 decimal places or N/A
      valueFormatter: (params: { value: number; }) => {
        return params.value !== undefined && params.value !== null 
          ? params.value.toFixed(2) 
          : 'N/A';  
      }
    },
    { 
      field: "fecha_registro", 
      headerName: "Fecha Registro", 
      width: 80,
      // Custom formatter for date display - converts ISO string to localized format
      valueFormatter: (params: { value: string | number | Date; }) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleString();
      }
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        {/* Page Header */}
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textAlign: isMobile ? 'center' : 'left'  // Responsive text alignment
          }}
        >
          Gestión de Estudiantes
        </Typography>

        {/* Main Action Buttons - Import and Export */}
        <Box sx={{ mb: 4 }}>
          <Stack direction={isMobile ? "column" : "row"} spacing={2}>
            {/* Excel Import Button */}
            <Tooltip title="Importar estudiantes desde Excel">
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={handleOpenImportModal}
              >
                Importar Excel
              </Button>
            </Tooltip>
            
            {/* Excel Export Button - disabled when no data or loading */}
            <Tooltip title="Exportar todos los estudiantes a Excel">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleExportAllStudents}
                disabled={loading || estudiantes.length === 0}
              >
                Exportar Todos
              </Button>
            </Tooltip>
          </Stack>
        </Box>

        {/* Section Header for Student List */}
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            mt: 4,
            mb: 2 
          }}
        >
          Lista de Estudiantes
        </Typography>

        {/* Loading Indicator - shown during data operations */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Main Data Table Component */}
        <DinamicTable
          rows={estudiantes}                    // Student data array
          columns={columns}                     // Column definitions
          onDelete={handleDeleteEstudiante}     // Delete callback
          onEdit={handleUpdateEstudiante}       // Edit callback
        />
      </Box>

      {/* Excel Import Modal - conditionally rendered */}
      <ModalImportarExcel
        open={isImportModalOpen}
        onClose={handleCloseImportModal}
        onImportComplete={handleImportComplete}
      />

      {/* Global Alert/Notification System */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000}               // Auto-hide after 6 seconds
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}  // Position at bottom center
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}            // Dynamic alert type
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}