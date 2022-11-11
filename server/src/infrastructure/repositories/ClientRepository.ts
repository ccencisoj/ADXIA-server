import { Model } from 'mongoose';
import { Client } from '../../domain';
import { IClientRepository } from "../../application";
import { ClientMapper } from '../mappers/ClientMapper';

export class ClientRepository implements IClientRepository {
  protected readonly model: Model<any>;

  public constructor(model: Model<any>) {
    this.model = model;
  }

  public findOne = async (filter: any): Promise<Client> => {
    const repoClient = await this.model.findOne(filter);    
    const client = repoClient ? ClientMapper.toDomain(repoClient) : null;
    return client;
  }

  public findMany = async (filter: any, skip: number, limit: number): Promise<Client[]> => {
    const repoClients = await this.model.find(filter).skip(skip).limit(limit);
    const clients = repoClients.map((repoClient)=> ClientMapper.toDomain(repoClient));
    return clients;
  }

  public save = async (client: Client): Promise<void> => {
    const exists = await this.existsById(client.id);
    const repoClient = ClientMapper.toPersistence(client);

    if(exists) {
      await this.model.updateOne({id: repoClient.id}, repoClient);
    }else {
      await this.model.create(repoClient);
    }
  }

  public delete = async (client: Client): Promise<void> => {
    await this.model.deleteOne({id: client.id}); 
  }

  public existsById = async (entityId: string): Promise<boolean> => {
    const repoClient = await this.model.findOne({id: entityId});
    const exists = !!repoClient ? true : false;
    return exists;
  }
}
