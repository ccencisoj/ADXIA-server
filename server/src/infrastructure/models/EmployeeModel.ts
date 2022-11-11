import { Schema, model } from 'mongoose';

const EmployeeSchema = new Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  surname: {type: String, required: true},
  email: {type: String, required: true},
  nroDocument: {type: String, required: true},
  birthDate: {type: String, required: true}
});

const EmployeeModel = model("Employee", EmployeeSchema);

export { EmployeeModel };
