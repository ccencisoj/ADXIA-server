import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ProductMapper } from "../mappers/ProductMapper";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  CreateProductDTO, 
  CreateProductUseCase
} from "../../application";

interface CreateProductControllerDeps {
  createProductUseCase: CreateProductUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class CreateProductController {
  protected readonly createProductUseCase: CreateProductUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    createProductUseCase,
    controllerErrorHandler
  }: CreateProductControllerDeps) {
    this.createProductUseCase = createProductUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      name: req.body.name,
      brand: req.body.brand,
      avaliableQuantity: Number(req.body.avaliableQuantity),
      price: Number(req.body.price)
    } as CreateProductDTO;

    try {
      const product = await this.createProductUseCase.execute(reqData);

      const productJSON = ProductMapper.toJSON(product);

      res.json({product: productJSON});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
