import { Product } from "../../../domain";
import { GetProductsDTO } from "./GetProductsDTO";
import { IProductRepository } from "../../repositories/IProductRepository";

type Response = Promise<Product[]>;

interface GetProductsUseCaseDeps {
  productRepository: IProductRepository;
}

export class GetProductsUseCase {
  protected readonly productRepository: IProductRepository;

  public constructor({productRepository}: GetProductsUseCaseDeps) {
    this.productRepository = productRepository;
  }

  public execute = async (req: GetProductsDTO): Response => {
    const products = await this.productRepository.findMany({}, req.skip, req.limit);

    return products;
  }
} 
