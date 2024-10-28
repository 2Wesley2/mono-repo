import { CUSTOMER } from '../../constants/index.js';
import Model from '../../core/Model.js';

const employeeSchema = {
  name: {
    type: String,
    required: [true, 'O nome do funcionário é obrigatório'],
    trim: true,
  },
  number: {
    type: Number,
    required: [true, 'O número do funcionário é obrigatório'],
  },
};

class EmployeeModel extends Model {
  constructor() {
    super(employeeSchema, CUSTOMER);
  }

  async create(data) {
    try {
      const employee = this.model.create(data);
      return await employee.save();
    } catch (error) {
      throw new Error('Erro ao criar o funcionário: ' + error.message);
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error('Erro ao buscar o funcionário: ' + error.message);
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      return await this.model.find(filters, null, options);
    } catch (error) {
      throw new Error('Erro ao buscar funcionários: ' + error.message);
    }
  }

  async update(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error('Erro ao atualizar o funcionário: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Erro ao deletar o funcionário: ' + error.message);
    }
  }
}

export default EmployeeModel;
