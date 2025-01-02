import PermissionModel from './rbac/permission/PermissionModel.js';
import RoleModel from './rbac/role/RoleModel.js';
import RoleService from './rbac/role/RoleModel.js';

import UserModel from './user/UserModel.js';
import UserRepository from './user/UserRepository.js';
import UserService from './user/UserService.js';
import UserController from './user/UserController.js';

import CalcRefModel from './calcRef/CalcRefModel.js';
import CalcRefRepository from './calcRef/CalcRefRepository.js';
import CalcRefService from './calcRef/CalcRefService.js';
import CalcRefController from './calcRef/CalcRefController.js';

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

import EmployeeModel from './employee/EmployeeModel.js';
import EmployeeRepository from './employee/EmployeeRepository.js';
import EmployeeService from './employee/EmployeeService.js';
import EmployeeController from './employee/EmployeeController.js';

import RewardModel from './reward/RewardModel.js';
import RewardRepository from './reward/RewardRepository.js';
import RewardService from './reward/RewardService.js';
import RewardController from './reward/RewardController.js';

import NotificationModel from './notification/NotificationModel.js';
import NotificationRepository from './notification/NotificationRepository.js';
import NotificationService from './notification/NotificationService.js';

const permissionModel = new PermissionModel();
const roleModel = new RoleModel();
const roleService = new RoleService(roleModel);

const userModel = new UserModel();
const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

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

const notificationModel = new NotificationModel();
const notificationRepository = new NotificationRepository(notificationModel);
const notificationService = new NotificationService(notificationRepository);

const employeeModel = new EmployeeModel();
const employeeRepository = new EmployeeRepository(employeeModel);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

export {
  userController,
  customerController,
  employeeController,
  notificationService,
  productController,
  orderController,
  rewardController,
  calcRefController,
  userService,
  roleService,
};
