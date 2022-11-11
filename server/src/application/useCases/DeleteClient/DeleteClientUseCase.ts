import { DeleteClientDTO } from './DeleteClientDTO';
import { DeletedClientEvent, DomainEvents } from '../../../domain';
import { IClientRepository } from '../../repositories/IClientRepository';
import { ClientNoFoundException } from '../../exceptions/ClientNoFoundException';

type Response = Promise<void>;

interface DeleteClientUseCaseDeps {
  clientRepository: IClientRepository;
}

export class DeleteClientUseCase {
  protected readonly clientRepository: IClientRepository;

  public constructor({clientRepository}: DeleteClientUseCaseDeps) {
    this.clientRepository = clientRepository;
  }

  public execute = async (req: DeleteClientDTO): Response => {
    const client = await this.clientRepository.findOne({id: req.clientId});
    const clientFound = !!client;

    if(!clientFound) {
      throw new ClientNoFoundException();
    }

    await this.clientRepository.delete(client);

    client.addDomainEvent(new DeletedClientEvent(client));

    DomainEvents.dispatchEvents(client);
  }
}
