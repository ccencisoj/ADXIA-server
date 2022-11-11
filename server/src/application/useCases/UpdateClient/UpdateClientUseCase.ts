import { UpdateClientDTO } from "./UpdateClientDTO";
import { ClientException } from "../../exceptions/ClientException";
import { IClientRepository } from "../../repositories/IClientRepository";
import { ValidationException } from "../../exceptions/ValidationException";
import { ClientNoFoundException } from "../../exceptions/ClientNoFoundException";
import { 
  Client, 
  Result,
  PersonName, 
  PersonSurname, 
  PersonDocument, 
  PersonPhoneNumber,
  UpdatedClientEvent,
  DomainEvents
} from "../../../domain";

type Response = Promise<void>;

interface UpdateClientUseCaseDeps {
  clientRepository: IClientRepository;
}

export class UpdateClientUseCase {
  protected readonly clientRepository: IClientRepository;

  public constructor({clientRepository}: UpdateClientUseCaseDeps) {
    this.clientRepository = clientRepository;
  }

  public execute = async (req: UpdateClientDTO): Response => {
    const client = await this.clientRepository.findOne({id: req.clientId});
    const clientFound = !!client;

    if(!clientFound) {
      throw new ClientNoFoundException();
    }

    const nameOrError = PersonName.create(req.name || client.name);
    const surnameOrError = PersonSurname.create(req.surname || client.surname);
    const nroDocumentOrError = PersonDocument.create(req.nroDocument || client.nroDocument);
    const phoneNumberOrError = PersonPhoneNumber.create(req.phoneNumber || client.phoneNumber);
    const combineResult = Result.combine([
      nameOrError,
      surnameOrError,
      nroDocumentOrError,
      phoneNumberOrError
    ]);

    if(combineResult.isFailure) {
      throw new ValidationException(combineResult.getError() as string);
    }

    const updatedClientOrError = Client.create({
      name: nameOrError.getValue(),
      surname: surnameOrError.getValue(),
      nroDocument: nroDocumentOrError.getValue(),
      phoneNumber: phoneNumberOrError.getValue()
    }, client.id);

    if(updatedClientOrError.isFailure) {
      throw new ClientException(updatedClientOrError.getError() as string);
    }

    const updatedClient = updatedClientOrError.getValue();

    await this.clientRepository.save(updatedClient);

    updatedClient.addDomainEvent(new UpdatedClientEvent(updatedClient));

    DomainEvents.dispatchEvents(updatedClient);
  }
}
