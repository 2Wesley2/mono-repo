import UserModel from '../model/UserModel.js';
import { EMPLOYEE_USER, BUSINESS, ROLE } from '#resources/collections/index.js';

const employeeUserSchema = {
  name: { type: String, required: true },
  businessID: { type: UserModel.objectIdType, ref: BUSINESS, required: true },
  role: { type: UserModel.objectIdType, ref: ROLE, required: true },
};

export default class EmployeeUserModel extends UserModel {
  constructor() {
    super(employeeUserSchema, EMPLOYEE_USER);
  }
}
