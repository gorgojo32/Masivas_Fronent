import * as React from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, IconButton } from "@mui/material";
import { esES } from '@mui/x-data-grid/locales';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ModalEdicionEstudiante from './Modal/ModalEstudiante';

interface DinamicTableProps {
    rows: any[];
    columns: GridColDef[];
    onDelete: (id: number) => void;
    onEdit: (row: any) => void;
    carreras?: Array<{
      id_carrera?: number;
      nombre?: string;
    }>;
}

const DinamicTable: React.FC<DinamicTableProps> = ({
    rows,
    columns,
    onDelete,
    onEdit,
    carreras = []
}) => {
    const [tableRows, setTableRows] = React.useState<any[]>([]);
    
    const [modalOpen, setModalOpen] = React.useState(false);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = React.useState(null);
    
    React.useEffect(() => {
        setTableRows(rows);
    }, [rows]);
    
    const handleOpenModal = (row: any) => {
        setEstudianteSeleccionado(row);
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
        setEstudianteSeleccionado(null);
    };
    
    const handleGuardarEdicion = (estudianteEditado: any) => {
        onEdit(estudianteEditado);
        handleCloseModal();
    };

    const columnasBotones = [
        ...columns,
        {
            field: "Actions",
            headerName: "Acciones",
            width: 100,
            renderCell: (params: { row: { id_estudiante: number; }; }) => (
                <div>
                    <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(params.row)}
                    >
                        <SettingsIcon />
                    </IconButton>
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

    const paginationModel = { page: 0, pageSize: 8 };
    
    return (
        <>
        <Paper sx={{ height: 600, width: "100%" }} role="region" aria-label='tabla dinamica'>
            <DataGrid
                rows={tableRows}
                columns={columnasBotones}
                getRowId={(row) => row.id_estudiante || Math.random()}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 8, 10, 50, 100]}
                checkboxSelection
                disableRowSelectionOnClick
                sx={{ border: 0 }}
            />
        </Paper>
       
        {estudianteSeleccionado && (
            <ModalEdicionEstudiante
                open={modalOpen}
                onClose={handleCloseModal}
                estudiante={estudianteSeleccionado}
                onGuardar={handleGuardarEdicion}
                carreras={carreras}
            />
        )}
        </>
    );
};

export default DinamicTable;