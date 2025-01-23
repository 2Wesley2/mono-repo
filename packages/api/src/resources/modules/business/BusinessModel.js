import Model from '../../../core/infrastructure/components/base/Model.js';
import { BUSINESS, OWNER_USER, SALE, STOCK } from '../../collections/index.js';
import loaders from '../../../core/loaders/index.js';

const businessModels = [
  'B2B (Business to Business)',
  'B2C (Business to Consumer)',
  'C2C (Consumer to Consumer)',
  'C2B (Consumer to Business)',
  'D2C (Direct to Consumer)',
];

const industrySectors = [
  'Franchise',
  'Dropshipping',
  'E-commerce',
  'Marketplace',
  'Professional Services',
  'Consulting',
  'Education and Training',
  'Health and Wellness',
  'Technology and Software',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Finance and Insurance',
  'Entertainment and Media',
  'Agribusiness',
  'Logistics and Transportation',
  'Tourism and Hospitality',
  'Energy and Sustainability',
  'Food and Beverage',
  'Construction',
  'Automotive',
  'Aerospace',
  'Pharmaceuticals',
  'Textiles and Apparel',
  'Mining and Metals',
  'Chemical Industry',
  'Petrochemical Industry',
  'Telecommunications',
  'Biotechnology',
  'Environmental Services',
  'Defense and Security',
];

const businessSchema = {
  ownerUserID: { type: Model.objectIdType, ref: OWNER_USER, required: true, unique: true },
  tradeName: { type: String, required: true },
  legalName: { type: String, required: true, unique: true },
  businessModel: { type: String, enum: [...businessModels], required: true },
  industrySectors: { type: String, enum: [...industrySectors], required: true },
  sales: [{ type: Model.objectIdType, ref: SALE, required: true }],
  stock: { type: Model.objectIdType, ref: STOCK, required: true },
};

export default class BusinessModel extends Model {
  constructor() {
    super(businessSchema, BUSINESS);
  }
}
