import React, { useState } from 'react';
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
import { createOrderPDF } from '../../utilities/PDF/orderPDF';
import WorkShopOrder from './WorkshopOrder';
import Modal from '../shared/Modal';

export function AllOrdersList({ orders, ordersLoading, changeStatus }) {
  const [workshopOrderModal, setWorkshopOrderModal] = useState({
    open: false,
    order: {},
  });

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

  const createOrder = (order) => {
    setWorkshopOrderModal({ open: true, order: order });
  };

  const closeWorkshopModal = () => {
    setWorkshopOrderModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className={styles.allOrders}>
      <Modal isOpen={workshopOrderModal.open} onClose={closeWorkshopModal}>
        <WorkShopOrder order={workshopOrderModal.order} />
      </Modal>
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
                  <Th size={'sizeNumber'}>Nº MOP</Th>
                  <Th>Producto</Th>
                  <Th>Cliente</Th>
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
                    <Td size={'sizeNumber'}>{order?.orderNumber}</Td>
                    <Td>{order?.product}</Td>
                    <Td>{order?.client?.companyName}</Td>
                    <Td>{order?.status}</Td>
                    <Td>{order?.dateCreated}</Td>
                    <Td>{order?.dateFinal ?? '-'}</Td>
                    <Td>${order?.budget}</Td>
                    <Td>
                      <PictureAsPdfIcon
                        color='error'
                        onClick={() => createOrder(order)}
                      />
                    </Td>
                    <Td>
                      <PictureAsPdfIcon color='error' />
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
