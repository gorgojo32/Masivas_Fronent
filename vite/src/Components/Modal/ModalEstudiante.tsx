import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

// Interfaz para el estudiante
interface Estudiante {
  id_estudiante: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  carrera: string;
  semestre: number;
  promedio: number;
  estado?: number;
  fecha_registro?: string;
}

// Interfaz para las propiedades del modal
interface ModalEdicionEstudianteProps {
  open: boolean;
  onClose: () => void;
  estudiante: Estudiante | null;
  onGuardar: (estudiante: Estudiante) => void;
  carreras?: Array<{
    id_carrera?: number;
    nombre?: string;
  }>;
  loading?: boolean;
}

const ModalEdicionEstudiante: React.FC<ModalEdicionEstudianteProps> = ({
  open,
  onClose,
  estudiante,
  onGuardar,
  carreras = [],
  loading = false
}) => {
  // Estado inicial del formulario
  const initialForm: Estudiante = {
    id_estudiante: 0,
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    carrera: '',
    semestre: 1,
    promedio: 0,
    estado: 1
  };

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = React.useState<Estudiante>(initialForm);
  
  // Estado para manejar errores de validación
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Actualizar el formulario cuando se recibe un estudiante
  React.useEffect(() => {
    if (open && estudiante) {
      setFormData({
        ...estudiante
      });
      setErrors({});
    }
  }, [open, estudiante]);

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Limpiar error cuando el usuario cambia el valor
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  // Validar el formulario antes de guardar
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }
    
    // Validar carrera
    if (!formData.carrera) {
      newErrors.carrera = 'La carrera es obligatoria';
    }
    
    // Validar semestre
    if (formData.semestre < 1 || formData.semestre > 12) {
      newErrors.semestre = 'El semestre debe estar entre 1 y 12';
    }
    
    // Validar promedio
    if (formData.promedio < 0 || formData.promedio > 10) {
      newErrors.promedio = 'El promedio debe estar entre 0 y 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onGuardar(formData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="modal-edicion-estudiante-title"
    >
      <DialogTitle id="modal-edicion-estudiante-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Editar Estudiante</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Box my={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Modifique los datos del estudiante según sea necesario.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Información Personal */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium">
              Información Personal
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              label="Nombre"
              fullWidth
              variant="outlined"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="apellido"
              label="Apellido"
              fullWidth
              variant="outlined"
              value={formData.apellido}
              onChange={handleChange}
              error={!!errors.apellido}
              helperText={errors.apellido}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="telefono"
              label="Teléfono"
              fullWidth
              variant="outlined"
              value={formData.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono}
              required
            />
          </Grid>
          
          {/* Información Académica */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Información Académica
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={12}>
            <FormControl fullWidth error={!!errors.carrera} required>
              <InputLabel id="carrera-label">Carrera</InputLabel>
              <Select
                labelId="carrera-label"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                label="Carrera"
              >
                {carreras.length > 0 ? (
                  carreras.map((carrera) => (
                    <MenuItem 
                      key={carrera.id_carrera || carrera.nombre} 
                      value={carrera.nombre}
                    >
                      {carrera.nombre}
                    </MenuItem>
                  ))
                ) : (
                  [
                    "Ingeniería Informática",
                    "Ingeniería Civil",
                    "Medicina",
                    "Derecho",
                    "Administración de Empresas",
                    "Psicología",
                    "Arquitectura"
                  ].map((nombre) => (
                    <MenuItem key={nombre} value={nombre}>
                      {nombre}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.carrera && <FormHelperText>{errors.carrera}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="semestre"
              label="Semestre"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.semestre}
              onChange={handleChange}
              error={!!errors.semestre}
              helperText={errors.semestre}
              InputProps={{ inputProps: { min: 1, max: 12 } }}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="promedio"
              label="Promedio"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.promedio}
              onChange={handleChange}
              error={!!errors.promedio}
              helperText={errors.promedio}
              InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicionEstudiante;