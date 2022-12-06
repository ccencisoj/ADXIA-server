// @ts-nocheck
import cors from 'cors';
import mongoose from 'mongoose';
import express, { Router } from 'express';
import { config } from './infrastructure';
import {
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
  loginEmployeeController,
  getCurrentEmployeeController
} from './container';

const PORT = config.PORT;
const MONGO_URI = config.MONGO_URI;

(async ()=> {
  const server = express();

  const apiRouter = Router();

  // Middlewares
  server.use(cors());
  server.use(express.json());

  // Order Routes
  apiRouter.get(getOrdersController.route, getOrdersController.execute);

  apiRouter.post(createOrderController.route, createOrderController.execute);
  apiRouter.delete(deleteOrderController.route, deleteOrderController.execute);
  apiRouter.put(updateOrderController.route, updateOrderController.execute);
  apiRouter.get(getOrderProductsController.route, getOrderProductsController.execute);

  // Employee Routes
  apiRouter.get(getEmployeeByIdController.route, getEmployeeByIdController.execute);
  apiRouter.get(getEmployeesController.route, getEmployeesController.execute);
  apiRouter.post(createEmployeeController.route, createEmployeeController.execute);
  apiRouter.delete(deleteEmployeeController.route, deleteEmployeeController.execute);
  apiRouter.put(updateEmployeeController.route, updateEmployeeController.execute);
  apiRouter.post(loginEmployeeController.route, loginEmployeeController.execute);
  apiRouter.get(getCurrentEmployeeController.route, getCurrentEmployeeController.execute);
  
  // Client Routes
  apiRouter.get(getClientByIdController.route, getClientByIdController.execute);
  apiRouter.get(getClientsController.route, getClientsController.execute);
  apiRouter.post(createClientController.route, createClientController.execute);
  apiRouter.delete(deleteClientController.route, deleteClientController.execute);
  apiRouter.put(updateClientController.route, updateClientController.execute);

  // Product Routes
  apiRouter.get(getProductsController.route, getProductsController.execute);
  apiRouter.post(createProductController.route, createProductController.execute);
  apiRouter.delete(deleteProductController.route, deleteProductController.execute);
  apiRouter.put(updateProductController.route, updateProductController.execute);

  // Image routes
  apiRouter.post(saveTempImageController.route, uploadImageMiddleware.execute, saveTempImageController.execute);
  apiRouter.get(getTempImageByIdController.route, getTempImageByIdController.execute);

  server.use("/api", apiRouter);

  // Database connection
  await mongoose.connect(MONGO_URI);

  server.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`);
  });
})();
