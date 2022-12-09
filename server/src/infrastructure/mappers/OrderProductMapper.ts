import { 
  OrderProduct, 
  ProductBrand, 
  ProductName, 
  ProductPrice, 
  ProductQuantity 
} from "../../domain";

type OrderProductRaw = {
  id: string;
  orderId: string;
  name: string;
  brand: string;
  avaliableQuantity: number;
  price: number;
  imageURL: string;
  description: string;
  grammage: string;
};

export class OrderProductMapper {
  public static toJSON = (orderProduct: OrderProduct): any => {
    return {
      id: orderProduct.id,
      orderId: orderProduct.orderId,
      name: orderProduct.name,
      brand: orderProduct.brand,
      avaliableQuantity: orderProduct.avaliableQuantity,
      price: orderProduct.price,
      imageURL: orderProduct.imageURL,
      description: orderProduct.description,
      grammage: orderProduct.grammage
    }
  }

  public static toPersistence = (orderProduct: OrderProduct): any => {
    return {
      id: orderProduct.id,
      orderId: orderProduct.orderId,
      name: orderProduct.name,
      brand: orderProduct.brand,
      avaliableQuantity: orderProduct.avaliableQuantity,
      price: orderProduct.price,
      imageURL: orderProduct.imageURL,
      escription: orderProduct.description,
      grammage: orderProduct.grammage
    }
  }

  public static toDomain = (raw: OrderProductRaw): OrderProduct => {
    const nameOrError = ProductName.create(raw.name);
    const brandOrError = ProductBrand.create(raw.brand);
    const avaliableQuantityOrError = ProductQuantity.create(raw.avaliableQuantity);
    const priceOrError = ProductPrice.create(raw.price);
    const orderProductOrError = OrderProduct.create({
      orderId: raw.orderId,
      name: nameOrError.getValue(),
      brand: brandOrError.getValue(),
      avaliableQuantity: avaliableQuantityOrError.getValue(),
      price: priceOrError.getValue(),
      imageURL: raw.imageURL,
      description: raw.description,
      grammage: raw.grammage
    }, raw.id);
    const orderProduct = orderProductOrError.getValue();
    return orderProduct;
  }
}
