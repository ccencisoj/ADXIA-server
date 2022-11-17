// @ts-nocheck
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { config } from './infrastructure';
import {
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
} from './container';

const PORT = config.PORT;
const MONGO_URI = config.MONGO_URI;

(async ()=> {
  const server = express();

  // Middlewares
  server.use(cors());
  server.use(express.json());

  // Order Routes
  server.get("/orders", getOrdersController.execute);
  server.post("/order", createOrderController.execute);
  server.delete("/order", deleteOrderController.execute);
  server.post("/order/product", addProductToOrderController.execute);
  server.delete("/order/product", deleteProductFromOrderController.execute);

  // Employee Routes
  server.get("/employee", getEmployeeByIdController.execute);
  server.get("/employees", getEmployeesController.execute);
  server.post("/employee", createEmployeeController.execute);
  server.delete("/employee", deleteEmployeeController.execute);
  server.put("/employee", updateEmployeeController.execute);

  // Client Routes
  server.get("/client", getClientByIdController.execute);
  server.get("/clients", getClientsController.execute);
  server.post("/client", createClientController.execute);
  server.delete("/client", deleteClientController.execute);
  server.put("/client", updateClientController.execute);

  // Product Routes
  server.get("/products", getProductsController.execute);
  server.post("/product", createProductController.execute);
  server.delete("/product", deleteProductController.execute);
  server.put("/product", updateProductController.execute);

  // Database connection
  await mongoose.connect(MONGO_URI);

  server.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`);
  });
})();
