import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  UpdateProductDTO, 
  UpdateProductUseCase
} from "../../application";

interface UpdateProductControllerDeps {
  updateProductUseCase: UpdateProductUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class UpdateProductController {
  protected readonly updateProductUseCase: UpdateProductUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    updateProductUseCase,
    controllerErrorHandler
  }: UpdateProductControllerDeps) {
    this.updateProductUseCase = updateProductUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      productId: req.query.productId,
      name: req.body.name,
      brand: req.body.brand,
      avaliableQuantity: req.body.avaliableQuantity,
      price: req.body.price
    } as UpdateProductDTO;

    try {
      await this.updateProductUseCase.execute(reqData);

      res.json({updated: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
