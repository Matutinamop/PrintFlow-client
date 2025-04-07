import Joi from 'joi';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const sizeRegex = /^\d{1,5}([.,]\d+)?\s*[xX]\s*\d{1,5}([.,]\d+)?$/;
const numbersRegex = /^\d+(\.\d+)?$/;
const priceRegex = /^\$\d+(\.\d+)?$/;

export const printTaskModuleSchema = Joi.object({
  sheetDescription: Joi.string().max(80).allow('').messages({
    'any.required': 'El campo "Descripción del modulo" es obligatorio',
  }),
  quantity: Joi.string().pattern(numbersRegex).allow('').messages({
    'string.pattern.base': '"Unidades" debe ser un numero',
    'any.required': 'El campo "Unidades" es obligatorio',
  }),
  finalSize: Joi.string().pattern(sizeRegex).allow('').messages({
    'string.pattern.base': 'Formato erróneo para "Medida final" ej: 25x10',
    'any.required': 'El campo "Medida final" es obligatorio',
  }),
  sizeWithMargins: Joi.string().pattern(sizeRegex).allow('').messages({
    'string.pattern.base':
      'Formato erróneo para "Medida con margenes" ej: 25x10',
    'any.required': 'El campo "Medida con margenes" es obligatorio',
  }),
  material: Joi.string().allow('').messages({
    'any.required': 'El campo "Material" es obligatorio',
  }),
  grammage: Joi.string().allow('').messages({
    'any.required': 'El campo "Gramaje" es obligatorio',
  }),
  bulkPaperSize: Joi.string().pattern(sizeRegex).allow('').messages({
    'string.pattern.base': 'Formato erróneo para "Tam. hoja" ej: 25x10',
    'any.required': 'El campo "Tam. hoja" es obligatorio',
  }),
  sheetSize: Joi.string().pattern(sizeRegex).allow('').messages({
    'string.pattern.base':
      'Formato erróneo para "Pliego de impresión" ej: 25x10',
    'any.required': 'El campo "Pliego de impresión" es obligatorio',
  }),
  sheetPerBulkPaper: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(numbersRegex).allow('0'))
    .allow(''),
  unitsPerSheet: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(numbersRegex).allow('0'))
    .allow(''),
  sheetQuantity: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(numbersRegex).allow('0'))
    .allow(''),
  excess: Joi.string().pattern(numbersRegex).allow('').messages({
    'string.pattern.base': '"Demasía" debe ser un numero',
    'any.required': 'El campo "Demasía" es obligatorio',
  }),
  bulkPaperQuantity: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(numbersRegex).allow('0'))
    .allow(''),
  paperCost: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(priceRegex).allow('0'))
    .allow(''),
  operation: Joi.string().allow('').messages({
    'any.required': 'El campo "Máquina" es obligatorio',
  }),
  plates: Joi.string().pattern(numbersRegex).allow('').messages({
    'string.pattern.base': '"Chapas" debe ser un numero',
    'any.required': 'El campo "Chapas" es obligatorio',
  }),
  plateCost: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(priceRegex).allow('0'))
    .allow('')
    .optional(),
  front: Joi.string().allow(''),
  back: Joi.string().allow(''),
  postures: Joi.string().pattern(numbersRegex).allow('').messages({
    'string.pattern.base': '"Posturas" debe ser un numero',
    'any.required': 'El campo "Posturas" es obligatorio',
  }),
  printRun: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(numbersRegex).allow('0'))
    .allow(''),
  postureCost: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(priceRegex).allow('0'))
    .allow(''),
  moduleRepeat: Joi.string().pattern(numbersRegex).allow(1).messages({
    'string.pattern.base': '"Repetir modulo" debe ser un numero',
    'any.required': 'El campo "Repetir modulo" es obligatorio',
  }),
  totalCost: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(priceRegex).allow('0'))
    .allow(''),
  id: Joi.any().optional(),
  selectedOptions: Joi.any().optional(),
  operationOptions: Joi.any().optional(),
  estimatedCost: Joi.any().optional(),
  grammageOptions: Joi.any().optional(),
  sizeMaterialOptions: Joi.any().optional(),
  materialOptions: Joi.any().optional(),
  printCost: Joi.any().optional(),
  costPerBulkPaper: Joi.any().optional(),
});

const otherTaskModuleSchema = Joi.object({
  operation: Joi.object(),
  description: Joi.string().allow(''),
  unitType: Joi.string().allow(''),
  quantity: Joi.alternatives()
    .try(Joi.number().min(0), Joi.string().pattern(numbersRegex).allow('0'))
    .messages({
      'string.pattern.base': '"Cantidad" debe ser un numero',
    }),
  estimatedCost: Joi.any().optional(),
  cost: Joi.any().optional(),
});

export const orderSchema = Joi.object({
  orderNumber: Joi.number().required(),
  status: Joi.string(),
  product: Joi.string().required().messages({
    'any.required': 'El campo "Familia" es obligatorio',
  }),
  dateEstimate: Joi.date().required().messages({
    'any.required': 'El campo "Fecha estimada" es obligatorio',
  }),
  dateFinal: Joi.date().greater(Joi.ref('dateEstimate')).messages({
    'date.greater': 'La fecha final debe ser posterior a la fecha estimada',
  }),
  client: Joi.object().required().messages({
    'any.required': 'Es necesario seleccionar un cliente',
    'object.base': 'Es necesario seleccionar un cliente',
  }),
  contactName: Joi.string().allow('').max(20).messages({
    'any.required': 'Es necesario seleccionar un nombre de contacto',
  }),
  contactPhone: Joi.string().pattern(numbersRegex).allow('').messages({
    'any.required': 'Es necesario seleccionar un numero de contacto',
  }),
  contactEmail: Joi.string().pattern(emailRegex),
  deliveryData: Joi.string(),
  descriptionClient: Joi.string(),
  descriptionWork: Joi.string(),
  descriptionPrivate: Joi.string(),
  printTasks: Joi.array().items(printTaskModuleSchema),
  otherTasks: Joi.array().items(otherTaskModuleSchema),
  deviation: Joi.number(),
  estimatedFinalPrice: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().pattern(numbersRegex).allow('0')
  ),
  finalPrice: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().pattern(numbersRegex).allow('0')
  ),
  scheme: Joi.object().unknown().optional(),
});
