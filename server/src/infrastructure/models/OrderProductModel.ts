import { Schema, model } from 'mongoose';

const OrderProductSchema = new Schema({
  id: {type: String, required: true},
  orderId: {type: String, required: true},
  name: {type: String, required: true},
  brand: {type: String, required: true},
  avaliableQuantity: {type: Number, required: true},
  price: {type: Number, required: true},
  imageURL: {type: String, required: true}
});

const OrderProductModel = model("OrderProduct", OrderProductSchema);

export { OrderProductModel };
