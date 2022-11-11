import { HttpRequest } from "../http/HttpRequest";
import { HttpReponse } from "../http/HttpResponse";
import { ApplicationException } from "../../application";

export class ControllerErrorHandler {
  public execute = async (req: HttpRequest, res: HttpReponse, error: any)=> {
    if(error instanceof ApplicationException) {
      return res.status(error.code).json({message: error.message});
    }
    console.log(error);
    return res.status(500).json({message: "Occurred a unknown error"});
  }
}
