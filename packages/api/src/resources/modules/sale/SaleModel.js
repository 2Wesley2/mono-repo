import Model from '../../components/Model.js';
import { SALE, POS_SALE, ONLINE_SALE } from '../../collections/index.js';
import loaders from '../../../loaders/index.js';

const validSalesTypes = [POS_SALE, ONLINE_SALE];
const isValid = (value) => validSalesTypes.includes(value);

const saleSchema = {
  salesType: {
    type: {
      type: loaders.mongoose.getObjectId(),
      required: true,
      validate: {
        validator: async (salesType) => {
          return isValid(salesType);
        },
        message: (props) => `${props.value} is not a valid sales type!`,
      },
    },
  },
  items: {
    type: [
      {
        type: loaders.mongoose.getObjectId(),
        ref: 'Product',
        required: true,
      },
    ],
    required: true,
  },
};

// Middleware para ser executado antes de salvar o documento
const preSaveMiddleware = async function (next) {
  if (!this.salesType || !isValid(this.salesType)) {
    throw new Error('Invalid sales type.');
  }
  // Outros processamentos podem ser adicionados aqui
  console.log('Pre-save middleware executed for sale:', this);
  next();
};

export default class SaleModel extends Model {
  constructor() {
    super(saleSchema, SALE, {}, [{ type: 'pre', event: 'save', fn: preSaveMiddleware }]);
  }
}
