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

interface EstudianteData {
  id_estudiante: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  carrera: string;
  semestre: number;
  promedio: number;
  fecha_registro: string;
  estado: number;
}

interface AlertMessage {
  message: string;
  severity: AlertProps['severity'];
  open: boolean;
}

export default function ImportarEstudiantes() {

  const [estudiantes, setEstudiantes] = React.useState<EstudianteData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [alert, setAlert] = React.useState<AlertMessage>({
    message: '',
    severity: 'info',
    open: false
  });
  const [processingResults, setProcessingResults] = React.useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Función para mostrar alertas
  const showAlert = (message: string, severity: AlertProps['severity'] = 'info') => {
    setAlert({
      message,
      severity,
      open: true
    });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Obtener estudiantes desde la API
  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      console.log("Intentando conectar a:", `http://localhost:8000/estudiantes`);
      const response = await fetch(`http://localhost:8000/estudiantes`);
      
      console.log("Respuesta del servidor:", response);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Datos recibidos:", data);
      
      if (data.success) {
        setEstudiantes(data.data);
      } else {
        showAlert(`Error al cargar estudiantes: ${data.msg || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
      showAlert(`Error al cargar estudiantes: ${error instanceof Error ? error.message : 'Error de conexión'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  React.useEffect(() => {
    fetchEstudiantes();
  }, []);

  // Manejar la selección de archivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Verificar que sea un archivo Excel
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showAlert('Por favor, seleccione un archivo Excel válido (.xlsx o .xls)', 'error');
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

  // Descargar plantilla de Excel
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/estudiantes/plantilla-excel`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Crear un blob a partir de la respuesta
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal para la descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_estudiantes.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showAlert('Plantilla descargada correctamente', 'success');
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      showAlert(`Error al descargar plantilla: ${error instanceof Error ? error.message : 'Error de conexión'}`, 'error');
    }
  };

  // Función para exportar todos los estudiantes a Excel
  const handleExportAllStudents = async () => {
    try {
      // Mostrar indicador de carga
      setLoading(true);
      
      // Realizar la petición a la API
      const response = await fetch(`http://localhost:8000/estudiantes/exportar-excel`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Crear un blob a partir de la respuesta
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal para la descarga
      const a = document.createElement('a');
      a.href = url;
      const fechaActual = new Date().toISOString().split('T')[0];
      a.download = `estudiantes_${fechaActual}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
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

  // Manejar la apertura del modal de importación
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  // Manejar el cierre del modal de importación
  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  // Manejar la finalización de la importación
  const handleImportComplete = () => {
    fetchEstudiantes(); // Refrescar la lista de estudiantes
  };

  // Eliminar estudiante
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
      
      if (data.success) {
        fetchEstudiantes(); // Refrescar la lista
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

  // Actualizar estudiante
  const handleUpdateEstudiante = async (estudiante: any) => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/estudiantes/${estudiante.id_estudiante}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estudiante)
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        fetchEstudiantes(); // Refrescar la lista
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

  // Columnas para la tabla
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
      flex: 1 
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
      flex: 1.5 
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
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          Gestión de Estudiantes
        </Typography>

        {/* Acciones principales */}
        <Box sx={{ mb: 4 }}>
          <Stack direction={isMobile ? "column" : "row"} spacing={2}>
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

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        <DinamicTable
          rows={estudiantes}
          columns={columns}
          onDelete={handleDeleteEstudiante}
          onEdit={handleUpdateEstudiante}
        />
      </Box>

      {/* Modal para importar Excel */}
      <ModalImportarExcel
        open={isImportModalOpen}
        onClose={handleCloseImportModal}
        onImportComplete={handleImportComplete}
      />

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}