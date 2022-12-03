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
  public readonly route = "/order";

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
      employeeId: req.body.employeeId
    } as CreateOrderDTO;

    try {
      const order = await this.createOrderUseCase.execute(reqData);

      const orderJSON = {
        ...OrderMapper.toJSON(order),
        products: []
      }

      res.json({order: orderJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
