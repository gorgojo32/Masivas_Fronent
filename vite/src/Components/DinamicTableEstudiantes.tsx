import * as React from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, IconButton } from "@mui/material";
import { esES } from '@mui/x-data-grid/locales';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ModalEdicionEstudiante from './Modal/ModalEstudiante';

// Interface defining the props structure for the dynamic table component
// This component is specifically designed to handle student data operations
interface DinamicTableProps {
    rows: any[];                    // Array of student data rows to display
    columns: GridColDef[];          // Column definitions for the data grid
    onDelete: (id: number) => void; // Callback function triggered when deleting a student
    onEdit: (row: any) => void;     // Callback function triggered when editing a student
    carreras?: Array<{              // Optional array of career/major options
        id_carrera?: number;
        nombre?: string;
    }>;
}

// Main dynamic table component that renders a data grid with CRUD operations
const DinamicTable: React.FC<DinamicTableProps> = ({
    rows,
    columns,
    onDelete,
    onEdit,
    carreras = []  // Default empty array if no careers provided
}) => {
    // Local state to manage table rows, allowing for real-time updates
    const [tableRows, setTableRows] = React.useState<any[]>([]);

    // State management for the edit modal visibility
    const [modalOpen, setModalOpen] = React.useState(false);
    
    // State to store the currently selected student for editing
    const [estudianteSeleccionado, setEstudianteSeleccionado] = React.useState(null);

    // Effect hook to sync external rows prop with internal table state
    // This ensures the table updates when parent component changes the data
    React.useEffect(() => {
        setTableRows(rows);
    }, [rows]);

    // Opens the edit modal with the selected student's data
    // Sets the student data and makes the modal visible
    const handleOpenModal = (row: any) => {
        setEstudianteSeleccionado(row);
        setModalOpen(true);
    };

    // Closes the edit modal and clears the selected student
    // Resets the modal state to its initial condition
    const handleCloseModal = () => {
        setModalOpen(false);
        setEstudianteSeleccionado(null);
    };

    // Processes and saves the edited student data
    // Handles data validation and type conversion before sending to parent
    const handleGuardarEdicion = (estudianteEditado: any) => {
        // Process the student data before saving - convert empty string to 0 for average
        // This ensures consistent data types and prevents validation errors
        const estudianteProcesado = {
            ...estudianteEditado,
            promedio: estudianteEditado.promedio === '' ? 0 : parseFloat(estudianteEditado.promedio)
        };
        
        // Call the parent's edit handler with processed data
        onEdit(estudianteProcesado);
        
        // Close the modal after successful save
        handleCloseModal();
    };

    // Dynamically creates column configuration by merging provided columns with action buttons
    // This adds edit and delete functionality to each row
    const columnasBotones = [
        ...columns,  // Spread existing columns
        {
            field: "Actions",
            headerName: "Acciones",
            width: 100,
            // Custom cell renderer for action buttons
            renderCell: (params: { row: { id_estudiante: number; }; }) => (
                <div>
                    {/* Edit button - opens modal with student data */}
                    <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(params.row)}
                    >
                        <SettingsIcon />
                    </IconButton>
                    
                    {/* Delete button - triggers delete callback with student ID */}
                    <IconButton
                        color="error"
                        onClick={() => onDelete(params.row.id_estudiante)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )
        }
    ];

    // Pagination configuration for the data grid
    // Sets default page size and starting page
    const paginationModel = { page: 0, pageSize: 8 };

    return (
        <>
            {/* Main table container with Material-UI Paper component for elevation */}
            <Paper sx={{ height: 600, width: "100%" }} role="region" aria-label='tabla dinamica'>
                <DataGrid
                    rows={tableRows}                    // Data rows to display
                    columns={columnasBotones}           // Column definitions including actions
                    getRowId={(row) => row.id_estudiante || Math.random()} // Unique ID generator
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText} // Spanish localization
                    initialState={{ pagination: { paginationModel } }}     // Initial pagination state
                    pageSizeOptions={[5, 8, 10, 50, 100]}                 // Available page sizes
                    checkboxSelection                   // Enable row selection with checkboxes
                    disableRowSelectionOnClick         // Prevent row selection on click
                    sx={{ border: 0 }}                 // Remove default border
                />
            </Paper>

            {/* Conditional rendering of edit modal */}
            {/* Only renders when a student is selected for editing */}
            {estudianteSeleccionado && (
                <ModalEdicionEstudiante
                    open={modalOpen}                    // Modal visibility state
                    onClose={handleCloseModal}         // Close handler
                    estudiante={estudianteSeleccionado} // Selected student data
                    onGuardar={handleGuardarEdicion}    // Save handler
                    carreras={carreras}                 // Available career options
                />
            )}
        </>
    );
};

export default DinamicTable;