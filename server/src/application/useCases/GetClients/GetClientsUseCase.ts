import { Client } from "../../../domain";
import { GetClientsDTO } from "./GetClientsDTO";
import { IClientRepository } from "../../repositories/IClientRepository";

type Response = Promise<Client[]>;

interface GetClientsUseCaseDeps {
  clientRepository: IClientRepository;
}

export class GetClientsUseCase {
  protected readonly clientRepository: IClientRepository;

  public constructor({clientRepository}: GetClientsUseCaseDeps) {
    this.clientRepository = clientRepository;
  }

  public execute = async (req: GetClientsDTO): Response => {
    const clients = await this.clientRepository.findMany({}, req.skip, req.limit);
    
    return clients;
  }  
}
