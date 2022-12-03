import { config } from '../config';
import { HttpRequest } from '../http/HttpRequest';
import { HttpReponse } from '../http/HttpResponse';
import { TempImageMapper } from '../mappers/TempImageMapper';
import { SaveTempImageDTO, SaveTempImageUseCase } from '../../application';
import { ControllerErrorHandler } from '../errorHandlers/ControllerErrorHandler';

const SERVICE_TEMP_IMAGE_URI = config.SERVICE_TEMP_IMAGE_URI;

interface SaveTempImageControllerDeps {
  saveTempImageUseCase: SaveTempImageUseCase;
  controllerErrorHandler: ControllerErrorHandler;
}

export class SaveTempImageController {
  public readonly route = "/tempImage";

  protected readonly saveTempImageUseCase: SaveTempImageUseCase;
  protected readonly controllerErrorHandler: ControllerErrorHandler;

  public constructor({
    saveTempImageUseCase, 
    controllerErrorHandler
  }: SaveTempImageControllerDeps) {
    this.saveTempImageUseCase = saveTempImageUseCase;
    this.controllerErrorHandler = controllerErrorHandler;
  }

  public execute = async (req: HttpRequest, res: HttpReponse): Promise<void> => {
    const reqData = { path: req.file.path } as SaveTempImageDTO;

    try {
      const image = await this.saveTempImageUseCase.execute(reqData);
      
      const imageJSON = TempImageMapper.toJSON(image);
      
      const imageURL = SERVICE_TEMP_IMAGE_URI + '/' + image.id;

      res.json({image: {...imageJSON, url: imageURL}});

    }catch(error) {
      this.controllerErrorHandler.execute(req, res, error);
    }
  }
}
