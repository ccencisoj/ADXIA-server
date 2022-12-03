import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";
import {
  UpdateEmployeeDTO, 
  UpdateEmployeeUseCase
} from "../../application";

interface UpdateEmployeeControllerDeps {
  updateEmployeeUseCase: UpdateEmployeeUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class UpdateEmployeeController {
  public readonly route = "/employee";

  protected readonly updateEmployeeUseCase: UpdateEmployeeUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    updateEmployeeUseCase,
    controllerErrorHandler
  }: UpdateEmployeeControllerDeps) {
    this.updateEmployeeUseCase = updateEmployeeUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = {
      employeeId: req.query.employeeId,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      nroDocument: req.body.nroDocument,
      birthDate: req.body.birthDate,
      imageURL: req.body.imageURL,
      type: req.body.type,
      accessCode: req.body.accessCode
    } as UpdateEmployeeDTO;

    try {
      await this.updateEmployeeUseCase.execute(reqData);

      res.json({updated: true});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
