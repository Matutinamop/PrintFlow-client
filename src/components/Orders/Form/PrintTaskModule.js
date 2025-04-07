import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import useCalculateFields from '../../../utilities/customHooks/forms/orderFields';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deepEqual } from '../../../utilities/functions/deepEqual';
import { selectStyles } from '../../../utilities/selectStyles/selectStyles';
import Modal from '../../shared/Modal';
import MaterialsForm from '../../Resources/Materials/MaterialsForm';
import { toFormatNumber } from '../../../utilities/functions/costCalculator';

function PrintTaskModule({
  fields,
  setFields,
  formErrors,
  module,
  info,
  index,
  deleteModule,
  quickMaterial,
  setMaterialModalOpen,
  setMaterialModalFields,
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [manualChanges, setManualChanges] = useState({
    totalCost: false,
  });

  useEffect(() => {
    setFields((prev) => {
      const updatedPrintTasks = [...prev.printTasks];
      updatedPrintTasks[index].selectedOptions = selectedOptions;

      return { ...prev, printTasks: updatedPrintTasks };
    });
  }, [selectedOptions]);

  const handleManualChange = (e) => {
    setManualChanges((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const genericOptions = [
    { value: '59.4x84.1', label: '59.4x84.1' },
    { value: '42x59.4', label: '42x59.4' },
    { value: '29.7x42', label: '29.7x42' },
    { value: '21x29.7', label: '21x29.7' },
    { value: '50x70.7', label: '50x70.7' },
    { value: '35.3x50', label: '35.3x50' },
    { value: '25x35.3', label: '25x35.3' },
    { value: '17.6x25', label: '17.6x25' },
    { value: '22.9x32.4', label: '22.9x32.4' },
    { value: '16.2x22.9', label: '16.2x22.9' },
    { value: '21.6x27.9', label: '21.6x27.9' },
    { value: '21.6x35.6', label: '21.6x35.6' },
    { value: '27.9x43.2', label: '27.9x43.2' },
  ];

  const changeValue = (e) => {
    const name = e.target.name;
    setFields((prev) => {
      const updatedPrintTasks = [...prev.printTasks];
      updatedPrintTasks[index][name] = e.target.value;

      return { ...prev, printTasks: updatedPrintTasks };
    });
  };

  useCalculateFields(fields, index, setFields, manualChanges, quickMaterial);

  const selectMaterial = (option, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      setMaterialModalFields({
        name: option.label,
      });
      return setMaterialModalOpen(true);
    }
    setFields((prev) => {
      const updatedPrintTasks = [...prev.printTasks];
      updatedPrintTasks[index]['material'] = option.value;
      return {
        ...prev,
        printTasks: updatedPrintTasks,
      };
    });
    setSelectedOptions((prev) => ({
      ...prev,
      material: {
        label: option.label,
        value: option.value,
      },
    }));
  };

  const checkError = (fieldName) => {
    return formErrors.some(
      (err) =>
        err.path.includes(fieldName) &&
        err.path.includes('printTasks') &&
        err.path.includes(index)
    );
  };

  return (
    <div className={`${styles.block} ${styles.blockPrintTask}`}>
      <div className={styles.closePrintTask}>
        <Button
          variant='outlined'
          color='error'
          size='small'
          startIcon={<DeleteIcon />}
          onClick={() => deleteModule(index)}
        >
          Borrar
        </Button>
      </div>

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
            onChange={(e) => changeValue(e)}
            value={info.sheetDescription || ''}
            size='bigSize'
            bold
          >
            Descripción del modulo:
          </Input>
        </div>

        <Input
          name='quantity'
          onChange={(e) => changeValue(e)}
          value={info.quantity || ''}
          size='mediumSize'
          error={checkError('quantity')}
        >
          Unidades:{' '}
        </Input>
        <Input
          name='finalSize'
          onChange={(e) => changeValue(e)}
          value={info.finalSize || ''}
          size='mediumSize'
          error={checkError('finalSize')}
        >
          Medida Final{' '}
        </Input>
        <Input
          name='sizeWithMargins'
          onChange={(e) => changeValue(e)}
          value={info.sizeWithMargins || ''}
          size='mediumSize'
          error={checkError('sizeWithMargins')}
        >
          Medida con márgenes
        </Input>

        <div
          className={`${styles.selectContainer} ${styles.selectMaterialContainer}`}
        >
          <label className={styles.label}>Material:</label>
          <CreatableSelect
            styles={selectStyles}
            name='material'
            value={
              info?.materialOptions && Array.isArray(info.materialOptions)
                ? info.materialOptions.find(
                    (material) => material.value === info?.material
                  ) ?? {
                    label: info?.material,
                    value: info?.material,
                  }
                : {
                    label: info?.material,
                    value: info?.material,
                  }
            }
            onChange={(option, actionMeta) => {
              selectMaterial(option, actionMeta);
            }}
            options={info.materialOptions}
            placeholder={''}
          />
        </div>
        <div
          className={`${styles.selectContainer} ${styles.smallNumberSelectContainer}`}
        >
          <label className={styles.label}>Gramaje:</label>
          <CreatableSelect
            styles={selectStyles}
            name='grammage'
            value={
              info?.grammageOptions && Array.isArray(info.grammageOptions)
                ? info.grammageOptions.find(
                    (grammage) => grammage.value === info?.grammage
                  ) ?? {
                    label: info?.grammage,
                    value: info?.grammage,
                  }
                : {
                    label: info?.grammage,
                    value: info?.grammage,
                  }
            }
            onChange={(option) => {
              setFields((prev) => {
                const updatedPrintTasks = [...prev.printTasks];
                updatedPrintTasks[index]['grammage'] = option.value;
                return {
                  ...prev,
                  printTasks: updatedPrintTasks,
                };
              });
              setSelectedOptions((prev) => ({
                ...prev,
                grammage: {
                  label: option.label,
                  value: option.label,
                },
              }));
            }}
            options={info.grammageOptions}
            placeholder={''}
          />
        </div>
        <div className={styles.selectContainer}>
          <label className={styles.label}>Tam. hoja:</label>
          <CreatableSelect
            styles={selectStyles}
            name='bulkPaperSize'
            value={
              info?.sizeMaterialOptions &&
              Array.isArray(info.sizeMaterialOptions)
                ? info.sizeMaterialOptions.find(
                    (size) => size.value === info?.bulkPaperSize
                  ) ?? {
                    label: info?.bulkPaperSize,
                    value: info?.bulkPaperSize,
                  }
                : {
                    label: info?.bulkPaperSize,
                    value: info?.bulkPaperSize,
                  }
            }
            onChange={(option) => {
              setFields((prev) => {
                const updatedPrintTasks = [...prev.printTasks];
                updatedPrintTasks[index]['bulkPaperSize'] = option.value;
                return {
                  ...prev,
                  printTasks: updatedPrintTasks,
                };
              });
              setSelectedOptions((prev) => ({
                ...prev,
                bulkPaperSize: {
                  label: option.label,
                  value: option.label,
                },
              }));
            }}
            options={info.sizeMaterialOptions}
            placeholder={''}
          />
        </div>
        <div className={styles.selectContainer}>
          <label className={styles.label}>Pliego de impresión:</label>
          <CreatableSelect
            styles={selectStyles}
            name='sheetSize'
            value={
              genericOptions && Array.isArray(genericOptions)
                ? genericOptions.find(
                    (size) => size.value === info?.sheetSize
                  ) ?? {
                    label: info?.sheetSize,
                    value: info?.sheetSize,
                  }
                : {
                    label: info?.sheetSize,
                    value: info?.sheetSize,
                  }
            }
            onChange={(option) => {
              setFields((prev) => {
                const updatedPrintTasks = [...prev.printTasks];
                updatedPrintTasks[index]['sheetSize'] = option.value;
                return {
                  ...prev,
                  printTasks: updatedPrintTasks,
                };
              });
              setSelectedOptions((prev) => ({
                ...prev,
                sheetSize: {
                  label: option.label,
                  value: option.label,
                },
              }));
            }}
            options={genericOptions}
            placeholder={''}
          />
        </div>
        <Input
          name='sheetPerBulkPaper'
          onChange={(e) => changeValue(e)}
          value={info.sheetPerBulkPaper || ''}
          size='numberSize'
          isDisabled
        >
          Pli. x Hoja:
        </Input>
        <Input
          name='unitsPerSheet'
          onChange={(e) => changeValue(e)}
          value={info.unitsPerSheet || ''}
          size='numberSize'
          isDisabled
        >
          Unid. x Pli.:
        </Input>
        <Input
          name='sheetQuantity'
          size='mediumSize'
          onChange={(e) => changeValue(e)}
          value={info.sheetQuantity || ''}
          isDisabled
        >
          Cant. Pli. de impresión:
        </Input>
        <Input
          name='excess'
          onChange={(e) => changeValue(e)}
          value={info.excess || ''}
          size='numberSize'
          error={checkError('excess')}
        >
          Demasía:
        </Input>
        <Input
          name='bulkPaperQuantity'
          onChange={(e) => changeValue(e)}
          value={info.bulkPaperQuantity || ''}
          size='numberSize'
          isDisabled
        >
          Hojas:
        </Input>
        <Input
          name='costPerBulkPaper'
          onChange={(e) => changeValue(e)}
          value={`$ ${toFormatNumber(info.costPerBulkPaper) || ''}`}
          size='mediumSize'
          isDisabled
        >
          Costo x hoja:
        </Input>
        <div className={styles.lastItem}>
          <Input
            name='paperCost'
            onChange={(e) => changeValue(e)}
            value={`$ ${toFormatNumber(info.paperCost) || ''}`}
            size='priceSize'
            isDisabled
          >
            Costo papel:
          </Input>
        </div>
        <div
          className={`${styles.selectContainer} ${styles.selectMaterialContainer}`}
        >
          <label className={styles.label}>Maquina:</label>
          <CreatableSelect
            styles={selectStyles}
            name='operation'
            menuPortalTarget={document.body}
            value={
              info.operationOptions && Array.isArray(info.operationOptions)
                ? info.operationOptions.find(
                    (station) => station.value === info?.operation
                  ) ?? {
                    label: info?.operation,
                    value: info?.operation,
                  }
                : {
                    label: info?.operation,
                    value: info?.operation,
                  }
            }
            onChange={(option) => {
              setFields((prev) => {
                const updatedPrintTasks = [...prev.printTasks];
                updatedPrintTasks[index]['operation'] = option.value;
                return {
                  ...prev,
                  printTasks: updatedPrintTasks,
                };
              });
              setSelectedOptions((prev) => ({
                ...prev,
                operation: {
                  label: option.label,
                  value: option.value,
                },
              }));
            }}
            options={info.operationOptions}
            placeholder={''}
          />
        </div>
        <Input
          name='plates'
          onChange={(e) => changeValue(e)}
          value={info.plates || ''}
          size='numberSize'
          error={checkError('plates')}
        >
          Chapas:
        </Input>
        <div className={styles.lastItem}>
          <Input
            name='plateCost'
            onChange={(e) => changeValue(e)}
            value={`$ ${info.plateCost ? toFormatNumber(info.plateCost) : '0'}`}
            isDisabled
            size='priceSize'
          >
            Costo chapas:
          </Input>
        </div>
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
                onChange={(e) => changeValue(e)}
                value={info.front || ''}
              ></textarea>
            </div>
            <div>
              <label className={styles.label}>Dorso:</label>
              <textarea
                className={styles.textArea}
                name='back'
                onChange={(e) => changeValue(e)}
                value={info.back || ''}
              ></textarea>
            </div>
          </div>
          <div className={styles.rightRow}>
            <div className={styles.rightRowContainer}>
              <Input
                name='postures'
                onChange={(e) => changeValue(e)}
                value={info.postures || ''}
                size='numberSize'
                error={checkError('postures')}
              >
                Posturas:
              </Input>
              <Input
                name='printRun'
                onChange={(e) => changeValue(e)}
                value={info.printRun || ''}
                size='priceSize'
                isDisabled
              >
                Tiraje:
              </Input>
              <Input
                name='postureCost'
                onChange={(e) => changeValue(e)}
                value={`$ ${toFormatNumber(info.postureCost) || ''}`}
                size='priceSize'
                isDisabled
              >
                Costo Postura:
              </Input>
            </div>
            <div className={styles.rightRowContainer}>
              <Input
                name='moduleRepeat'
                onChange={(e) => changeValue(e)}
                value={info.moduleRepeat}
                size='numberSize'
                error={checkError('moduleRepeat')}
              >
                Repetir modulo:
              </Input>
              <Input
                name='totalCost'
                onChange={(e) => {
                  changeValue(e);
                  handleManualChange(e);
                }}
                value={`$ ${toFormatNumber(info.totalCost) || ''}`}
                size='priceSize'
                isDisabled
              >
                Costo modulo:
              </Input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintTaskModule;
