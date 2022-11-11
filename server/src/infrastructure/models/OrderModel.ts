import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  id: {type: String, required: true},
  clientId: {type: String, required: true},
  createdAt: {type: String, required: true}
});

const OrderModel = model("Order", OrderSchema);

export { OrderModel };
