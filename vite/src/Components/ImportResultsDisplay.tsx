import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Chip, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Interface defining the structure of import operation results
// This represents the response from a bulk data import process
interface ImportResults {
  success: boolean;           // Whether the import operation succeeded overall
  message?: string;           // Success message (optional)
  msg?: string;              // Error message (optional, alternative to message)
  insertados?: number;       // Number of records successfully inserted
  totalProcesados?: number;  // Total number of records processed
  errores?: Array<{          // Array of specific errors encountered
    estudiante: string;      // Student identifier or name with error
    error: string;           // Description of the specific error
  }>;
}

// Component that displays comprehensive results from a data import operation
// Shows success/failure status, statistics, and detailed error information
const ImportResultsDisplay = ({ results }: { results: ImportResults | null }) => {
  // Early return if no results provided - component renders nothing
  if (!results) return null;
  
  // Destructure results with default values to handle missing properties
  const { 
    success,                    // Overall operation success flag
    message,                    // Success message
    msg,                       // Error message
    insertados = 0,            // Default to 0 if not provided
    totalProcesados = 0,       // Default to 0 if not provided
    errores = []               // Default to empty array if not provided
  } = results;
  
  // Helper variables for display logic
  const tieneErrores = errores && errores.length > 0;  // Check if any errors exist
  
  // Calculate success percentage for progress display
  const porcentajeExito = totalProcesados ? Math.round((insertados / totalProcesados) * 100) : 0;
  
  return (
    // Main container with Material-UI Paper for elevation and styling
    <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
      
      {/* Header section with status icon and title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {/* Conditional icon rendering based on success status */}
        {success ? (
          <CheckCircleIcon color="success" fontSize="large" sx={{ mr: 2 }} />
        ) : (
          <ErrorIcon color="error" fontSize="large" sx={{ mr: 2 }} />
        )}
        <Typography variant="h6">
          Resultados de la Importación
        </Typography>
      </Box>
      
      {/* Visual separator */}
      <Divider sx={{ mb: 2 }} />
      
      {/* Main content section with status message and statistics */}
      <Box sx={{ mb: 3 }}>
        {/* Primary status message - shows success or error message */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          {success 
            ? message || `Se han procesado ${totalProcesados} registros correctamente.`
            : msg || "Ha ocurrido un error durante la importación."
          }
        </Typography>
        
        {/* Statistics chips - only shown if records were processed */}
        {totalProcesados > 0 && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Success count chip */}
            <Chip 
              label={`${insertados} registros insertados`} 
              color="success" 
              icon={<CheckCircleIcon />} 
            />
            
            {/* Error count chip - only shown if errors exist */}
            {tieneErrores && (
              <Chip 
                label={`${errores.length} con errores`} 
                color="error" 
                icon={<ErrorIcon />} 
              />
            )}
            
            {/* Completion percentage chip with dynamic color based on success rate */}
            <Chip 
              label={`${porcentajeExito}% completado`} 
              color={porcentajeExito > 80 ? "success" : porcentajeExito > 50 ? "warning" : "error"}
            />
          </Box>
        )}
      </Box>
      
      {/* Expandable error details section - only shown when errors exist */}
      {tieneErrores && (
        <Accordion sx={{ mt: 2 }}>
          {/* Accordion header with error count */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="errores-content"
            id="errores-header"
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon color="warning" sx={{ mr: 1 }} />
              Detalles de Errores ({errores.length})
            </Typography>
          </AccordionSummary>
          
          {/* Accordion content with scrollable error list */}
          <AccordionDetails>
            <List dense sx={{ bgcolor: 'background.paper', maxHeight: 200, overflow: 'auto' }}>
              {/* Map through errors array to display each error */}
              {errores.map((error: { estudiante: string; error: string }, index: number) => (
                <ListItem key={index} divider={index < errores.length - 1}>
                  {/* Error icon for each list item */}
                  <ListItemIcon>
                    <ErrorIcon color="error" />
                  </ListItemIcon>
                  
                  {/* Error details - student name and error description */}
                  <ListItemText
                    primary={error.estudiante}    // Student identifier
                    secondary={error.error}       // Error description
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Help/tip section with user guidance */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Tip: Si hubo errores, puede corregir los datos en su archivo Excel y volver a importarlo.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ImportResultsDisplay;