import { DateTime } from "./DateTime";
import { Result } from "./common/Result";
import { AggregateRoot } from "./common/AggregateRoot";
import { CreatedOrderEvent } from "./events/CreatedOrderEvent";

interface OrderProps {
  clientId: string,
  createdAt: DateTime;
}

export class Order extends AggregateRoot<OrderProps> {
  public get id(): string {
    return this._id;
  }

  public get clientId(): string {
    return this.props.clientId;
  }

  public get createdAt(): DateTime {
    return this.props.createdAt;
  }

  private constructor(props: OrderProps, id?: string) {
    super(props, id);
  }

  public static create = (props: OrderProps, id?: string): Result<Order> => {
    const order = new Order(props, id);

    // Si el id es null o undefined entonces la peticion es nueva
    const isNewOrder = !!id;

    if(isNewOrder) {
      order.addDomainEvent(new CreatedOrderEvent(order));
    }

    return Result.ok<Order>(order);
  }
}
