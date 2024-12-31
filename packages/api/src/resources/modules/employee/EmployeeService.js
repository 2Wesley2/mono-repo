import mongoose from 'mongoose';
import { InvalidRequestError, NotFoundError } from '../../../errors/Exceptions.js';

class EmployeeService {
  constructor(repository) {
    this.repository = repository;
  }

  validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new InvalidRequestError([{ field: 'id', message: 'ID de funcionário inválido.' }]);
    }
  }

  async createEmployee(employeeData) {
    return await this.repository.create(employeeData);
  }

  async getEmployeeById(id) {
    this.validateObjectId(id);

    const employee = await this.repository.findByIdEmployee(id);

    if (!employee) {
      throw new NotFoundError([{ field: 'id', message: 'Funcionário não encontrado.' }]);
    }

    return employee;
  }

  async getAllEmployees(filters = {}, options = {}) {
    return await this.repository.findAll(filters, options);
  }

  async updateEmployee(id, updateData) {
    this.validateObjectId(id);

    const updatedEmployee = await this.repository.update(id, updateData);

    if (!updatedEmployee) {
      throw new NotFoundError([{ field: 'id', message: 'Funcionário não encontrado para atualização.' }]);
    }

    return updatedEmployee;
  }

  async deleteEmployee(id) {
    this.validateObjectId(id);
    const deletedEmployee = await this.repository.delete(id);
    if (!deletedEmployee) {
      throw new NotFoundError([{ field: 'id', message: 'Funcionário não encontrado para remoção.' }]);
    }
    return;
  }
}

export default EmployeeService;
