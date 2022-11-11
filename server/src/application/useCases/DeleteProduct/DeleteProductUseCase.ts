import { DeleteProductDTO } from "./DeleteProductDTO";
import { DeletedProductEvent, DomainEvents } from "../../../domain";
import { IProductRepository } from "../../repositories/IProductRepository";
import { ProductNoFoundException } from "../../exceptions/ProductNoFoundException";

type Response = Promise<void>;

interface DeleteProductUseCaseDeps {
  productRepository: IProductRepository;
}

export class DeleteProductUseCase {
  protected readonly productRepository: IProductRepository;

  public constructor({productRepository}: DeleteProductUseCaseDeps) {
    this.productRepository = productRepository;
  }

  public execute = async (req: DeleteProductDTO): Response => {
    const product = await this.productRepository.findOne({id: req.productId});
    const productFound = !!product;

    if(!productFound) {
      throw new ProductNoFoundException();
    }

    await this.productRepository.delete(product);

    product.addDomainEvent(new DeletedProductEvent(product));

    DomainEvents.dispatchEvents(product);
  }
}
