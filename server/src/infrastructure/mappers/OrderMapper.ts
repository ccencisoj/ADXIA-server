import { DateTime, Order } from "../../domain";

type OrderRaw = {
  id: string;
  employeeId: string;
  clientId: string,
  createdAt: string;
  deliveredAt: string;
};

export class OrderMapper {
  public static toJSON = (order: Order): any => {
    return {
      id: order.id,
      clientId: order.clientId,
      employeeId: order.employeeId,
      createdAt: order.createdAt.value,
      deliveredAt: order.deliveredAt?.value
    }
  }

  public static toPersistence = (order: Order): any => {
    return {
      id: order.id,
      clientId: order.clientId,
      employeeId: order.employeeId,
      createdAt: order.createdAt.value,
      deliveredAt: order.deliveredAt?.value
    }
  }

  public static toDomain = (raw: OrderRaw): Order => {
    const createdAtOrError = DateTime.create(raw.createdAt);
    const deliveredAt = DateTime.create(raw.deliveredAt);
    const orderOrError = Order.create({
      clientId: raw.clientId,
      employeeId: raw.employeeId,
      createdAt: createdAtOrError.getValue(),
      deliveredAt: deliveredAt.getValue()
    }, raw.id);
    const order = orderOrError.getValue();
    return order;
  }
}
