import { DeleteClientDTO } from './DeleteClientDTO';
import { IClientRepository } from '../../repositories/IClientRepository';
import { IEmployeeTokenService } from '../../services/IEmployeeTokenService';
import { ClientNoFoundException } from '../../exceptions/ClientNoFoundException';
import { DeletedClientEvent, DomainEvents, EmployeeType } from '../../../domain';
import { EmployeeCredentialsException } from '../../exceptions/EmployeeCredentialsException';
import { EmployeeActionNoAllowedException } from '../../exceptions/EmployeeActionNoAllowedException';

type Response = Promise<void>;

interface DeleteClientUseCaseDeps {
  clientRepository: IClientRepository;
  employeeTokenService: IEmployeeTokenService;
}

export class DeleteClientUseCase {
  protected readonly clientRepository: IClientRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;

  public constructor({
    clientRepository,
    employeeTokenService
  }: DeleteClientUseCaseDeps) {
    this.clientRepository = clientRepository;
    this.employeeTokenService = employeeTokenService;
  }

  public execute = async (req: DeleteClientDTO): Response => {
    const decodedEmployeeOrError = this.employeeTokenService.decode(req.employeeToken);

    if(decodedEmployeeOrError.isFailure) {
      throw new EmployeeCredentialsException(decodedEmployeeOrError.getError() as string);
    }

    const decodedEmployee = decodedEmployeeOrError.getValue();

    if(!(decodedEmployee.type === EmployeeType.ADMIN ||
      decodedEmployee.type === EmployeeType.VENDOR)) {
      throw new EmployeeActionNoAllowedException();
    }

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
