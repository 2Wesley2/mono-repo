import UserModel from '../model/UserModel.js';
import { EMPLOYEE_USER } from '../../../collections/index.js';

const employeeUserSchema = {};

export default class EmployeeUserModel extends UserModel {
  constructor() {
    super(employeeUserSchema, EMPLOYEE_USER);
  }
}
