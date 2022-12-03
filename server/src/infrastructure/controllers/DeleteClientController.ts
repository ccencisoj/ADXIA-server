import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  DeleteClientDTO, 
  DeleteClientUseCase
} from "../../application";

interface DeleteClientControllerDeps {
  deleteClientUseCase: DeleteClientUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class DeleteClientController {
  public readonly route = "/client";

  protected readonly deleteClientUseCase: DeleteClientUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    deleteClientUseCase,
    controllerErrorHandler
  }: DeleteClientControllerDeps) {
    this.deleteClientUseCase = deleteClientUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      clientId: req.query.clientId
    } as DeleteClientDTO;

    try {
      await this.deleteClientUseCase.execute(reqData);

      res.json({deleted: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
