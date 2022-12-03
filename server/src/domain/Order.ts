import { DateTime } from "./DateTime";
import { Result } from "./common/Result";
import { AggregateRoot } from "./common/AggregateRoot";
import { CreatedOrderEvent } from "./events/CreatedOrderEvent";

interface OrderProps {
  clientId?: string,
  employeeId: string;
  createdAt: DateTime;
  deliveredAt?: DateTime;
}

export class Order extends AggregateRoot<OrderProps> {
  public get id(): string {
    return this._id;
  }

  public get clientId(): string {
    return this.props.clientId;
  }

  public get employeeId(): string {
    return this.props.employeeId;
  }

  public get createdAt(): DateTime {
    return this.props.createdAt;
  }

  public get deliveredAt(): DateTime {
    return this.props.deliveredAt;
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
