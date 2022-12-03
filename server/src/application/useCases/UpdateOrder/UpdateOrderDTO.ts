export interface UpdateOrderDTO {
  orderId: string;
  clientId: string;
  productIds: string[];
  deliveryAt: string;
  employeeToken: string;
}
