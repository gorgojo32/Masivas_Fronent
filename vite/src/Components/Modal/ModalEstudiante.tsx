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

// Interface defining the structure of a student entity
// Contains all the fields that can be edited in the form
interface Estudiante {
  id_estudiante: number;        // Unique identifier for the student
  nombre: string;               // Student's first name
  apellido: string;             // Student's last name
  email: string;                // Student's email address
  telefono: string;             // Student's phone number
  carrera: string;              // Student's major/career field
  semestre: number;             // Current semester (1-12)
  promedio: number | string;    // GPA/average grade (can be empty string initially)
  estado?: number;              // Optional status field (active/inactive)
  fecha_registro?: string;      // Optional registration date
}

// Interface defining the props for the student editing modal component
interface ModalEdicionEstudianteProps {
  open: boolean;                          // Controls modal visibility
  onClose: () => void;                   // Callback when modal is closed
  estudiante: Estudiante | null;         // Student data to edit (null when creating new)
  onGuardar: (estudiante: Estudiante) => void;  // Callback when saving student data
  carreras?: Array<{                     // Optional array of available career options
    id_carrera?: number;
    nombre?: string;
  }>;
  loading?: boolean;                     // Optional loading state for save operation
}

// Main modal component for editing student information
// Provides a comprehensive form with validation for all student fields
const ModalEdicionEstudiante: React.FC<ModalEdicionEstudianteProps> = ({
  open,
  onClose,
  estudiante,
  onGuardar,
  carreras = [],      // Default empty array if no careers provided
  loading = false     // Default to not loading
}) => {
  
  /**
   * Initial form state structure
   * Defines default values for all form fields when creating a new student
   */
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

  // State to manage the form data throughout the editing process
  const [formData, setFormData] = React.useState<Estudiante>(initialForm);

  // State to manage validation errors for each form field
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  /**
   * Effect hook to populate form when modal opens with student data
   * Handles the case where promedio might be null and converts it to empty string
   * Also clears any previous validation errors
   */
  React.useEffect(() => {
    if (open && estudiante) {
      setFormData({
        ...estudiante,
        // Handle null promedio by converting to empty string for display
        promedio: estudiante.promedio === null ? '' : estudiante.promedio
      });
      setErrors({}); // Clear any previous validation errors
    }
  }, [open, estudiante]);

  /**
   * Handles form field changes for both regular inputs and select dropdowns
   * Processes different field types appropriately (numbers, strings, etc.)
   * @param e - Change event from input or select element
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    
    if (name) {
      let processedValue: any = value;

      // Special processing for numeric fields
      if (name === 'semestre') {
        // Convert semester to integer, default to 1 if invalid
        processedValue = parseInt(value as string, 10) || 1;
      } else if (name === 'promedio') {
        // Allow empty string for promedio, otherwise convert to float
        // This enables users to clear the field and enter new values
        processedValue = value === '' ? '' : parseFloat(value as string);
      }

      // Update form data with processed value
      setFormData({
        ...formData,
        [name]: processedValue
      });

      // Clear any existing error for this field when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  /**
   * Comprehensive form validation function
   * Validates all required fields and applies business rules
   * @returns boolean indicating whether the form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate nombre (first name) - required field
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    // Validate apellido (last name) - required field
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    // Validate email - required field with format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validate telefono (phone) - required field
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    // Validate carrera (career/major) - required field
    if (!formData.carrera || formData.carrera.trim() === '') {
      newErrors.carrera = 'La carrera es obligatoria';
    }

    // Validate semestre (semester) - must be between 1 and 12
    if (formData.semestre < 1 || formData.semestre > 12) {
      newErrors.semestre = 'El semestre debe estar entre 1 y 12';
    }

    // Validate promedio (GPA) - optional but if provided must be 0-10
    if (formData.promedio !== '' && formData.promedio !== null) {
      const promedioNum = typeof formData.promedio === 'string' ? parseFloat(formData.promedio) : formData.promedio;
      if (isNaN(promedioNum) || promedioNum < 0 || promedioNum > 10) {
        newErrors.promedio = 'El promedio debe estar entre 0 y 10';
      }
    }

    // Update errors state and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * Validates the form first, then calls the save callback if valid
   */
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
      {/* Modal Header with title and close button */}
      <DialogTitle id="modal-edicion-estudiante-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Editar Estudiante</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Main form content area */}
      <DialogContent>
        {/* Instructions for the user */}
        <Box my={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Modifique los datos del estudiante según sea necesario.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Personal Information Section Header */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium">
              Información Personal
            </Typography>
          </Grid>

          {/* First Name Input Field */}
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              label="Nombre"
              fullWidth
              variant="outlined"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}        // Show error state if validation failed
              helperText={errors.nombre}     // Display error message
              required
            />
          </Grid>

          {/* Last Name Input Field */}
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

          {/* Email Input Field with email type for better mobile keyboards */}
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

          {/* Phone Number Input Field */}
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

          {/* Academic Information Section Header */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Información Académica
            </Typography>
          </Grid>

          {/* Career/Major Selection Dropdown */}
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
                {/* Dynamic career options from props or fallback to hardcoded list */}
                {carreras.length > 0 ? (
                  // Use provided careers array if available
                  carreras.map((carrera) => (
                    <MenuItem
                      key={carrera.id_carrera || carrera.nombre}
                      value={carrera.nombre}
                    >
                      {carrera.nombre}
                    </MenuItem>
                  ))
                ) : (
                  // Fallback to hardcoded career options if no careers provided
                  [
                    "Ingeniería en Sistemas Computacionales",
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
              {/* Display error message for career field if validation failed */}
              {errors.carrera && (
                <FormHelperText>{errors.carrera}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Semester Input Field - numeric with constraints */}
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
              InputProps={{ inputProps: { min: 1, max: 12 } }} // HTML5 validation constraints
              required
            />
          </Grid>

          {/* GPA/Average Input Field - allows decimal values */}
          <Grid item xs={12} md={6}>
            <TextField
              name="promedio"
              label="Promedio"
              type="number"
              fullWidth
              variant="outlined"
              // Handle null values by converting to empty string for display
              value={formData.promedio === null ? '' : formData.promedio}  
              onChange={handleChange}
              error={!!errors.promedio}
              helperText={errors.promedio}
              InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }} // Allow decimals
              required
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      {/* Modal footer with action buttons */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        {/* Cancel Button - closes modal without saving */}
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}  // Disable during save operation
        >
          Cancelar
        </Button>
        
        {/* Save Button - validates and saves the form data */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}  // Disable during save operation to prevent double-submission
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdicionEstudiante;