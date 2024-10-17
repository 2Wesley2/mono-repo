import Database from '../../../database/index.js';

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

const Employee = Database.registerModel({
  schema: employeeSchema,
  modelName: 'Employee',
});

class EmployeeModel {
  constructor() {
    this.employeeModel = Employee;
  }
  async create(data) {
    try {
      const employee = this.employeeModel(data);
      return await employee.save();
    } catch (error) {
      throw new Error('Erro ao criar o funcionário: ' + error.message);
    }
  }

  async findById(id) {
    try {
      return await this.employeeModel.findById(id);
    } catch (error) {
      throw new Error('Erro ao buscar o funcionário: ' + error.message);
    }
  }

  async findAll(filters = {}, options = {}) {
    try {
      return await this.employeeModel.find(filters, null, options);
    } catch (error) {
      throw new Error('Erro ao buscar funcionários: ' + error.message);
    }
  }

  async update(id, data) {
    try {
      return await this.employeeModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error('Erro ao atualizar o funcionário: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await this.employeeModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Erro ao deletar o funcionário: ' + error.message);
    }
  }
}

export default EmployeeModel;
