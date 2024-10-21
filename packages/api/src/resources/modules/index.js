import UserModel from './user/UserModel.js';
import UserRepository from './user/UserRepository.js';
import UserService from './user/UserService.js';
import UserController from './user/UserController.js';

import CustomerModel from './customer/CustomerModel.js';
import CustomerRepository from './customer/CustomerRepository.js';
import CustomerService from './customer/CustomerService.js';
import CustomerController from './customer/CustomerController.js';

import SalesModel from './sales/SalesModel.js';
import SalesRepository from './sales/SalesRepository.js';
import SalesService from './sales/SalesService.js';
import SalesController from './sales/SalesController.js';

import EmployeeModel from './employee/EmployeeModel.js';
import EmployeeRepository from './employee/EmployeeRepository.js';
import EmployeeService from './employee/EmployeeService.js';
import EmployeeController from './employee/EmployeeController.js';

import TicketModel from './ticket/TicketModel.js';
import TicketRepository from './ticket/TicketRepository.js';
import TicketService from './ticket/TicketService.js';

const userModel = new UserModel();
const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const ticketModel = new TicketModel();
const ticketRepository = new TicketRepository(ticketModel);
const ticketService = new TicketService(ticketRepository);

const customerModel = new CustomerModel();
const customerRepository = new CustomerRepository(customerModel);
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

const employeeModel = new EmployeeModel();
const employeeRepository = new EmployeeRepository(employeeModel);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

const salesModel = new SalesModel();
const salesRepository = new SalesRepository(salesModel);
const salesService = new SalesService(salesRepository, ticketService, customerRepository);
const salesController = new SalesController(salesService);

export { userController, customerController, employeeController, salesController };
