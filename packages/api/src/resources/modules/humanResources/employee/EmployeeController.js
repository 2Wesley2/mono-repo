import Controller from '../../../../core/infrastructure/components/base/Controller.js';

class EmployeeController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAllEmployees.bind(this));
    this.router.post('/', this.createEmployee.bind(this));
    this.router.get('/:id', this.getEmployeeById.bind(this));
    this.router.put('/:id', this.updateEmployee.bind(this));
    this.router.delete('/:id', this.deleteEmployee.bind(this));
  }

  async getAllEmployees(req, res, next) {
    try {
      const employees = await this.service.getAllEmployees(req.query);
      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const employee = await this.service.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const employee = await this.service.getEmployeeById(req.params.id);
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const updatedEmployee = await this.service.updateEmployee(req.params.id, req.body);
      res.json(updatedEmployee);
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      await this.service.deleteEmployee(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeController;
