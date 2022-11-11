import { Client } from "../../../domain";
import { GetClientByIdDTO } from "./GetClientByIdDTO";
import { IClientRepository } from "../../repositories/IClientRepository";
import { ClientNoFoundException } from "../../exceptions/ClientNoFoundException";

type Response = Promise<Client>;

interface GetClientByIdUseCaseDeps {
  clientRepository: IClientRepository;
}

export class GetClientByIdUseCase {
  protected readonly clientRepository: IClientRepository;

  public constructor({clientRepository}: GetClientByIdUseCaseDeps) {
    this.clientRepository = clientRepository;
  }

  public execute = async (req: GetClientByIdDTO): Response => {
    const client = await this.clientRepository.findOne({id: req.clientId});
    const clientFound = !!client;

    if(!clientFound) {
      throw new ClientNoFoundException();
    }

    return client;
  }
}