import UserModel from '../model/UserModel.js';
import { EMPLOYEE, OWNER, ROLE } from '#resources/collections/index.js';
import employee from '#src/core/entities/domain/employee/Employee.js';
import { UnauthorizedError, InvalidRequestError } from '#src/errors/Exceptions.js';

const employeeUserSchema = {
  ownerID: { type: UserModel.objectIdType, ref: OWNER, required: true },
  role: { type: UserModel.objectIdType, ref: ROLE, required: true, default: EMPLOYEE },
};

export default class EmployeeUserModel extends UserModel {
  constructor(schema = {}, modelName = EMPLOYEE, options = {}, middlewares = []) {
    const combinedSchema = { ...employeeUserSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async assignRoleToEmployee(ownerId, employeeId, roleId) {
    const db = this.model.db;
    const roleExists = await db.collection(ROLE).findOne({ _id: roleId, ownerId });
    if (!roleExists) {
      throw new Error('O Role não pertence a este Owner.');
    }
    const pipeline = employee.getEmployeeValidationPipeline(employeeId, ownerId);
    const employeeWithRole = await db.collection(EMPLOYEE).aggregate(pipeline).toArray();
    if (!employeeWithRole.length) {
      throw new Error('Employee não encontrado ou não pertence ao Owner.');
    }
    const updatePayload = employee.createRoleUpdatePayload(roleId);
    const updatedEmployee = await db
      .collection(EMPLOYEE)
      .findOneAndUpdate({ _id: employeeId }, updatePayload, { returnDocument: 'after' });

    return updatedEmployee.value;
  }

  async signUp(employeeData, ownerId) {
    const ownerExists = await this.model.db.collection(OWNER).findOne({ _id: ownerId });
    if (!ownerExists) {
      throw new InvalidRequestError('Owner não encontrado para associar o Employee.');
    }

    const dataToSave = { ...employeeData, ownerId, role: EMPLOYEE };

    return await super.signUp(dataToSave);
  }

  async getEmployeesByOwner(ownerId) {
    return await this.model.find({ ownerId }).lean();
  }

  async login(credentials) {
    const userLoggedIn = await super.login(credentials);
    if (!userLoggedIn) {
      throw new UnauthorizedError();
    }
    return {
      name: userLoggedIn.name,
      email: userLoggedIn.email,
      role: userLoggedIn.role,
    };
  }
}
