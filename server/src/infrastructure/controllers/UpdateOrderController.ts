import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { UpdateOrderDTO, UpdateOrderUseCase } from "../../application";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler"

interface UpdateOrderControllerDeps {
  updateOrderUseCase: UpdateOrderUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class UpdateOrderController {
  public readonly route = "/order";

  protected readonly updateOrderUseCase: UpdateOrderUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    updateOrderUseCase,
    controllerErrorHandler
  }: UpdateOrderControllerDeps) {
    this.updateOrderUseCase = updateOrderUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  } 

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      orderId: req.query.orderId,
      clientId: req.body.clientId,
      productIds: req.body.products
    } as UpdateOrderDTO;

    try {
      await this.updateOrderUseCase.execute(reqData);

      res.json({updated: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
