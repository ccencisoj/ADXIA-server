export interface UpdateOrderDTO {
  orderId: string;
  clientId: string;
  deliveryAt: string;
  employeeToken: string;
  products: ({productId: string, quantity: number})[],
}
