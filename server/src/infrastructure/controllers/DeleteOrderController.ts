import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  DeleteOrderDTO, 
  DeleteOrderUseCase
} from "../../application";

interface DeleteOrderControllerDeps {
  deleteOrderUseCase: DeleteOrderUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class DeleteOrderController {
  protected readonly deleteOrderUseCase: DeleteOrderUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    deleteOrderUseCase,
    controllerErrorHandler
  }: DeleteOrderControllerDeps) {
    this.deleteOrderUseCase = deleteOrderUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      orderId: req.query.orderId
    } as DeleteOrderDTO;

    try {
      await this.deleteOrderUseCase.execute(reqData);

      res.json({deleted: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
