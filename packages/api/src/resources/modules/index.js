import OwnerUserModel from './account/user/owner/OwnerUserModel.js';
import OwnerUserRepository from './account/user/owner/OwnerUserRepository.js';
import OwnerUserService from './account/user/owner/OwnerUserService.js';
import OwnerUserController from './account/user/owner/OwnerUserController.js';

import CustomerModel from './commercial/customer/CustomerModel.js';
import CustomerRepository from './commercial/customer/CustomerRepository.js';
import CustomerService from './commercial/customer/CustomerService.js';
import CustomerController from './commercial/customer/CustomerController.js';

import ProductModel from './logistics/product/ProductModel.js';
import ProductRepository from './logistics/product/ProductRepository.js';
import ProductService from './logistics/product/ProductService.js';
import ProductController from './logistics/product/ProductController.js';

import OrderModel from './commercial/bill/BillModel.js';
import OrderRepository from './commercial/bill/BillRepository.js';
import OrderService from './commercial/bill/BillService.js';
import OrderController from './commercial/bill/BillController.js';

import EmployeeModel from './humanResources/employee/EmployeeModel.js';
import EmployeeRepository from './humanResources/employee/EmployeeRepository.js';
import EmployeeService from './humanResources/employee/EmployeeService.js';
import EmployeeController from './humanResources/employee/EmployeeController.js';

const ownerUserModel = new OwnerUserModel();
const ownerUserRepository = new OwnerUserRepository(ownerUserModel);
const ownerUserService = new OwnerUserService(ownerUserRepository);
const ownerUserController = new OwnerUserController(ownerUserService);

const customerModel = new CustomerModel();
const customerRepository = new CustomerRepository(customerModel);
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

const productModel = new ProductModel();
const productRepository = new ProductRepository(productModel);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const orderModel = new OrderModel();
const orderRepository = new OrderRepository(orderModel);
const orderService = new OrderService(orderRepository, productService);
const orderController = new OrderController(orderService);

const employeeModel = new EmployeeModel();
const employeeRepository = new EmployeeRepository(employeeModel);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

//const genereteFinancialReport = new GenerateFinancialReport();
//const useCases = {
// financial: { reportFinancialMetrics: (...args) => genereteFinancialReport.reportFinancialMetrics(...args) },
//};
//const financialModel = new FinancialModel();
//const financialRepository = new FinancialRepository(financialModel);
//const financialService = new FinancialService(financialRepository, useCases.financial);

export { customerController, employeeController, productController, orderController, ownerUserController };
