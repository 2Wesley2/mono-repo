import Database from '../../../database/index.js';

const Employee = Database.registerModel({
  schema: {
    name: {
      type: String,
      required: [true, 'O nome do funcionário é obrigatório'],
      trim: true,
    },
    number: {
      type: Number,
      required: [true, 'O número do funcionário é obrigatório'],
      min: [0, 'O número não pode ser negativo'],
    },
  },
  modelName: 'Employee',
  options: {
    timestamps: true,
  },
});

class EmployeeModel {
  async create(employeeData) {
    try {
      const employee = new Employee(employeeData);
      return await employee.save();
    } catch (error) {
      throw new Error('Erro ao criar o funcionário: ' + error.message);
    }
  }

  findById(id) {
    return Employee.findById(id);
  }

  findAll(filters = {}, options = {}) {
    return Employee.find(filters, null, options);
  }

  async update(id, employeeData) {
    try {
      return await Employee.findByIdAndUpdate(id, employeeData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error('Erro ao atualizar o funcionário: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await Employee.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Erro ao deletar o funcionário: ' + error.message);
    }
  }
}

export default EmployeeModel;
