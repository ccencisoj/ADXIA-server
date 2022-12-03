// Import UseCases
import {
  CreateClientUseCase,
  CreateEmployeeUseCase,
  CreateOrderUseCase,
  CreateProductUseCase,
  DeleteClientUseCase,
  DeleteEmployeeUseCase,
  DeleteOrderUseCase,
  DeleteProductUseCase,
  GetClientByIdUseCase,
  GetClientsUseCase,
  GetEmployeeByIdUseCase,
  GetEmployeesUseCase,
  GetOrdersUseCase,
  GetProductsUseCase,
  UpdateClientUseCase,
  UpdateEmployeeUseCase,
  UpdateProductUseCase,
  SaveTempImageUseCase,
  GetTempImageByIdUseCase,
  UpdateOrderUseCase,
  GetOrderProductsUseCase,
  LoginEmployeeUseCase
} from './application';

// Import Models
import {
  ClientModel,
  EmployeeModel,
  OrderModel,
  OrderProductModel,
  ProductModel,
  TempImageModel
} from './infrastructure';

// Import Repositories
import {
  ClientRepository,
  EmployeeRepository,
  OrderProductRepository,
  OrderRepository,
  ProductRepository,
  TempImageRepository
} from './infrastructure';

// Import services
import {
  ImageService,
  HashService,
  EmployeeTokenService
} from './infrastructure'

// Import ErrorHandlers
import {
  ControllerErrorHandler
} from './infrastructure';

// Import Middlewares
import {
  UploadImageMiddleware
} from './infrastructure';

// Import Controllers
import {
  CreateClientController,
  CreateEmployeeController,
  CreateOrderController,
  CreateProductController,
  DeleteClientController,
  DeleteEmployeeController,
  DeleteOrderController,
  DeleteProductController,
  GetClientByIdController,
  GetClientsController,
  GetEmployeeByIdController,
  GetEmployeesController,
  GetOrdersController,
  GetProductsController,
  UpdateClientController,
  UpdateEmployeeController,
  UpdateProductController,
  SaveTempImageController,
  GetTempImageByIdController,
  UpdateOrderController,
  GetOrderProductsController,
  LoginEmployeeController
} from './infrastructure';

// Repositories
const clientRepository = new ClientRepository(ClientModel);
const employeeRepository = new EmployeeRepository(EmployeeModel);
const orderProductRepository = new OrderProductRepository(OrderProductModel);
const orderRepository = new OrderRepository(OrderModel);
const productRepository = new ProductRepository(ProductModel);
const tempImageRepository = new TempImageRepository(TempImageModel);

// Services
const imageService = new ImageService({tempImageRepository});
const hashService = new HashService();
const employeeTokenService = new EmployeeTokenService();

// Middlewares
const uploadImageMiddleware = new UploadImageMiddleware();

// UseCases
const createClientUseCase = new CreateClientUseCase({clientRepository});
const createEmployeeUseCase = new CreateEmployeeUseCase({employeeRepository, hashService});
const createOrderUseCase = new CreateOrderUseCase({clientRepository, orderRepository});
const createProductUseCase = new CreateProductUseCase({productRepository});
const deleteClientUseCase = new DeleteClientUseCase({clientRepository});
const deleteEmployeeUseCase = new DeleteEmployeeUseCase({employeeRepository});
const deleteOrderUseCase = new DeleteOrderUseCase({clientRepository, orderRepository});
const deleteProductUseCase = new DeleteProductUseCase({productRepository});
const getClientByIdUseCase = new GetClientByIdUseCase({clientRepository});
const getClientsUseCase = new GetClientsUseCase({clientRepository});
const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase({employeeRepository});
const getEmployeesUseCase = new GetEmployeesUseCase({employeeRepository});
const getOrdersUseCase = new GetOrdersUseCase({orderRepository});
const getProductsUseCase = new GetProductsUseCase({productRepository});
const updateClientUseCase = new UpdateClientUseCase({clientRepository});
const updateEmployeeUseCase = new UpdateEmployeeUseCase({employeeRepository, hashService});
const updateProductUseCase = new UpdateProductUseCase({productRepository});
const saveTempImageUseCase = new SaveTempImageUseCase({imageService});
const getTempImageByIdUseCase = new GetTempImageByIdUseCase({imageService});
const updateOrderUseCase = new UpdateOrderUseCase({orderRepository, orderProductRepository, productRepository});
const getOrderProductsUseCase = new GetOrderProductsUseCase({orderRepository, orderProductRepository});
const loginEmployeeUseCase = new LoginEmployeeUseCase({employeeRepository, hashService, employeeTokenService});

// Error Handlers
const controllerErrorHandler = new ControllerErrorHandler();

// Controllers
const createClientController = new CreateClientController({createClientUseCase, controllerErrorHandler});
const createEmployeeController = new CreateEmployeeController({createEmployeeUseCase, controllerErrorHandler});
const createOrderController = new CreateOrderController({createOrderUseCase, controllerErrorHandler});
const createProductController = new CreateProductController({createProductUseCase, controllerErrorHandler});
const deleteClientController = new DeleteClientController({deleteClientUseCase, controllerErrorHandler});
const deleteEmployeeController = new DeleteEmployeeController({deleteEmployeeUseCase, controllerErrorHandler});
const deleteOrderController = new DeleteOrderController({deleteOrderUseCase, controllerErrorHandler});
const deleteProductController = new DeleteProductController({deleteProductUseCase, controllerErrorHandler});
const getClientByIdController = new GetClientByIdController({getClientByIdUseCase, controllerErrorHandler});
const getClientsController = new GetClientsController({getClientsUseCase, controllerErrorHandler});
const getEmployeeByIdController = new GetEmployeeByIdController({getEmployeeByIdUseCase, controllerErrorHandler});
const getEmployeesController = new GetEmployeesController({getEmployeesUseCase, controllerErrorHandler});
const getOrdersController = new GetOrdersController({getOrdersUseCase, controllerErrorHandler});
const getProductsController = new GetProductsController({getProductsUseCase, controllerErrorHandler});
const updateClientController = new UpdateClientController({updateClientUseCase, controllerErrorHandler});
const updateEmployeeController = new UpdateEmployeeController({updateEmployeeUseCase, controllerErrorHandler});
const updateProductController = new UpdateProductController({updateProductUseCase, controllerErrorHandler});
const saveTempImageController = new SaveTempImageController({saveTempImageUseCase, controllerErrorHandler});
const getTempImageByIdController = new GetTempImageByIdController({getTempImageByIdUseCase, controllerErrorHandler});
const updateOrderController = new UpdateOrderController({updateOrderUseCase, controllerErrorHandler});
const getOrderProductsController = new GetOrderProductsController({getOrderProductsUseCase, controllerErrorHandler});
const loginEmployeeController = new LoginEmployeeController({loginEmployeeUseCase, controllerErrorHandler});

export {
  createClientController,
  createEmployeeController,
  createOrderController,
  createProductController,
  deleteClientController,
  deleteEmployeeController,
  deleteOrderController,
  deleteProductController,
  getClientByIdController,
  getClientsController,
  getEmployeeByIdController,
  getEmployeesController,
  getOrdersController,
  getProductsController,
  updateClientController,
  updateEmployeeController,
  updateProductController,
  saveTempImageController,
  getTempImageByIdController,
  uploadImageMiddleware,
  updateOrderController,
  getOrderProductsController,
  loginEmployeeController
};
