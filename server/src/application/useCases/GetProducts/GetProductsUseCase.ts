import { GetProductsDTO } from "./GetProductsDTO";
import { EmployeeType, Product } from "../../../domain";
import { IProductRepository } from "../../repositories/IProductRepository";
import { IEmployeeTokenService } from "../../services/IEmployeeTokenService";
import { EmployeeCredentialsException } from "../../exceptions/EmployeeCredentialsException";
import { EmployeeActionNoAllowedException } from "../../exceptions/EmployeeActionNoAllowedException";

type Response = Promise<Product[]>;

interface GetProductsUseCaseDeps {
  productRepository: IProductRepository;
  employeeTokenService: IEmployeeTokenService;
}

export class GetProductsUseCase {
  protected readonly productRepository: IProductRepository;
  protected readonly employeeTokenService: IEmployeeTokenService;

  public constructor({
    productRepository,
    employeeTokenService
  }: GetProductsUseCaseDeps) {
    this.productRepository = productRepository;
    this.employeeTokenService = employeeTokenService;
  }

  public execute = async (req: GetProductsDTO): Response => {
    const decodedEmployeeOrError = this.employeeTokenService.decode(req.employeeToken);

    if(decodedEmployeeOrError.isFailure) {
      throw new EmployeeCredentialsException(decodedEmployeeOrError.getError() as string);
    }

    const decodedEmployee = decodedEmployeeOrError.getValue();

    if(!(decodedEmployee.type === EmployeeType.ADMIN || 
      decodedEmployee.type === EmployeeType.VENDOR ||
      decodedEmployee.type === EmployeeType.DELIVERER)) {
      throw new EmployeeActionNoAllowedException();
    }

    const products = await this.productRepository.findMany({}, req.skip, req.limit);

    return products;
  }
} 
