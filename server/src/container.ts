// Import UseCases
import {
  AddProductToOrderUseCase,
  CreateClientUseCase,
  CreateEmployeeUseCase,
  CreateOrderUseCase,
  CreateProductUseCase,
  DeleteClientUseCase,
  DeleteEmployeeUseCase,
  DeleteOrderUseCase,
  DeleteProductUseCase,
  DeleteProductFromOrderUseCase,
  GetClientByIdUseCase,
  GetClientsUseCase,
  GetEmployeeByIdUseCase,
  GetEmployeesUseCase,
  GetOrdersUseCase,
  GetProductsUseCase,
  UpdateClientUseCase,
  UpdateEmployeeUseCase,
  UpdateProductUseCase
} from './application';

// Import Models
import {
  ClientModel,
  EmployeeModel,
  OrderModel,
  OrderProductModel,
  ProductModel
} from './infrastructure';

// Import Repositories
import {
  ClientRepository,
  EmployeeRepository,
  OrderProductRepository,
  OrderRepository,
  ProductRepository
} from './infrastructure';

// Import ErrorHandlers
import {
  ControllerErrorHandler
} from './infrastructure';

// Import Controllers
import {
  AddProductToOrderController,
  CreateClientController,
  CreateEmployeeController,
  CreateOrderController,
  CreateProductController,
  DeleteClientController,
  DeleteEmployeeController,
  DeleteOrderController,
  DeleteProductController,
  DeleteProductFromOrderController,
  GetClientByIdController,
  GetClientsController,
  GetEmployeeByIdController,
  GetEmployeesController,
  GetOrdersController,
  GetProductsController,
  UpdateClientController,
  UpdateEmployeeController,
  UpdateProductController
} from './infrastructure';

// Repositories
const clientRepository = new ClientRepository(ClientModel);
const employeeRepository = new EmployeeRepository(EmployeeModel);
const orderProductRepository = new OrderProductRepository(OrderProductModel);
const orderRepository = new OrderRepository(OrderModel);
const productRepository = new ProductRepository(ProductModel);

// UseCases
const addProductToOrderUseCase = new AddProductToOrderUseCase({orderRepository, orderProductRepository, productRepository});
const createClientUseCase = new CreateClientUseCase({clientRepository});
const createEmployeeUseCase = new CreateEmployeeUseCase({employeeRepository});
const createOrderUseCase = new CreateOrderUseCase({clientRepository, orderRepository});
const createProductUseCase = new CreateProductUseCase({productRepository});
const deleteClientUseCase = new DeleteClientUseCase({clientRepository});
const deleteEmployeeUseCase = new DeleteEmployeeUseCase({employeeRepository});
const deleteOrderUseCase = new DeleteOrderUseCase({clientRepository, orderRepository});
const deleteProductUseCase = new DeleteProductUseCase({productRepository});
const deleteProductFromOrderUseCase = new DeleteProductFromOrderUseCase({orderProductRepository, orderRepository});
const getClientByIdUseCase = new GetClientByIdUseCase({clientRepository});
const getClientsUseCase = new GetClientsUseCase({clientRepository});
const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase({employeeRepository});
const getEmployeesUseCase = new GetEmployeesUseCase({employeeRepository});
const getOrdersUseCase = new GetOrdersUseCase({orderRepository});
const getProductsUseCase = new GetProductsUseCase({productRepository});
const updateClientUseCase = new UpdateClientUseCase({clientRepository});
const updateEmployeeUseCase = new UpdateEmployeeUseCase({employeeRepository});
const updateProductUseCase = new UpdateProductUseCase({productRepository});

// Error Handlers
const controllerErrorHandler = new ControllerErrorHandler();

// Controllers
const addProductToOrderController = new AddProductToOrderController({addProductToOrderUseCase, controllerErrorHandler});
const createClientController = new CreateClientController({createClientUseCase, controllerErrorHandler});
const createEmployeeController = new CreateEmployeeController({createEmployeeUseCase, controllerErrorHandler});
const createOrderController = new CreateOrderController({createOrderUseCase, controllerErrorHandler});
const createProductController = new CreateProductController({createProductUseCase, controllerErrorHandler});
const deleteClientController = new DeleteClientController({deleteClientUseCase, controllerErrorHandler});
const deleteEmployeeController = new DeleteEmployeeController({deleteEmployeeUseCase, controllerErrorHandler});
const deleteOrderController = new DeleteOrderController({deleteOrderUseCase, controllerErrorHandler});
const deleteProductController = new DeleteProductController({deleteProductUseCase, controllerErrorHandler});
const deleteProductFromOrderController = new DeleteProductFromOrderController({deleteProductFromOrderUseCase, controllerErrorHandler});
const getClientByIdController = new GetClientByIdController({getClientByIdUseCase, controllerErrorHandler});
const getClientsController = new GetClientsController({getClientsUseCase, controllerErrorHandler});
const getEmployeeByIdController = new GetEmployeeByIdController({getEmployeeByIdUseCase, controllerErrorHandler});
const getEmployeesController = new GetEmployeesController({getEmployeesUseCase, controllerErrorHandler});
const getOrdersController = new GetOrdersController({getOrdersUseCase, controllerErrorHandler});
const getProductsController = new GetProductsController({getProductsUseCase, controllerErrorHandler});
const updateClientController = new UpdateClientController({updateClientUseCase, controllerErrorHandler});
const updateEmployeeController = new UpdateEmployeeController({updateEmployeeUseCase, controllerErrorHandler});
const updateProductController = new UpdateProductController({updateProductUseCase, controllerErrorHandler});

export {
  addProductToOrderController,
  createClientController,
  createEmployeeController,
  createOrderController,
  createProductController,
  deleteClientController,
  deleteEmployeeController,
  deleteOrderController,
  deleteProductController,
  deleteProductFromOrderController,
  getClientByIdController,
  getClientsController,
  getEmployeeByIdController,
  getEmployeesController,
  getOrdersController,
  getProductsController,
  updateClientController,
  updateEmployeeController,
  updateProductController
};
