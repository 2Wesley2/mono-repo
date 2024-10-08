import Database from '../../../database/index.js';

const Product = Database.registerModel({
  schema: {
    name: {
      type: String,
      required: [true, 'O nome do produto é obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A descrição do produto é obrigatória'],
    },
    price: {
      type: Number,
      required: [true, 'O preço do produto é obrigatório'],
      min: [0, 'O preço não pode ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'A quantidade em estoque é obrigatória'],
      min: [0, 'O estoque não pode ser negativo'],
    },
    category: {
      type: String,
      required: [true, 'A categoria do produto é obrigatória'],
      index: true,
    },
  },
  modelName: 'Product',
  options: {
    timestamps: true,
    indexes: [{ fields: { name: 1, category: 1 }, options: { unique: true } }, { fields: { price: 1 } }],
  },
});

class ProductModel {
  async create(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error('Erro ao criar o produto: ' + error.message);
    }
  }

  findById(id) {
    return Product.findById(id);
  }

  findAll(filters = {}, options = {}) {
    return Product.find(filters, null, options);
  }

  async update(id, productData) {
    try {
      return await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error('Erro ao atualizar o produto: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Erro ao deletar o produto: ' + error.message);
    }
  }

  countProducts(filters) {
    return Product.countDocuments(filters);
  }
}

export default ProductModel;
