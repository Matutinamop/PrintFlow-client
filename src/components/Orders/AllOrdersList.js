import React, { useState } from 'react';
import styles from './orders.module.css';
import { Table, Tbody, Td, Th, Thead, Tr } from '../shared/Tables';
import {
  isUrgent,
  isWarning,
  toFormatDate,
  warningLevel,
} from '../../utilities/functions/dates';
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
import {
  acceptOrder,
  updateOrder,
} from '../../utilities/functions/order/updateOrder';
import ClientBudget from './ClientBudget';
import {
  fetchFilteredOrders,
  fetchOrderById,
} from '../../redux/orders/ordersSlice';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export function AllOrdersList({
  orders,
  ordersLoading,
  changeStatus,
  toggleRefresh,
  setDateOrder,
}) {
  const dispatch = useDispatch();
  const [workshopOrderModal, setWorkshopOrderModal] = useState({
    open: false,
    order: {},
  });
  const [clientBudgetModal, setClientBudgetModal] = useState({
    open: false,
    order: {},
  });

  const statusList = [
    'Todos',
    'Aceptada',
    'Abierta',
    'Para facturar',
    'Para enviar',
    'Detenida',
    'Finalizada',
  ];

  const navigate = useNavigate(); // Cambio aquí

  const handleEditClick = async (order) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/order/${order._id}`
      );
      const fields = response.data.order;
      navigate('/admin/orders/form', {
        state: {
          order: fields,
          isEdit: true,
          orderStatus: order.status,
        },
      });
    } catch (error) {}
  };

  const createOrder = async (order) => {
    setWorkshopOrderModal({ open: true, order: order });
    dispatch(fetchOrderById(order._id));
    if (order?.status === 'Abierta') {
      await acceptOrder(order?._id);
      toggleRefresh();
    }
    /* toggleRefresh();
		if (order.status === 'Abierta') {
			acceptOrder(order._id);
		} */
  };

  const createBudget = (order) => {
    setClientBudgetModal({ open: true, order: order });
    dispatch(fetchOrderById(order._id));
  };

  const closeWorkshopModal = () => {
    /* toggleRefresh(); */
    setWorkshopOrderModal((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const closeClientBudgetModal = () => {
    setClientBudgetModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <div className={styles.allOrders}>
      <Modal isOpen={workshopOrderModal.open} onClose={closeWorkshopModal}>
        <WorkShopOrder
          order={workshopOrderModal.order}
          toggleRefresh={toggleRefresh}
        />
      </Modal>
      <Modal isOpen={clientBudgetModal.open} onClose={closeClientBudgetModal}>
        <ClientBudget
          order={clientBudgetModal.order}
          toggleRefresh={toggleRefresh}
        />
      </Modal>
      <div className={styles.allOrdersTable}>
        {/* {ordersLoading ? (
					<div className={styles.loader}>
						<Loader />
					</div>
				) : ( */}
        <div className={styles.tables}>
          <Table>
            <Thead>
              <Tr>
                <Th size={'sizeNumber'}>Nº PRES.</Th>
                <Th size={'sizeDate'}>Producto</Th>
                <Th size={'sizeClient'}>Cliente</Th>
                <Th size={'sizeDescription'}>Comentarios cliente</Th>
                <Th size='sizeStatus'>
                  <p>Estado</p>{' '}
                  <Dropdown
                    options={statusList}
                    handleSelect={changeStatus}
                    dark
                  />
                </Th>
                <Th size={'sizeDate'}>Creado</Th>
                <Th size={'sizeDate'}>Fecha estimada</Th>
                <Th size={'sizeDate'}>
                  <p onClick={setDateOrder} style={{ cursor: 'pointer' }}>
                    Fecha límite
                  </p>
                  <ArrowDropDownIcon
                    onClick={setDateOrder}
                    sx={{
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                    }}
                  />
                </Th>
                <Th size={'sizeDate'}>Precio</Th>
                <Th size={'sizeNumber'}>Desv.</Th>
                <Th size={'sizePDF'}>Orden</Th>
                <Th size={'sizePDF'}>Pto. Clte.</Th>
                <Th size={'sizePDF'}>Editar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => {
                const levelClass =
                  styles[
                    `warningLevel${warningLevel(order)}` || styles.warningLevel0
                  ];
                return (
                  <tr key={order?._id} className={clsx(styles.tr, levelClass)}>
                    <Td size={'sizeNumber'}>{order?.orderNumber}</Td>
                    <Td>{order?.product}</Td>
                    <Td size={'sizeClient'}>{order?.client?.companyName}</Td>
                    <Td size={'sizeDescription'}>{order?.descriptionClient}</Td>
                    <Td size='sizeStatus'>{order?.status}</Td>
                    <Td size={'sizeDate'}>
                      {toFormatDate(order?.dateCreated)}
                    </Td>
                    <Td size={'sizeDate'}>
                      {toFormatDate(order?.dateEstimate) ?? '-'}
                    </Td>
                    <Td size={'sizeDate'}>
                      {toFormatDate(order?.dateFinal) ?? '-'}
                    </Td>
                    <Td>
                      ${new Intl.NumberFormat('es-AR').format(order?.budget)}
                    </Td>
                    <Td size={'sizeNumber'}>{order?.deviation}</Td>
                    <Td size={'sizePDF'}>
                      <IconButton
                        style={{ padding: 0 }}
                        onClick={() => createOrder(order)}
                      >
                        <PictureAsPdfIcon color='error' />
                      </IconButton>
                    </Td>
                    {/* <Td>
											<PictureAsPdfIcon
												color="error"
												onClick={() => createOrder(order)}
											/>
										</Td> */}
                    <Td size={'sizePDF'}>
                      <IconButton
                        style={{ padding: 0 }}
                        onClick={() => createBudget(order)}
                      >
                        <PictureAsPdfIcon color='error' />
                      </IconButton>
                    </Td>
                    <Td size={'sizePDF'} >
                      <IconButton
                        style={{ padding: 0 }}
                        onClick={() => handleEditClick(order)} // Cambio aquí
                      >
                        <EditIcon fontSize='small' sx={{ color: '#101204' }} />
                      </IconButton>
                    </Td>
                  </tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
