import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  DeleteEmployeeDTO, 
  DeleteEmployeeUseCase
} from "../../application";

interface DeleteEmployeeControllerDeps {
  deleteEmployeeUseCase: DeleteEmployeeUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class DeleteEmployeeController {
  public readonly route = "/employee";

  protected readonly deleteEmployeeUseCase: DeleteEmployeeUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    deleteEmployeeUseCase,
    controllerErrorHandler
  }: DeleteEmployeeControllerDeps) {
    this.deleteEmployeeUseCase = deleteEmployeeUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      employeeId: req.query.employeeId
    } as DeleteEmployeeDTO;

    try {
      await this.deleteEmployeeUseCase.execute(reqData);

      res.json({deleted: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
