import UserModel from './user/UserModel.js';
import UserRepository from './user/UserRepository.js';
import UserService from './user/UserService.js';
import UserController from './user/UserController.js';

import CustomerModel from './customer/CustomerModel.js';
import CustomerRepository from './customer/CustomerRepository.js';
import CustomerService from './customer/CustomerService.js';
import CustomerController from './customer/CustomerController.js';

import ProductModel from './product/ProductModel.js';
import ProductRepository from './product/ProductRepository.js';
import ProductService from './product/ProductService.js';
import ProductController from './product/ProductController.js';

import OrderModel from './order/OrderModel.js';
import OrderRepository from './order/OrderRepository.js';
import OrderService from './order/OrderService.js';
import OrderController from './order/OrderController.js';

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

import TierModel from './tier/TierModel.js';
import TierRepository from './tier/TierRepository.js';
import TierService from './tier/TierService.js';

import CashbackModel from './cashback/CashbackModel.js';
import CashbackRepository from './cashback/CashbackRepository.js';
import CashbackService from './cashback/CashbackService.js';
import CashbackController from './cashback/CashbackController.js';

import NotificationModel from './notification/NotificationModel.js';
import NotificationRepository from './notification/NotificationRepository.js';
import NotificationService from './notification/NotificationService.js';

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

const productModel = new ProductModel();
const productRepository = new ProductRepository(productModel);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const orderModel = new OrderModel();
const orderRepository = new OrderRepository(orderModel);
const orderService = new OrderService(orderRepository, productService);
const orderController = new OrderController(orderService);

const notificationModel = new NotificationModel();
const notificationRepository = new NotificationRepository(notificationModel);
const notificationService = new NotificationService(notificationRepository);

const employeeModel = new EmployeeModel();
const employeeRepository = new EmployeeRepository(employeeModel);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

const tierModel = new TierModel();
const tierRepository = new TierRepository(tierModel);
const tierService = new TierService(tierRepository);

const cashbackModel = new CashbackModel();
const cashbackRepository = new CashbackRepository(cashbackModel);
const cashbackService = new CashbackService(cashbackRepository, tierService);
const cashbackController = new CashbackController(cashbackService);

const salesModel = new SalesModel();
const salesRepository = new SalesRepository(salesModel);
const salesService = new SalesService(
  salesRepository,
  ticketService,
  customerRepository,
  notificationService,
  cashbackService,
);
const salesController = new SalesController(salesService);

export {
  userController,
  customerController,
  employeeController,
  salesController,
  ticketService,
  notificationService,
  cashbackController,
  productController,
  orderController,
};
