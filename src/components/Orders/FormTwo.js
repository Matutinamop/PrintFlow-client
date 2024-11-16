import React, { useEffect, useRef, useState } from 'react';
import styles from './orders.module.css';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Input } from '../shared/Inputs';
import { useDispatch } from 'react-redux';
import {
  fetchClientById,
  fetchClients,
} from '../../redux/clients/clientsSlice';
import Dropdown from '../shared/Dropdown';
import PrintTask from './PrintTask';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import CreatableSelect from 'react-select/creatable';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

function FormTwo() {
  const dispatch = useDispatch();
  const { allOrdersCount } = useSelector((state) => state.orders);
  const { client, clients } = useSelector((state) => state.clients);

  const today = format(new Date(), 'dd/MM/yyyy');

  const [fields, setFields] = useState({
    taskCount: '1',
    client: '',
  });

  const clientOptions = clients.map((client) => ({
    key: client._id,
    value: client.companyName,
    label: client.companyName,
  }));

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '25px',
      height: '25px',
      minWidth: '100%',
      width: '100%',
      fontSize: '11px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: '25px',
      padding: '0 6px',
    }),

    container: (provided, state) => ({
      ...provided,
      height: '18px',
    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: (state) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '25px',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '12px',
    }),
  };

  const changeValue = (e) => {
    setFields((prevFields) => ({
      ...prevFields,
      [e.target.name]: e.target.value,
    }));
  };

  const changeTaskCount = (e) => {
    const newValue = e.target.value;
    if (newValue >= 0 && newValue <= 10) {
      setFields((prevFields) => ({
        ...prevFields,
        [e.target.name]: newValue,
      }));
    }
  };

  const matchClient = (name) => {
    const clientsMatched = clients.filter(
      (client) => name === client.companyName
    );

    if (clientsMatched.length === 1) {
      const clientId = clientsMatched[0]._id;
      dispatch(fetchClientById(clientId));
    }
    return;
  };

  const setContactInfo = (index) => {
    const { name, email, phone } = client?.contact[index];

    setFields((prev) => ({
      ...prev,
      ['contactName']: name,
      ['contactEmail']: email,
      ['contactPhone']: phone,
    }));
  };

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

  useEffect(() => {
    if (client?.contact?.length > 0) {
      const { name, email, phone } = client?.contact[0];

      setFields((prev) => ({
        ...prev,
        ['contactName']: name,
        ['contactEmail']: email,
        ['contactPhone']: phone,
      }));
    }
  }, [client]);

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convertimos FileList a array
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      console.log('Archivos seleccionados:', selectedFiles);
      // Aquí podrías enviar los archivos al servidor con una API
    } else {
      alert('Por favor selecciona al menos un archivo.');
    }
  };

  return (
    <div className={styles.formPage}>
      <div className={styles.a4Sheet}>
        <div className={styles.documentContent}>
          <div className={styles.mopHeader}>
            <div className={styles.headerBlock}>
              <h4>Imprenta</h4>
              <h2>MATUTINA</h2>
            </div>
            <h3 className={styles.headerBlock}>MOP de la empresa</h3>
            <div className={`${styles.headerBlock} ${styles.infoHeader}`}>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                Fecha de Creación: <span>{today}</span>
              </p>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                MOP Nº. <span>{allOrdersCount + 1} </span>
              </p>
            </div>
          </div>
          <div className={styles.block}>
            <Input name={'product'} size='big' onChange={(e) => changeValue(e)}>
              Familia:{' '}
            </Input>
            <div className={styles.selectClientContainer}>
              <label className={styles.label}>Cliente:</label>
              <CreatableSelect
                /* 							className={styles['container']}
							classNamePrefix={'searchable'} */
                styles={selectStyles}
                name='client'
                onChange={(option) => {
                  setFields((prev) => ({
                    ...prev,
                    ['client']: option.value,
                  }));
                  dispatch(fetchClientById(option.key));
                }}
                options={clientOptions}
                placeholder={'selecciona un cliente'}
              />
            </div>

            {/* <SearchableInput
							name={'client'}
							orientation={'vertical'}
							size="normal"
							onChange={changeValue}
							ifMatch={matchClient}
							options={clients.map(
								(client) => client.companyName
							)}
							autoComplete="off"
						>
							Cliente:
						</SearchableInput> */}
          </div>
          <div className={styles.block}>
            <div className={styles.blockTitle}>
              <h3>Información del cliente: </h3>
              <Dropdown
                handleIndex={setContactInfo}
                options={client?.contact?.map((contact) => contact.name)}
              />
            </div>
            <Input
              name={'RUT'}
              size={'big'}
              value={fields.RUT ? fields.RUT : ''}
              onChange={(e) => changeValue(e)}
              isDisabled
            >
              RUT
            </Input>
            <Input
              name={'contactName'}
              size='normal'
              value={fields.contactName ? fields.contactName : ''}
              onChange={(e) => changeValue(e)}
            >
              Contacto:{' '}
            </Input>
            <Input
              name={'contactPhone'}
              value={fields.contactPhone ? fields.contactPhone : ''}
              size='normal'
              onChange={(e) => changeValue(e)}
            >
              Teléfono:
            </Input>
            <Input
              name={'contactEmail'}
              value={fields.contactEmail ? fields.contactEmail : ''}
              size='normal'
              onChange={(e) => changeValue(e)}
            >
              Email:{' '}
            </Input>
            {/* <Input
                            name={'clientDelivery'}
                            
                            size="normal"
                            onChange={(e) => changeValue(e)}
                        >
                            Datos de entrega:
                        </Input> */}
            <div className={styles.inputContainer}>
              <label>Datos de entrega:</label>
              <textarea className={styles.textArea} />
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.blockTitle}>
              <h3>Información del pedido: </h3>
            </div>
            {/* <div className={styles.inputContainer}>
							<label>Solicitud:</label>
							<textarea className={styles.textArea} />
						</div> */}
            <div className={styles.inputContainer}>
              <label>Comentarios para el Cliente:</label>
              <textarea className={styles.textArea} />
            </div>
            <div className={styles.inputContainer}>
              <label>Comentarios para el Taller:</label>
              <textarea className={styles.textArea} />
            </div>
            <div className={styles.inputContainer}>
              <label>Comentarios Internos:</label>
              <textarea className={styles.textArea} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '15px',
              }}
            >
              <div className={styles.inputNumberContainer}>
                <label>Número de tareas:</label>
                <input
                  className={styles.inputNumber}
                  name='taskCount'
                  type='number'
                  min={1}
                  value={fields.taskCount}
                  onChange={(e) => {
                    changeTaskCount(e);
                  }}
                />
              </div>
              <div>
                <input
                  type='file'
                  id='upload-button'
                  style={{ display: 'none' }}
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor='upload-button'>
                  <Button
                    variant='contained'
                    component='span'
                    startIcon={<UploadFileIcon />}
                    color='primary'
                  >
                    Adjuntar archivos
                  </Button>
                  {selectedFiles.length > 0 && (
                    <div style={{ marginTop: '20px', textAlign: 'left' }}>
                      <Typography>Archivos seleccionados:</Typography>
                      <List>
                        {selectedFiles.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={file.name}
                              secondary={`Tamaño: ${(file.size / 1024).toFixed(
                                2
                              )} KB`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  )}
                  <Button
                    variant='contained'
                    color='success'
                    style={{ marginTop: '20px' }}
                    onClick={handleUpload}
                  >
                    Subir
                  </Button>
                </label>
              </div>
            </div>
          </div>
          {Array.from({ length: fields.taskCount }, (_, index) => (
            <PrintTask key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormTwo;
