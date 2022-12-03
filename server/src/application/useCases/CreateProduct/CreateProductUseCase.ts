import { CreateProductDTO } from "./CreateProductDTO";
import { ProductException } from "../../exceptions/ProductException";
import { IProductRepository } from "../../repositories/IProductRepository";
import { ValidationException } from "../../exceptions/ValidationException";
import { ProductNameAlreadyInUseException } from "../../exceptions/ProductNameAlreadyInUseException";
import { 
  Result,
  Product, 
  ProductName, 
  ProductPrice, 
  ProductBrand, 
  ProductQuantity,
  DomainEvents
} from "../../../domain";

type Response = Promise<Product>;

interface CreateProductUseCaseDeps {
  productRepository: IProductRepository;
}

export class CreateProductUseCase {
  protected readonly productRepository: IProductRepository;

  public constructor({productRepository}: CreateProductUseCaseDeps) {
    this.productRepository = productRepository;
  }

  public execute = async (req: CreateProductDTO): Response => {
    const product = await this.productRepository.findOne({name: req.name});
    const productFound = !!product;

    if(productFound) {
      throw new ProductNameAlreadyInUseException(product);
    }

    const nameOrError = ProductName.create(req.name);
    const brandOrError = ProductBrand.create(req.brand);
    const avaliableQuantityOrError = ProductQuantity.create(req.avaliableQuantity);
    const priceOrError = ProductPrice.create(req.price);
    const combinedResult = Result.combine([
      nameOrError,
      brandOrError,
      avaliableQuantityOrError,
      priceOrError
    ]);

    if(combinedResult.isFailure) {
      throw new ValidationException(combinedResult.getError() as string);
    }

    const newProductOrError = Product.create({
      name: nameOrError.getValue(),
      brand: brandOrError.getValue(),
      avaliableQuantity: avaliableQuantityOrError.getValue(),
      price: priceOrError.getValue(),
      imageURL: req.imageURL
    });

    if(newProductOrError.isFailure) {
      throw new ProductException(newProductOrError.getError() as string);
    } 

    const newProduct = newProductOrError.getValue();

    await this.productRepository.save(newProduct);

    DomainEvents.dispatchEvents(newProduct);

    return newProduct;
  }
}
