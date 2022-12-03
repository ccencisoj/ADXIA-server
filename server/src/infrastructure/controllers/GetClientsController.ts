import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ClientMapper } from "../mappers/ClientMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  GetClientsDTO, 
  GetClientsUseCase
} from "../../application";

interface GetClientsControllerDeps {
  getClientsUseCase: GetClientsUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class GetClientsController {
  public readonly route = "/clients";

  protected readonly getClientsUseCase: GetClientsUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    getClientsUseCase,
    controllerErrorHandler
  }: GetClientsControllerDeps) {
    this.getClientsUseCase = getClientsUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      skip: Number(req.query.skip),
      limit: Number(req.query.limit)
    } as GetClientsDTO;

    try {
      const clients = await this.getClientsUseCase.execute(reqData);
      
      const clientJSON = clients.map((client)=> ClientMapper.toJSON(client));

      res.json({clients: clientJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
