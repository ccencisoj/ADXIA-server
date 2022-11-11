import { Schema, model } from 'mongoose';

const ClientSchema = new Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  surname: {type: String, required: true},
  nroDocument: {type: String, required: true},
  phoneNumber: {type: String, required: true}
});

const ClientModel = model("Client", ClientSchema);

export { ClientModel };
