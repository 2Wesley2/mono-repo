import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DataTable = ({ headers, data, dataKeys, handleEdit, handleDelete }) => (
  <TableContainer component={Paper} sx={{ marginTop: 3 }}>
    <Table aria-label="Tabela de Dados">
      <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell key={header} sx={{ fontWeight: 'bold' }}>
              {header}
            </TableCell>
          ))}
          <TableCell align="center" sx={{ fontWeight: 'bold' }}>
            Ações
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={item._id}
            sx={{
              '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
              '&:hover': { backgroundColor: 'action.selected' },
            }}
          >
            {dataKeys.map((key) => (
              <TableCell key={key}>
                {key === 'cashback' ? (
                  item.cashback !== undefined ? (
                    <>
                      <div>{`R$ ${item.cashback.toFixed(2)}`}</div>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((item.cashback / 100) * 100, 100)}
                        sx={{ marginTop: 1 }}
                      />
                    </>
                  ) : (
                    'Sem cashback'
                  )
                ) : (
                  item[key]
                )}
              </TableCell>
            ))}
            <TableCell align="center">
              <Tooltip title="Editar">
                <IconButton onClick={() => handleEdit(item)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton onClick={() => handleDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DataTable;
