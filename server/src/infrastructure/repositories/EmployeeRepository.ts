import { Model } from 'mongoose';
import { Employee } from '../../domain';
import { IEmployeeRepository } from "../../application";
import { EmployeeMapper } from '../mappers/EmployeeMapper';

export class EmployeeRepository implements IEmployeeRepository {
  protected readonly model: Model<any>;

  public constructor(model: Model<any>) {
    this.model = model;
  }

  public findOne = async (filter: any): Promise<Employee> => {
    const repoEmployee = await this.model.findOne(filter);    
    const employee = repoEmployee ? EmployeeMapper.toDomain(repoEmployee) : null;
    return employee;
  }

  public findMany = async (filter: any, skip: number, limit: number): Promise<Employee[]> => {
    const repoEmployees = await this.model.find(filter).sort({"$natural": -1}).skip(skip).limit(limit);
    const employees = repoEmployees.map((repoEmployee)=> EmployeeMapper.toDomain(repoEmployee));
    return employees;
  }

  public save = async (employee: Employee): Promise<void> => {
    const exists = await this.existsById(employee.id);
    const repoEmployee = EmployeeMapper.toPersistence(employee);

    if(exists) {
      await this.model.updateOne({id: repoEmployee.id}, repoEmployee);
    }else {
      await this.model.create(repoEmployee);
    }
  }

  public delete = async (employee: Employee): Promise<void> => {
    await this.model.deleteOne({id: employee.id}); 
  }

  public existsById = async (entityId: string): Promise<boolean> => {
    const repoEmployee = await this.model.findOne({id: entityId});
    const exists = !!repoEmployee ? true : false;
    return exists;
  }
}
