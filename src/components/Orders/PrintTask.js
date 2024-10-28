import React, { useState } from 'react';
import styles from './orders.module.css';
import { Input } from '../shared/Inputs';
import calculateItemInArea from '../../utilities/functions/calculateItemInArea';

function PrintTask() {
  const [fields, setFields] = useState({
    /* bulkPaperSize: '0x0',
    finalSize: '0x0',
    sheetSize: '0x0', */
  });

  const changeValue = (e) => {
    setFields((prevFields) => ({
      ...prevFields,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <div className={styles.block}>
        <Input name='quantity' onChange={(e) => changeValue(e)} size='adjusted'>
          Unidades:{' '}
        </Input>
        <Input
          name='finalSize'
          onChange={(e) => changeValue(e)}
          size='adjusted'
        >
          Medida Final:
        </Input>
        <Input name='material' onChange={(e) => changeValue(e)} size='normal'>
          Material:{' '}
        </Input>
        <Input name='grammage' onChange={(e) => changeValue(e)} size='adjusted'>
          Gramaje:{' '}
        </Input>
        <Input
          name='bulkPaperSize'
          onChange={(e) => changeValue(e)}
          size='adjusted'
        >
          Tam. hoja:{' '}
        </Input>
        <Input
          name='sheetSize'
          onChange={(e) => changeValue(e)}
          size='adjusted'
        >
          Tam. Pli.:{' '}
        </Input>
        <Input
          name='sheetPerBulkPaper'
          onChange={(e) => changeValue(e)}
          value={calculateItemInArea(fields.bulkPaperSize, fields.sheetSize)}
          size='adjusted'
        >
          Pli. x Hoja:
        </Input>
        <Input
          name='unitsPerSheet'
          onChange={(e) => changeValue(e)}
          value={calculateItemInArea(fields.sheetSize, fields.finalSize)}
          size='adjusted'
        >
          Unid. x Pli.:
        </Input>
        <Input size='adjusted'>Cant. Pli.:</Input>
        <Input size='adjusted'>Demasía:</Input>
        <Input size='adjusted'>Costo x hoja:</Input>
        <Input size='adjusted' isDisabled>
          Hojas:
        </Input>
        <Input size='adjusted' isDisabled>
          Costo Papel:
        </Input>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
          }}
        >
          <p
            style={{
              alignSelf: 'end',
              width: '190px',
            }}
          >
            Tintas
          </p>
          <Input size='adjusted'>Chapas:</Input>
          <Input size='adjusted'>Cant.:</Input>
          <Input size='adjusted'>Costo Unit.:</Input>
          <Input size='adjusted' isDisabled>
            Costo Chapa:
          </Input>
        </div>
        <Input size='adjusted'>Frente:</Input>
        <Input size='adjusted'>Dorso:</Input>
        <Input size='adjusted'>Posturas:</Input>
        <Input size='adjusted'>Imp. y Ret.:</Input>
        <Input size='adjusted'>Tiraje:</Input>
        <Input size='adjusted'>Costo Postura:</Input>
        <Input size='adjusted' isDisabled>
          Costo Tinta:
        </Input>
        <Input size='normal'>Descripción del pliego:</Input>
        <Input size='normal'>Repetir costo del pliego:</Input>
        <Input size='adjusted' isDisabled>
          Costo Total:
        </Input>
      </div>
    </div>
  );
}

export default PrintTask;
