import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { OrderMapper } from "../mappers/OrderMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  CreateOrderDTO, 
  CreateOrderUseCase
} from "../../application";

interface CreateOrderControllerDeps {
  createOrderUseCase: CreateOrderUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class CreateOrderController {
  protected readonly createOrderUseCase: CreateOrderUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    createOrderUseCase,
    controllerErrorHandler
  }: CreateOrderControllerDeps) {
    this.createOrderUseCase = createOrderUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      clientId: req.query.clientId
    } as CreateOrderDTO;

    try {
      const order = await this.createOrderUseCase.execute(reqData);

      const orderJSON = OrderMapper.toJSON(order);

      res.json({order: orderJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
