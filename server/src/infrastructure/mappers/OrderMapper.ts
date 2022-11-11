import { DateTime, Order } from "../../domain";

type OrderRaw = {
  id: string;
  clientId: string,
  createdAt: string;
};

export class OrderMapper {
  public static toJSON = (order: Order): any => {
    return {
      id: order.id,
      clientId: order.clientId,
      createdAt: order.createdAt.value
    }
  }

  public static toPersistence = (order: Order): any => {
    return {
      id: order.id,
      clientId: order.clientId,
      createdAt: order.createdAt.value
    }
  }

  public static toDomain = (raw: OrderRaw): Order => {
    const createdAtOrError = DateTime.create(raw.createdAt);
    const orderOrError = Order.create({
      clientId: raw.clientId,
      createdAt: createdAtOrError.getValue()
    }, raw.id);
    const order = orderOrError.getValue();
    return order;
  }
}
