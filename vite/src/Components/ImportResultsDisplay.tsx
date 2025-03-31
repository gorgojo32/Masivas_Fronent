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
interface ImportResults {
  success: boolean;
  message?: string;
  msg?: string;
  insertados?: number;
  totalProcesados?: number;
  errores?: Array<{
    estudiante: string;
    error: string;
  }>;
}


const ImportResultsDisplay = ({ results }: { results: ImportResults | null }) => {
  if (!results) return null;
  
  const { 
    success, 
    message, 
    msg, 
    insertados = 0, 
    totalProcesados = 0, 
    errores = [] 
  } = results;
  
  const tieneErrores = errores && errores.length > 0;
  const porcentajeExito = totalProcesados ? Math.round((insertados / totalProcesados) * 100) : 0;
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {success ? (
          <CheckCircleIcon color="success" fontSize="large" sx={{ mr: 2 }} />
        ) : (
          <ErrorIcon color="error" fontSize="large" sx={{ mr: 2 }} />
        )}
        <Typography variant="h6">
          Resultados de la Importación
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {success 
            ? message || `Se han procesado ${totalProcesados} registros correctamente.`
            : msg || "Ha ocurrido un error durante la importación."
          }
        </Typography>
        
        {totalProcesados > 0 && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${insertados} registros insertados`} 
              color="success" 
              icon={<CheckCircleIcon />} 
            />
            
            {tieneErrores && (
              <Chip 
                label={`${errores.length} con errores`} 
                color="error" 
                icon={<ErrorIcon />} 
              />
            )}
            
            <Chip 
              label={`${porcentajeExito}% completado`} 
              color={porcentajeExito > 80 ? "success" : porcentajeExito > 50 ? "warning" : "error"}
            />
          </Box>
        )}
      </Box>
      
      {tieneErrores && (
        <Accordion sx={{ mt: 2 }}>
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
          <AccordionDetails>
            <List dense sx={{ bgcolor: 'background.paper', maxHeight: 200, overflow: 'auto' }}>
            {errores.map((error: { estudiante: string; error: string }, index: number) => (
                <ListItem key={index} divider={index < errores.length - 1}>
                  <ListItemIcon>
                    <ErrorIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={error.estudiante}
                    secondary={error.error}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      
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