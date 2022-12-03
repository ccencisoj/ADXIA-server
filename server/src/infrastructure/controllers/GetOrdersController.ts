import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { OrderMapper } from "../mappers/OrderMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  GetOrdersDTO, 
  GetOrdersUseCase
} from "../../application";

interface GetOrdersControllerDeps {
  getOrdersUseCase: GetOrdersUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class GetOrdersController {
  public readonly route = "/orders";

  protected readonly getOrdersUseCase: GetOrdersUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    getOrdersUseCase,
    controllerErrorHandler
  }: GetOrdersControllerDeps) {
    this.getOrdersUseCase = getOrdersUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      skip: Number(req.query.skip),
      limit: Number(req.query.limit)
    } as GetOrdersDTO;

    try {
      const orders = await this.getOrdersUseCase.execute(reqData);
      
      const orderJSON = orders.map((order)=> OrderMapper.toJSON(order));

      res.json({orders: orderJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
