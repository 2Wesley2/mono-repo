import ProductModel from './products/ProductModel.js';
import ProductRepository from './products/ProductRepository.js';
import ProductService from './products/ProductService.js';
import ProductController from './products/ProductController.js';
// import OrderModel from './orders/OrderModel.js';
// import OrderRepository from './orders/OrderRepository.js';
// import OrderService from './orders/OrderService.js';
// import OrderController from './orders/OrderController.js';
// import PaymentModel from './payments/PaymentModel.js';
// import PaymentRepository from './payments/PaymentRepository.js';
// import PaymentService from './payments/PaymentService.js';
// import PaymentController from './payments/PaymentController.js';
import CustomerModel from './customer/CustomerModel.js';
import CustomerRepository from './customer/CustomerRepository.js';
import CustomerService from './customer/CustomerService.js';
import CustomerController from './customer/CustomerController.js';

import CashbackModel from './cashback/CashbackModel.js';
import CashbackRepository from './cashback/CashbackRepository.js';
import CashbackService from './cashback/CashbackService.js';

import VoucherModel from './voucher/VoucherModel.js';
import VoucherRepository from './voucher/VoucherRepository.js';
import VoucherService from './voucher/VoucherService.js';

import SaleModel from './sales/SalesModel.js';
import SaleRepository from './sales/SalesRepository.js';
import SaleService from './sales/SalesService.js';
import SaleController from './sales/SalesController.js';

import EmployeeModel from './employee/EmployeeModel.js';
import EmployeeRepository from './employee/EmployeeRepository.js';
import EmployeeService from './employee/EmployeeService.js';
import EmployeeController from './employee/EmployeeController.js';

// Iniciação do módulo de Product
const productModel = new ProductModel();
const productRepository = new ProductRepository(productModel);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Iniciação do módulo de Customer
const customerModel = new CustomerModel();
const customerRepository = new CustomerRepository(customerModel);
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

// Iniciação do módulo de Cashback com Vouchers
const cashbackModel = new CashbackModel();
const cashbackRepository = new CashbackRepository(cashbackModel);
const voucherModel = new VoucherModel();
const voucherRepository = new VoucherRepository(voucherModel);
const voucherService = new VoucherService(voucherRepository);
const cashbackService = new CashbackService(cashbackRepository, voucherService);

// Iniciação do módulo de Sales com Cashback
const saleModel = new SaleModel();
const saleRepository = new SaleRepository(saleModel);
const saleService = new SaleService(saleRepository, cashbackService);
const saleController = new SaleController(saleService);

// Iniciação do módulo de Employee
const employeeModel = new EmployeeModel();
const employeeRepository = new EmployeeRepository(employeeModel);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

export {
  productController,
  // orderController,
  // paymentController,
  customerController,
  saleController,
  employeeController,
};
