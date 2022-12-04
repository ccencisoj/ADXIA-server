import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { LoginEmployeeUseCase } from "../../application";
import { ControllerErrorHandler } from "../errorHandlers/ControllerErrorHandler";

interface LoginEmployeeControllerDeps {
  loginEmployeeUseCase: LoginEmployeeUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class LoginEmployeeController {
  public readonly route = "/employee/login";

  protected readonly loginEmployeeUseCase: LoginEmployeeUseCase;
  protected readonly controlllerErrorHandler: ControllerErrorHandler;

  public constructor({
    loginEmployeeUseCase, 
    controllerErrorHandler
  }: LoginEmployeeControllerDeps) {
    this.loginEmployeeUseCase = loginEmployeeUseCase;
    this.controlllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    try {
      const reqData = {
        nroDocument: req.body.nroDocument,
        accessCode: req.body.accessCode
      }

      const employeeToken = await this.loginEmployeeUseCase.execute(reqData);

      res.json({employeeToken});

    }catch(error) {
      this.controlllerErrorHandler.execute(req, res, error);
    }
  }
}
