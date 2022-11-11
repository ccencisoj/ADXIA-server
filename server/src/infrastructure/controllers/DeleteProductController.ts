import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  DeleteProductDTO, 
  DeleteProductUseCase
} from "../../application";

interface DeleteProductControllerDeps {
  deleteProductUseCase: DeleteProductUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class DeleteProductController {
  protected readonly deleteProductUseCase: DeleteProductUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    deleteProductUseCase,
    controllerErrorHandler
  }: DeleteProductControllerDeps) {
    this.deleteProductUseCase = deleteProductUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      productId: req.query.productId
    } as DeleteProductDTO;

    try {
      await this.deleteProductUseCase.execute(reqData);

      res.json({deleted: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
