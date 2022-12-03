import { Image } from "../../../domain";
import { SaveTempImageDTO } from "./SaveTempImageDTO";
import { IImageService } from '../../services/IImageService';
import { ImageException } from "../../exceptions/ImageException";

type Response = Promise<Image>;

interface SaveTempImageUseCaseDeps {
  imageService: IImageService;
}

export class SaveTempImageUseCase {
  protected readonly imageService: IImageService;
  
  public constructor({imageService}: SaveTempImageUseCaseDeps) {
    this.imageService = imageService;
  }

  public execute = async (req: SaveTempImageDTO): Response => {
    const imageOrError = Image.create({path: req.path});

    if(imageOrError.isFailure) {
      throw new ImageException(imageOrError.getError() as string);
    }

    const image = imageOrError.getValue();

    await this.imageService.saveTempImage(image);

    return image;
  }
}
