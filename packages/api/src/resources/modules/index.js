import UserModel from './user/model/UserModel.js';
import UserRepository from './user/owner/OwnerUserRepository.js';

import OwnerUserModel from './user/owner/OwnerUserModel.js';

import FinancialRepository from './accounting/financial/FinancialRepository.js';
import FinancialService from './accounting/financial/FinancialService.js';
import FinancialModel from './accounting/financial/FinancialModel.js';
import GenerateFinancialReport from '../../core/use_cases/financial/GenerateFinancialReport.js';
import CalcRefModel from './calcRef/CalcRefModel.js';
import CalcRefRepository from './calcRef/CalcRefRepository.js';
import CalcRefService from './calcRef/CalcRefService.js';
import CalcRefController from './calcRef/CalcRefController.js';

import CustomerModel from './commercial/customer/CustomerModel.js';
import CustomerRepository from './commercial/customer/CustomerRepository.js';
import CustomerService from './commercial/customer/CustomerService.js';
import CustomerController from './commercial/customer/CustomerController.js';

import ProductModel from './logistics/product/ProductModel.js';
import ProductRepository from './logistics/product/ProductRepository.js';
import ProductService from './logistics/product/ProductService.js';
import ProductController from './logistics/product/ProductController.js';

import OrderModel from './order/OrderModel.js';
import OrderRepository from './order/OrderRepository.js';
import OrderService from './order/OrderService.js';
import OrderController from './order/OrderController.js';

import EmployeeModel from './humanResources/employee/EmployeeModel.js';
import EmployeeRepository from './humanResources/employee/EmployeeRepository.js';
import EmployeeService from './humanResources/employee/EmployeeService.js';
import EmployeeController from './humanResources/employee/EmployeeController.js';

import RewardModel from './reward/RewardModel.js';
import RewardRepository from './reward/RewardRepository.js';
import RewardService from './reward/RewardService.js';
import RewardController from './reward/RewardController.js';

const userModel = new UserModel();
const ownerUserModel = new OwnerUserModel();
const userRepository = new UserRepository(userModel);

const calcRefModel = new CalcRefModel();
const calcRefRepository = new CalcRefRepository(calcRefModel);
const calcRefService = new CalcRefService(calcRefRepository);
const calcRefController = new CalcRefController(calcRefService);

const rewardModel = new RewardModel();
const rewardRepository = new RewardRepository(rewardModel);
const rewardService = new RewardService(rewardRepository, calcRefModel);
const rewardController = new RewardController(rewardService);

const customerModel = new CustomerModel();
const customerRepository = new CustomerRepository(customerModel);
const customerService = new CustomerService(customerRepository, rewardModel);
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

export {
  customerController,
  employeeController,
  productController,
  orderController,
  rewardController,
  calcRefController,
};
