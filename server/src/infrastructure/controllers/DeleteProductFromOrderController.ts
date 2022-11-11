import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  DeleteProductFromOrderDTO, 
  DeleteProductFromOrderUseCase
} from "../../application";

interface DeleteProductFromOrderControllerDeps {
  deleteProductFromOrderUseCase: DeleteProductFromOrderUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class DeleteProductFromOrderController {
  protected readonly deleteProductFromOrderUseCase: DeleteProductFromOrderUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    deleteProductFromOrderUseCase,
    controllerErrorHandler
  }: DeleteProductFromOrderControllerDeps) {
    this.deleteProductFromOrderUseCase = deleteProductFromOrderUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      orderId: req.query.orderId,
      productId: req.query.productId
    } as DeleteProductFromOrderDTO;

    try {
      await this.deleteProductFromOrderUseCase.execute(reqData);

      res.json({deleted: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
