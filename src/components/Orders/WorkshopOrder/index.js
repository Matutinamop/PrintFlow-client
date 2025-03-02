import React, { useRef } from 'react';
import styles from '../Form/form.module.css';
import { Input } from '../../shared/Inputs';
import { today } from '../../../utilities/functions/dates';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@mui/material';

function WorkShopOrder({ order }) {
  const orderPDF = useRef();
  console.log(order);
  const { fields } = order;
  const { allOrdersCount } = useSelector((state) => state.orders);

  const generatePDF = () => {
    const input = orderPDF.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Formato A4
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('documento.pdf'); // Descarga el PDF
    });
  };

  return (
    <div style={{ overflow: 'auto', height: '70vh' }}>
      <Button onClick={generatePDF}>crear PDF</Button>
      <div className={styles.a4Sheet} ref={orderPDF}>
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
                Fecha de Creación: <span>{today()}</span>
              </p>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontWeight: 'bold',
                }}
              >
                <div style={{ fontSize: '24px' }}>
                  MOP Nº. <span>{allOrdersCount} </span>
                </div>
              </p>
            </div>
          </div>
          <div className={styles.blockContainer}>
            <div className={styles.leftBlock}>
              {' '}
              <h3 className={styles.sectionTitle}>Familia:</h3>{' '}
              <input
                className={styles.familyInput}
                name={'product'}
                value={fields.product ?? ''}
              ></input>
              <label className={styles.label}>Fecha Estimada:</label>
              <input
                className={styles.dateInput}
                type='date'
                name='dateEstimate'
                value={fields.dateEstimate ?? ''}
              />
              <label className={styles.label}>Fecha Limite:</label>
              <input
                className={styles.dateInput}
                type='date'
                name='dateFinal'
                value={fields.dateFinal ?? ''}
              />
            </div>
            <div className={styles.rightBlock}>
              <h3 className={styles.sectionTitle}>Cliente:</h3>
              <div
                style={{
                  /* height: '80px', */
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
                <Input
                  name={'contactName'}
                  size='priceSize'
                  value={fields.contactName ? fields.contactName : ''}
                >
                  Nombre:{' '}
                </Input>
                <Input
                  name={'contactPhone'}
                  value={fields.contactPhone ? fields.contactPhone : ''}
                  size='priceSize'
                >
                  Teléfono:
                </Input>
                <Input
                  name={'contactEmail'}
                  value={fields.contactEmail ? fields.contactEmail : ''}
                  size='mailSize'
                >
                  Email:{' '}
                </Input>
              </div>
            </div>
            <div className={styles.deliveryContainer}>
              <h3>Datos de entrega:</h3>
              <textarea
                name='deliveryData'
                value={fields.deliveryData ?? ''}
                className={styles.textArea}
              />
            </div>
          </div>

          <div className={styles.block}>
            <div className={styles.blockTitle}>
              <h3>Información del pedido: </h3>
            </div>
            <div className={styles.inputContainer}>
              <label>Comentarios para el Taller:</label>
              <textarea
                name='descriptionWork'
                className={styles.textArea}
                value={fields.descriptionWork ?? ''}
              />
            </div>
          </div>
          {fields.printTasks.map((info, index) => (
            <div
              className={`${styles.block} ${styles.blockPrintTask}`}
              key={index}
            >
              <div className={styles.contain}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <h2 className={styles.printTitle}>Módulo de impresión</h2>
                  <Input
                    name='sheetDescription'
                    value={info.sheetDescription || ''}
                    size='bigSize'
                    bold
                  >
                    Descripción del modulo:
                  </Input>
                </div>

                <Input
                  name='quantity'
                  value={info.quantity || ''}
                  size='mediumSize'
                >
                  Unidades:{' '}
                </Input>
                <Input
                  name='finalSize'
                  value={info.finalSize || ''}
                  size='mediumSize'
                >
                  Medida Final{' '}
                </Input>
                <Input
                  name='sizeWithMargins'
                  value={info.sizeWithMargins || ''}
                  size='mediumSize'
                >
                  Medida con márgenes
                </Input>

                <div
                  className={`${styles.selectContainer} ${styles.selectMaterialContainer}`}
                >
                  <label className={styles.label}>Material:</label>
                  <div className={styles.creatableSubstitute}>
                    {info?.material}
                  </div>
                </div>
                <div
                  className={`${styles.selectContainer} ${styles.smallNumberSelectContainer}`}
                >
                  <label className={styles.label}>Gramaje:</label>
                  <div className={styles.creatableSubstitute}>
                    {info?.grammage}
                  </div>
                </div>
                <div className={styles.selectContainer}>
                  <label className={styles.label}>Tam. hoja:</label>
                  <div className={styles.creatableSubstitute}>
                    {info?.bulkPaperSize}
                  </div>
                </div>
                <div className={styles.selectContainer}>
                  <label className={styles.label}>Pliego de impresión:</label>
                  <div className={styles.creatableSubstitute}>
                    {info?.sheetSize}
                  </div>
                </div>
                <Input
                  name='sheetPerBulkPaper'
                  value={info.sheetPerBulkPaper || ''}
                  size='numberSize'
                  isDisabled
                >
                  Pli. x Hoja:
                </Input>
                <Input
                  name='unitsPerSheet'
                  value={info.unitsPerSheet || ''}
                  size='numberSize'
                  isDisabled
                >
                  Unid. x Pli.:
                </Input>
                <Input
                  name='sheetQuantity'
                  size='mediumSize'
                  value={info.sheetQuantity || ''}
                  isDisabled
                >
                  Cant. Pli. de impresión:
                </Input>
                <Input
                  name='excess'
                  value={info.excess || ''}
                  size='numberSize'
                >
                  Demasía:
                </Input>
                <Input
                  name='bulkPaperQuantity'
                  value={info.bulkPaperQuantity || ''}
                  size='numberSize'
                  isDisabled
                >
                  Hojas:
                </Input>
              </div>
              <div
                className={`${styles.selectContainer} ${styles.selectMaterialContainer}`}
              >
                <label className={styles.label}>Maquina:</label>
                <div className={styles.creatableSubstitute}>
                  {info?.operation}
                </div>
              </div>
              <Input name='plates' value={info.plates || ''} size='numberSize'>
                Chapas:
              </Input>
              <div className={styles.lastItem}></div>
              <div
                className={styles.printFirstRow}
                style={{ alignItems: 'flex-end' }}
              >
                <div className={styles.tintasDiv}>
                  <h3>TINTAS</h3>
                  <div>
                    <label className={styles.label}>Frente:</label>
                    <textarea
                      className={styles.textArea}
                      name='front'
                      value={info.front || ''}
                    ></textarea>
                  </div>
                  <div>
                    <label className={styles.label}>Dorso:</label>
                    <textarea
                      className={styles.textArea}
                      name='back'
                      value={info.back || ''}
                    ></textarea>
                  </div>
                </div>
                <div className={styles.rightRow}>
                  <div className={styles.rightRowContainer}>
                    <Input
                      name='postures'
                      value={info.postures || ''}
                      size='numberSize'
                    >
                      Posturas:
                    </Input>
                    <Input
                      name='printRun'
                      value={info.printRun || ''}
                      size='priceSize'
                      isDisabled
                    >
                      Tiraje:
                    </Input>
                  </div>
                  <div className={styles.rightRowContainer}>
                    <Input
                      name='moduleRepeat'
                      value={info.moduleRepeat}
                      size='numberSize'
                    >
                      Repetir modulo:
                    </Input>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className={`${styles.block} ${styles.blockPrintTask}`}>
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
                    <td className={`${styles.td} ${styles.nameTd}`}>
                      {op.operation?.name}{' '}
                    </td>
                    <td>
                      <input
                        className={styles.input}
                        name='description'
                        value={op.description ?? ''}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.smallInput}
                        name='unitType'
                        value={op.operation?.unitType ?? ''}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        className={styles.smallInput}
                        name='quantity'
                        value={op?.quantity ?? ''}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkShopOrder;
