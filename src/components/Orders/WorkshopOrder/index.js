import { useEffect, useRef, useState } from 'react';
import styles from './workshop.module.css';
import { toFormatDate } from '../../../utilities/functions/dates';
import { Button } from '@mui/material';
import {
  sendOrder,
  stopOrder,
  unStopOrder,
  updateOrder,
} from '../../../utilities/functions/order/updateOrder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { fetchFilesFromZip } from '../../../utilities/functions/forms/uploadFile';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsByOrder } from '../../../redux/comments/comments';
import { fetchActiveOrders } from '../../../redux/orders/ordersSlice';
import { fetchStations } from '../../../redux/workStations/workStationSlice';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { cutVisualizerHandler } from '../../../utilities/functions/cutVisualizerHandler';
import CutVisualizer from '../../shared/CutVisualizer';
import { FakeInput } from '../../shared/Inputs';

function WorkShopOrder({ toggleRefresh }) {
  const dispatch = useDispatch();
  const orderPDF = useRef();

  const { comments } = useSelector((state) => state.comments);
  const { order, loadingOrders } = useSelector((state) => state.orders);

  const [fields, setFields] = useState({});
  const [currentStatus, setCurrentStatus] = useState('');

  const [selectedFiles, setSelectedFiles] = useState({});
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

  useEffect(() => {
    if (order?.comments?.length > 0) {
      dispatch(fetchCommentsByOrder(order?._id));
    }
  }, [order]);

  useEffect(() => {
    dispatch(fetchActiveOrders());
    dispatch(fetchStations());
  }, [currentStatus]);

  /* 	useEffect(() => {
		console.log(comments);
	}, [comments]); */

  useEffect(() => {
    setFields(order?.fields?.values);
    setCurrentStatus(order?.status);
  }, [order]);

  useEffect(() => {
    if (order?.scheme?.link) {
      const loadFiles = async () => {
        const files = await fetchFilesFromZip(order?.scheme.link);
        setSelectedFiles(files);
      };

      loadFiles();
    }
  }, [order?.scheme]);

  const generatePDF = async () => {
    const input = orderPDF.current;
    const scale = 2;
    if (!input) {
      console.error('El nodo PDF no está montado.');
      return;
    }

    // Asegurarse de que las fuentes estén cargadas
    await document.fonts.ready;

    // Generamos el canvas
    const canvas = await html2canvas(input, {
      scale,
      useCORS: true,
      onclone: (doc) => {
        const taList = doc.querySelectorAll('textarea');
        taList.forEach((ta) => {
          const cs = doc.defaultView.getComputedStyle(ta);
          const div = doc.createElement('div');

          div.textContent = ta.value || '';

          // ← Claves para que wrapee incluso sin espacios
          div.style.whiteSpace = 'pre-wrap';
          div.style.overflowWrap = 'anywhere'; // corta en cualquier lado si no hay espacios
          div.style.wordBreak = 'break-word'; // fallback

          // mimetizar estilos básicos
          div.style.display = 'block';
          div.style.font = cs.font;
          div.style.lineHeight = cs.lineHeight;
          div.style.color = cs.color;
          div.style.background = cs.backgroundColor;
          div.style.border = cs.border;
          div.style.borderRadius = cs.borderRadius;
          div.style.padding = cs.padding;
          div.style.margin = cs.margin;
          div.style.boxSizing = cs.boxSizing;

          // usar dimensiones reales del textarea
          div.style.width = ta.clientWidth + 'px';
          div.style.minHeight = Math.max(ta.scrollHeight, ta.clientHeight) + 'px';

          ta.style.display = 'none';
          ta.parentNode.insertBefore(div, ta);
        });
      },
    });

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Creamos el PDF en tamaño A4 (mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Dimensiones del PDF en mm y en píxeles
    const pdfWidthMM = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeightMM = pdf.internal.pageSize.getHeight(); // 297 mm
    const pdfWidthPx = Math.floor((pdfWidthMM / 25.4) * 96 * scale);
    const pdfHeightPx = Math.floor((pdfHeightMM / 25.4) * 96 * scale);

    // Margen deseado en mm (definí 10 mm, pero podés cambiarlo)
    const marginMM = 7;
    // Área disponible en mm
    const availableWidthMM = pdfWidthMM - marginMM * 2;
    const availableHeightMM = pdfHeightMM - marginMM * 2;
    // Convertimos el margen y área disponible a píxeles
    const mmToPx = (mm) => Math.floor((mm / 25.4) * 96 * scale);
    const pxToMm = (px) => (px / (96 * scale)) * 25.4;
    const availableWidthPx = mmToPx(availableWidthMM);
    const availableHeightPx = mmToPx(availableHeightMM);

    let currentHeight = 0;
    let pageCount = 0;

    while (currentHeight < canvasHeight) {
      // Cortamos el canvas en slices del alto disponible en la página (sin márgenes)
      const sliceHeight = Math.min(availableHeightPx, canvasHeight - currentHeight);

      // Canvas temporal para el slice
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasWidth;
      tempCanvas.height = sliceHeight;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(
        canvas,
        0,
        currentHeight, // desde dónde recortar en Y
        canvasWidth, // ancho a recortar
        sliceHeight, // alto a recortar
        0,
        0,
        canvasWidth,
        sliceHeight
      );

      const imgData = tempCanvas.toDataURL('image/png');

      if (pageCount > 0) {
        pdf.addPage();
      }

      // Convertir dimensiones del slice de px a mm
      const sliceWidthMM = pxToMm(canvasWidth);
      const sliceHeightMM = pxToMm(sliceHeight);

      // Calcular el factor de escala para que la imagen se ajuste en el área disponible
      const scaleRatio = Math.min(
        availableWidthMM / sliceWidthMM,
        availableHeightMM / sliceHeightMM
      );
      const finalWidth = sliceWidthMM * scaleRatio;
      const finalHeight = sliceHeightMM * scaleRatio;

      // Posicionar la imagen en (margen, margen)
      pdf.addImage(imgData, 'PNG', marginMM, marginMM, finalWidth, finalHeight);

      currentHeight += sliceHeight;
      pageCount++;
    }

    pdf.autoPrint(); // Habilita la impresión automática
    const blob = pdf.output('blob'); // Genera el blob del PDF

    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, '_blank');

    // Opcional: cerrar la URL después de un tiempo para liberar memoria
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  };

  /* 	const Input = ({ name, value }) => {
		return (
			<div>
				<label className={styles.label}>{name}</label>
				<p className={styles.inputWorkshop}>{value}</p>
			</div>
		);
	}; */

  const handleDownload = () => {
    const link = document.createElement('a');

    link.href = order?.scheme.link;
    link.download = `Archivos-Presupuesto-${order?.orderNumber}`;

    link.click();
  };

  return (
    <>
      {!fields || loadingOrders || Object.keys(fields).length === 0 ? (
        <div></div>
      ) : (
        <div
          style={{
            overflow: 'auto',
            height: '80vh',
            borderRadius: '5px',
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            onClick={generatePDF}
            style={{
              margin: '15px',
              color: 'black',
            }}
          >
            Imprimir
          </Button>
          <Button variant="contained" onClick={handleDownload}>
            Descargar archivos
          </Button>
          {currentStatus === 'Aceptada' ? (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                stopOrder(order?._id, setCurrentStatus);
              }}
              style={{
                margin: '15px',
              }}
            >
              Detener orden
            </Button>
          ) : currentStatus === 'Detenida' ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                unStopOrder(order?._id, setCurrentStatus);
              }}
              style={{
                margin: '15px',
              }}
            >
              Activar orden
            </Button>
          ) : currentStatus === 'Para enviar' ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => sendOrder(order?._id, setCurrentStatus)}
              style={{
                margin: '15px',
              }}
            >
              Orden enviada
            </Button>
          ) : (
            ''
          )}

          <div className={styles.a4Sheet} ref={orderPDF}>
            <div className={styles.documentContent}>
              <div className={styles.mopHeader}>
                <div className={styles.headerBlock}>
                  <h4>Imprenta</h4>
                  <h2>MATUTINA</h2>
                </div>
                <h3 className={styles.headerBlock} style={{ textAlign: 'center' }}>
                  Orden de producción
                </h3>
                <div className={`${styles.headerBlock} ${styles.infoHeader} `}>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignSelf: 'flex-end',
                      width: '160px',
                    }}
                  >
                    Fecha de Creación: <span>{toFormatDate(order?.dateCreated)}</span>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      fontWeight: 'bold',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>
                      ORDEN Nº. <span>{order?.orderNumber} </span>
                    </span>
                  </p>
                </div>
              </div>
              <div className={`${styles.blockContainer} ${styles.noBreak}`}>
                <div className={styles.leftBlock}>
                  {' '}
                  <div>
                    <h3 className={styles.sectionTitle}>Familia:</h3>{' '}
                    <p className={styles.familyInput}>{fields?.product ?? ''}</p>
                  </div>
                  <div>
                    <label className={styles.label}>Fecha estimada:</label>{' '}
                    <p className={styles.familyInput}>{fields.dateEstimate ?? '-'}</p>
                  </div>
                  <div>
                    <label className={styles.label}>Fecha limite:</label>{' '}
                    <p className={styles.familyInput}>{fields.dateFinal ?? '-'}</p>
                  </div>
                </div>
                <div className={styles.rightBlock}>
                  <h3 className={styles.sectionTitle}>Cliente:</h3>
                  <div
                    style={{
                      padding: '10px',
                      width: '500px',
                      backgroundColor: 'white',
                      color: 'black',
                    }}
                  >
                    <h4>{fields.client.companyName}</h4>
                    <p>{fields.client.legalName}</p>
                    <p>{fields.client.address}</p>
                    <p>{fields.client.phone}</p>
                  </div>

                  <div className={styles.blockTitle}>
                    <h3>Información de contacto: </h3>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '5px',
                    }}
                  >
                    <div>
                      <label className={styles.label}>Nombre:</label>
                      <p className={styles.inputWorkshopContact}>{fields.contactName}</p>
                    </div>
                    <div>
                      <label className={styles.label}>Teléfono:</label>
                      <p className={styles.inputWorkshopContact}>{fields.contactPhone}</p>
                    </div>
                    <div>
                      <label className={styles.label}>Email:</label>
                      <p className={styles.inputWorkshopContact}>{fields.contactEmail}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.inputContainer}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '100',
                      color: '#444',
                    }}
                  >
                    Datos de entrega:
                  </h3>
                  <textarea
                    className={styles.textArea}
                    name="deliveryData"
                    value={fields.deliveryData ?? ''}
                    onChange={(e) => changeValue(e, setFields)}
                    onBlur={() => updateOrder(order?._id, fields)}
                  />
                </div>
              </div>

              <div className={`${styles.block}`}>
                <div className={styles.blockTitle}>
                  <h3>Información del pedido: </h3>
                </div>
                <div className={styles.inputContainer}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '100',
                      color: '#444',
                    }}
                  >
                    Descripción para el Cliente:
                  </h3>
                  <textarea
                    className={styles.textArea}
                    name="descriptionClient"
                    value={fields.descriptionClient ?? ''}
                    onChange={(e) => changeValue(e, setFields)}
                    onBlur={() => updateOrder(order?._id, fields)}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '100',
                      color: '#444',
                    }}
                  >
                    Comentarios para el Taller:
                  </h3>
                  <textarea
                    className={styles.textArea}
                    name="descriptionWork"
                    value={fields.descriptionWork ?? ''}
                    onChange={(e) => changeValue(e, setFields)}
                    onBlur={() => updateOrder(order?._id, fields)}
                  />
                </div>
                {comments.length > 0 ? (
                  <div className={styles.inputContainer}>
                    <h3 style={{ fontSize: '16px' }}>Comentarios del Taller:</h3>
                    {comments?.map((comment) => (
                      <div key={comment._id} className={styles.textArea}>
                        <p className={styles.commentContent}>{comment.content}</p>
                        <p className={styles.commentDate}>{toFormatDate(comment.date)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  ''
                )}

                {order?.scheme?.link ? (
                  <div className={styles.inputContainer}>
                    <div style={{ width: '100%' }}>
                      <h3 style={{ fontSize: '16px' }}>Archivos adjuntos:</h3>
                      {selectedFiles.length > 0 && (
                        <div
                          style={{
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          <List sx={{ width: '100%' }}>
                            {selectedFiles.map((file, index) => (
                              <ListItem
                                key={index}
                                sx={{
                                  display: 'flex',
                                  gap: '10px',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                              >
                                <ListItemText
                                  primary={file.name}
                                  secondary={`Tamaño: ${(file.size / 1024).toFixed(2)} KB`}
                                />

                                <ListItemIcon>
                                  {imageExtensions.includes(
                                    file.name.split('.').pop().toLowerCase()
                                  ) ? (
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                      }}
                                    />
                                  ) : (
                                    <UploadFileIcon />
                                  )}
                                </ListItemIcon>
                              </ListItem>
                            ))}
                          </List>
                        </div>
                      )}
                      {selectedFiles.length > 0 ? (
                        <>
                          <Button variant="contained" onClick={() => handleDownload()}>
                            Descargar
                          </Button>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              {fields.printTasks.map((info, index) => (
                <div className={`${styles.block} ${styles.blockPrintTask}`}>
                  <div className={styles.contain}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <h2 className={styles.printTitle}>Módulo de impresión</h2>
                      <FakeInput value={info.sheetDescription || ''} size="bigSize" bold>
                        Descripción del modulo:
                      </FakeInput>
                    </div>

                    <FakeInput value={info.quantity || ''} size="mediumSize">
                      Unidades:
                    </FakeInput>
                    <FakeInput value={info.finalSize || ''} size="mediumSize">
                      Medida final:
                    </FakeInput>
                    <FakeInput value={info.sizeWithMargins || ''} size="mediumSize">
                      Medida con márgenes:
                    </FakeInput>

                    <div style={{ paddingTop: '20px' }}>
                      <FakeInput
                        value={
                          info?.materialOptions && Array.isArray(info.materialOptions)
                            ? info.materialOptions.find(
                                (material) => material.value === info?.material
                              )?.label || '-'
                            : '-'
                        }
                        size="materialSize"
                      >
                        Material:
                      </FakeInput>
                    </div>
                    <div
                      className={`${styles.selectContainer} ${styles.smallNumberSelectContainer}`}
                    >
                      <FakeInput value={info.grammage || ''} size="smallSize">
                        Gramaje:
                      </FakeInput>
                    </div>
                    <div className={styles.selectContainer}>
                      <FakeInput value={info.bulkPaperSize || ''} size="mediumSize">
                        Tam. hoja:
                      </FakeInput>
                    </div>
                    <div className={styles.selectContainer}>
                      <FakeInput value={info.sheetSize || ''} size="mediumSize">
                        Pliego:
                      </FakeInput>
                    </div>
                    <FakeInput value={info.sheetPerBulkPaper || ''} size="numberSize">
                      Pli. x Hoja:
                    </FakeInput>

                    <FakeInput
                      name={'Unid. x Pli.:'}
                      value={info.unitsPerSheet || ''}
                      size="numberSize"
                    >
                      Unid. x Pli.:
                    </FakeInput>

                    <FakeInput size="mediumSize" value={info.sheetQuantity || ''}>
                      Cant. Pli. de impresión:
                    </FakeInput>

                    <FakeInput value={info.excess} size="numberSize">
                      Demasía:
                    </FakeInput>

                    <FakeInput value={info.bulkPaperQuantity || 0} size="numberSize">
                      Hojas:
                    </FakeInput>

                    <div className={styles.lastItem}></div>
                    <div style={{ paddingTop: '20px' }}>
                      <FakeInput
                        value={
                          info.operationOptions && Array.isArray(info.operationOptions)
                            ? info.operationOptions.find(
                                (station) => station.value === info?.operation
                              )?.label || '-'
                            : '-'
                        }
                        size="materialSize"
                      >
                        Máquina:
                      </FakeInput>
                    </div>
                    <FakeInput value={info.plates || ''} size="numberSize">
                      Chapas:
                    </FakeInput>

                    <div className={styles.lastItem}></div>
                    <div className={styles.printFirstRow} style={{ alignItems: 'center' }}>
                      {!cutVisualizerHandler(info?.sheetSize, info?.sizeWithMargins) ||
                      Object.values(
                        cutVisualizerHandler(info?.sheetSize, info?.sizeWithMargins)
                      ).some((value) => Number(value) === 0 || isNaN(Number(value))) ? (
                        ''
                      ) : (
                        <div>
                          <label className={styles.label}> Unidades por pliego:</label>
                          <CutVisualizer
                            visualizerData={cutVisualizerHandler(
                              info?.sheetSize,
                              info?.sizeWithMargins
                            )}
                          />
                        </div>
                      )}
                      <div className={styles.tintasDiv}>
                        <h3>TINTAS</h3>
                        <div>
                          <label className={styles.label}>Frente:</label>
                          <textarea
                            className={styles.textArea}
                            name="front"
                            value={info.front || ''}
                          ></textarea>
                        </div>
                        <div>
                          <label className={styles.label}>Dorso:</label>
                          <textarea
                            className={styles.textArea}
                            name="back"
                            value={info.back || ''}
                          ></textarea>
                        </div>
                      </div>
                      <div className={styles.rightRow}>
                        <div className={styles.rightRowContainer}>
                          <FakeInput name="postures" value={info.postures || ''} size="numberSize">
                            Posturas:
                          </FakeInput>
                          <FakeInput name="printRun" value={info.printRun || ''} size="priceSize">
                            Tiraje:
                          </FakeInput>
                          <div></div>
                        </div>
                        <div className={styles.rightRowContainer}>
                          <FakeInput
                            name="moduleRepeat"
                            value={info.moduleRepeat}
                            size="numberSize"
                          >
                            Repetir modulo:
                          </FakeInput>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className={`${styles.block} ${styles.blockPrintTask} ${styles.noBreak}`}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Operación</th>
                      <th className={styles.smallth}>Descripción</th>
                      <th className={styles.smallth}>Unidad</th>
                      <th className={styles.smallth}>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.otherTasks?.map((op, index) => (
                      <tr className={styles.tr} key={index}>
                        <td className={`${styles.td} ${styles.nameTd}`}>{op.operation?.name} </td>
                        <td className={`${styles.input} ${styles.td}`}>
                          {op.description ?? ''}
                          {/* <input
														className={`${styles.input} ${styles.td}`}
														name="description"
														defaultValue={
															op.description ?? ''
														}
													/> */}
                        </td>
                        <td className={styles.smallInput}>
                          {op.operation?.unitType ?? ''}
                          {/* <input
														className={styles.smallInput}
														name="unitType"
														defaultValue={
															op.operation?.unitType ?? ''
														}
														disabled
													/> */}
                        </td>
                        <td className={styles.smallInput}>
                          {op?.quantity ?? ''}
                          {/* <input
														className={styles.smallInput}
														name="quantity"
														defaultValue={
															op?.quantity ?? ''
														}
													/> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkShopOrder;
