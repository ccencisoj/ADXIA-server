import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ClientMapper } from "../mappers/ClientMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  CreateClientDTO, 
  CreateClientUseCase
} from "../../application";

interface CreateClientControllerDeps {
  createClientUseCase: CreateClientUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class CreateClientController {
  public readonly route = "/client";

  protected readonly createClientUseCase: CreateClientUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    createClientUseCase,
    controllerErrorHandler
  }: CreateClientControllerDeps) {
    this.createClientUseCase = createClientUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      name: req.body.name,
      surname: req.body.surname,
      nroDocument: req.body.nroDocument,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      imageURL: req.body.imageURL,
      business: req.body.business
    } as CreateClientDTO;

    try {
      const client = await this.createClientUseCase.execute(reqData);

      const clientJSON = ClientMapper.toJSON(client);

      res.json({client: clientJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
