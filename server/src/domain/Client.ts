import { Result } from "./common/Result";
import { PersonName } from './PersonName';
import { PersonSurname } from './PersonSurname';
import { PersonDocument } from './PersonDocument';
import { AggregateRoot } from "./common/AggregateRoot";
import { PersonPhoneNumber } from "./PersonPhoneNumber";
import { CreatedClientEvent } from "./events/CreatedClientEvent";

interface ClientProps {
  name: PersonName;
  surname: PersonSurname;
  nroDocument: PersonDocument;
  phoneNumber: PersonPhoneNumber;
}

export class Client extends AggregateRoot<ClientProps> {
  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name.value;
  }

  public get surname(): string {
    return this.props.surname.value;
  }

  public get nroDocument(): string {
    return this.props.nroDocument.value;
  }

  public get phoneNumber(): string {
    return this.props.phoneNumber.value;
  }

  private constructor(props: ClientProps, id?: string) {
    super(props, id);
  }

  public static create = (props: ClientProps, id?: string): Result<Client> => {
    const client = new Client(props, id);

    // Si el id es null o undefined entonces el cliente es nuevo
    const isNewClient = !!id;

    if(isNewClient) {
      client.addDomainEvent(new CreatedClientEvent(client));
    }

    return Result.ok<Client>(client);
  }
}
