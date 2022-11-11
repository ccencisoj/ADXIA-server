import {
  Client, 
  PersonName, 
  PersonSurname, 
  PersonDocument, 
  PersonPhoneNumber 
} from "../../domain";

type ClientRaw = {
  id: string;
  name: string;
  surname: string;
  nroDocument: string;
  phoneNumber: string;
};

export class ClientMapper {
  public static toJSON = (client: Client): any => {
    return {
      id: client.id,
      name: client.name,
      surname: client.surname,
      nroDocument: client.nroDocument,
      phoneNumber: client.phoneNumber
    }
  }

  public static toPersistence = (client: Client): any => {
    return {
      id: client.id,
      name: client.name,
      surname: client.surname,
      nroDocument: client.nroDocument,
      phoneNumber: client.phoneNumber
    }
  }

  public static toDomain = (raw: ClientRaw): Client => {
    const nameOrError = PersonName.create(raw.name);
    const surnameOrError = PersonSurname.create(raw.surname);
    const nroDocumentOrError = PersonDocument.create(raw.nroDocument);
    const phoneNumberOrError = PersonPhoneNumber.create(raw.phoneNumber);
    const clientOrError = Client.create({
      name: nameOrError.getValue(),
      surname: surnameOrError.getValue(),
      nroDocument: nroDocumentOrError.getValue(),
      phoneNumber: phoneNumberOrError.getValue()
    }, raw.id);
    const client = clientOrError.getValue();
    return client;
  }
}
