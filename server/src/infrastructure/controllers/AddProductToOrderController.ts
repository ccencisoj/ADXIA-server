import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { OrderProductMapper } from "../mappers/OrderProductMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import { 
  AddProductToOrderDTO,
  AddProductToOrderUseCase
} from "../../application";

interface AddProductToOrderControllerDeps {
  addProductToOrderUseCase: AddProductToOrderUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class AddProductToOrderController {
  protected readonly addProductToOrderUseCase: AddProductToOrderUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    addProductToOrderUseCase,
    controllerErrorHandler
  }: AddProductToOrderControllerDeps) {
    this.addProductToOrderUseCase = addProductToOrderUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      clientId: req.user.id,
      orderId: req.query.orderId,
      productId: req.query.productId
    } as AddProductToOrderDTO;

    try {
      const orderProduct = await this.addProductToOrderUseCase.execute(reqData);

      const orderProductJSON = OrderProductMapper.toJSON(orderProduct);

      res.json({orderProduct: orderProductJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);      
    }
  }
}
