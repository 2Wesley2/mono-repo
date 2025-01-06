const validateProduct = ({ name, price, type, costPrice }) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid or missing product name.');
  }
  if (typeof price !== 'number' || price <= 0) {
    throw new Error('Price must be a positive number.');
  }
  if (!type || typeof type !== 'string') {
    throw new Error('Invalid or missing product type.');
  }
  if (typeof costPrice !== 'number' || costPrice < 0) {
    throw new Error('Cost price must be a non-negative number.');
  }
};

export default class Product {
  constructor({ name, price, type, costPrice }) {
    validateProduct({ name, price, type, costPrice });
    this.name = name;
    this.price = price;
    this.type = type;
    this.costPrice = costPrice;
  }
}
