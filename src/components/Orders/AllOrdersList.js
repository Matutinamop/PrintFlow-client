import React from 'react';
import styles from './orders.module.css';
import { Table, Tbody, Td, Th, Thead, Tr } from '../shared/Tables';
import { isUrgent, isWarning } from '../../utilities/functions/dates';
import Loader from '../shared/Loader';
import Dropdown from '../shared/Dropdown';
import { today } from '../../utilities/functions/dates';
import { IconButton } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom'; // Cambio aquí

export function AllOrdersList({ orders, ordersLoading, changeStatus }) {
  const statusList = [
    'Todos',
    'Aceptada',
    'Abierta',
    'Finalizada',
    'Detenida',
    'Facturada',
  ];

  const navigate = useNavigate(); // Cambio aquí

  const handleEditClick = (order) => {
    navigate('/admin/orders/form', { state: order }); // Cambio aquí
  };

  return (
    <div className={styles.allOrders}>
      <div className={styles.allOrdersTable}>
        {ordersLoading ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          <div className={styles.tables}>
            <Table>
              <Thead>
                <Tr>
                  <Th size={'small'}>Nº orden</Th>
                  <Th>Producto</Th>
                  <Th size={'big'}>Cliente</Th>
                  <Th>
                    <p>Estado</p>{' '}
                    <Dropdown
                      options={statusList}
                      handleSelect={changeStatus}
                      dark
                    />
                  </Th>
                  <Th>Creado</Th>
                  <Th>Fecha límite</Th>
                  <Th>Presupuesto</Th>

                  <Th>Crear Orden</Th>
                  <Th>Crear Presupuesto</Th>
                  <th className={styles.editTh}>Editar</th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr
                    key={order?._id}
                    warning={isWarning(order)}
                    urgent={isUrgent(order)}
                  >
                    <Td size={'small'}>{order?.orderNumber}</Td>
                    <Td>{order?.product}</Td>
                    <Td size={'big'}>{order?.client?.companyName}</Td>
                    <Td>{order?.status}</Td>
                    <Td>{order?.dateCreated}</Td>
                    <Td>{order?.dateFinal}</Td>
                    <Td>${order?.budget}</Td>
                    <Td>
                      <PictureAsPdfIcon color='error' /* fontSize='large' */ />
                    </Td>
                    <Td>
                      <PictureAsPdfIcon color='error' /* fontSize='large' */ />
                    </Td>
                    <td className={styles.editTd}>
                      <IconButton
                        style={{ padding: 0 }}
                        onClick={() => handleEditClick(order)} // Cambio aquí
                      >
                        <EditIcon fontSize='small' sx={{ color: '#101204' }} />
                      </IconButton>
                    </td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
