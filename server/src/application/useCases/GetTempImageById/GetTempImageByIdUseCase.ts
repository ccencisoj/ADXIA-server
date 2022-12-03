import { Image } from "../../../domain";
import { IImageService } from '../../services/IImageService';
import { GetTempImageByIdDTO } from "./GetTempImageByIdDTO";
import { ImageNoFoundException } from "../../exceptions/ImageNoFoundException";

type Response = Promise<Image>;

interface GetTempImageByIdUseCaseDeps {
  imageService: IImageService;
}

export class GetTempImageByIdUseCase {
  protected readonly imageService: IImageService;

  public constructor({imageService}: GetTempImageByIdUseCaseDeps) {
    this.imageService = imageService;
  }

  public execute = async (req: GetTempImageByIdDTO): Response => {
    const image = await this.imageService.getTempImageById(req.imageId);
    const imageFound = !!image;

    if(!imageFound) {
      throw new ImageNoFoundException();
    }

    return image;
  }
}
