import ProductModel from './products/ProductModel.js';
import ProductRepository from './products/ProductRepository.js';
import ProductService from './products/ProductService.js';
import ProductController from './products/ProductController.js';
//import OrderModel from './orders/OrderModel.js';
//import OrderRepository from './orders/OrderRepository.js';
//import OrderService from './orders/OrderService.js';
//import OrderController from './orders/OrderController.js';
//import PaymentModel from './payments/PaymentModel.js';
//import PaymentRepository from './payments/PaymentRepository.js';
//import PaymentService from './payments/PaymentService.js';
//import PaymentController from './payments/PaymentController.js';
import CustomerModel from './customer/CustomerModel.js';
import CustomerRepository from './customer/CustomerRepository.js';
import CustomerService from './customer/CustomerService.js';
import CustomerController from './customer/CustomerController.js';

import CashbackModel from './cashback/CashbackModel.js';
import CashbackRepository from './cashback/CashbackRepository.js';
import CashbackService from './cashback/CashbackService.js';
import CashbackController from './cashback/CashbackController.js';

import EmployeeModel from './employee/EmployeeModel.js';
import EmployeeRepository from './employee/EmployeeRepository.js';
import EmployeeService from './employee/EmployeeService.js';
import EmployeeController from './employee/EmployeeController.js';

const productModel = new ProductModel();
const productRepository = new ProductRepository(productModel);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

//const orderModel = new OrderModel();
//const orderRepository = new OrderRepository(orderModel);
//const orderService = new OrderService(orderRepository);
//const orderController = new OrderController(orderService);

//const paymentModel = new PaymentModel();
//const paymentRepository = new PaymentRepository(paymentModel);
//const paymentService = new PaymentService(paymentRepository);
//const paymentController = new PaymentController(paymentService);

const customerModel = new CustomerModel();
const customerRepository = new CustomerRepository(customerModel);
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

const cashbackModel = new CashbackModel();
const cashbackRepository = new CashbackRepository(cashbackModel);
const cashbackService = new CashbackService(cashbackRepository, customerRepository);
const cashbackController = new CashbackController(cashbackService);

const employeeModel = new EmployeeModel();
const employeeRepository = new EmployeeRepository(employeeModel);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

export {
  productController,
  //orderController,
  //paymentController,
  customerController,
  cashbackController,
  employeeController,
};
