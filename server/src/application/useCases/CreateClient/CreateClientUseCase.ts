import { CreateClientDTO } from './CreateClientDTO';
import { ClientException } from '../../exceptions/ClientException';
import { IClientRepository } from "../../repositories/IClientRepository";
import { ValidationException } from '../../exceptions/ValidationException';
import { ClientAlreadyRegisteredException } from '../../exceptions/ClientAlreadyRegisteredException';
import { 
  Client, 
  Result, 
  DomainEvents,
  PersonName, 
  PersonSurname, 
  PersonDocument, 
  PersonPhoneNumber  
} from '../../../domain';

type Response = Promise<Client>;

interface CreateClientUseCaseDeps {
  clientRepository: IClientRepository;
}

export class CreateClientUseCase {
  protected readonly clientRepository: IClientRepository;

  public constructor({clientRepository}: CreateClientUseCaseDeps) {
    this.clientRepository = clientRepository;
  }

  public execute = async (req: CreateClientDTO): Response => {
    const client = await this.clientRepository.findOne({
      nroDocument: req.nroDocument
    });
    const alreadyRegistered = !!client;

    if(alreadyRegistered) {
      throw new ClientAlreadyRegisteredException(client);
    }

    console.log(req);

    const nameOrError = PersonName.create(req.name);
    const surnameOrError = PersonSurname.create(req.surname);
    const nroDocumentOrError = PersonDocument.create(req.nroDocument);
    const phoneNumberOrError = PersonPhoneNumber.create(req.phoneNumber);
    const combinedResult = Result.combine([
      nameOrError, 
      surnameOrError,
      nroDocumentOrError,
      phoneNumberOrError
    ]);

    if(combinedResult.isFailure) {
      throw new ValidationException(combinedResult.getError() as string);
    }

    const newClientOrError = Client.create({
      name: nameOrError.getValue(),
      surname: surnameOrError.getValue(),
      nroDocument: nroDocumentOrError.getValue(),
      phoneNumber: phoneNumberOrError.getValue()
    });

    if(newClientOrError.isFailure) {
      throw new ClientException(newClientOrError.getError() as string);
    }

    const newClient = newClientOrError.getValue();

    await this.clientRepository.save(newClient);

    DomainEvents.dispatchEvents(newClient);

    return newClient;
  }
}
