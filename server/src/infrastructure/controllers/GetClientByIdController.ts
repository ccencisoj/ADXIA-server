import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ClientMapper } from "../mappers/ClientMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  GetClientByIdDTO, 
  GetClientByIdUseCase
} from "../../application";

interface GetClientByIdControllerDeps {
  getClientByIdUseCase: GetClientByIdUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class GetClientByIdController {
  protected readonly getClientByIdUseCase: GetClientByIdUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    getClientByIdUseCase,
    controllerErrorHandler
  }: GetClientByIdControllerDeps) {
    this.getClientByIdUseCase = getClientByIdUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      clientId: req.query.clientId
    } as GetClientByIdDTO;

    try {
      const client = await this.getClientByIdUseCase.execute(reqData);

      const clientJSON = ClientMapper.toJSON(client);

      res.json({client: clientJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
