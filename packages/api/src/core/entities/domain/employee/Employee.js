class Employee {
  static getEmployeeValidationPipeline(employeeId, ownerId) {
    return [
      { $match: { _id: employeeId, ownerID: ownerId } },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roleDetails'
        }
      }
    ];
  }

  static createRoleUpdatePayload(roleId) {
    return { $set: { role: roleId, updatedAt: new Date() } };
  }
}

export default {
  getEmployeeValidationPipeline: (...args) => Employee.getEmployeeValidationPipeline(...args),
  createRoleUpdatePayload: (...args) => Employee.createRoleUpdatePayload(...args)
};
