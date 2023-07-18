import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from "./entities/user.entity";
import { SignupInput } from "../auth/dto/inputs/signup.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ValidRoles } from "../auth/enums/valid-roles.enum";

@Injectable()
export class UsersService {

  private logger: Logger = new Logger();
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async create(signupInput: SignupInput):Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.userRepository.save(newUser);
    } catch (error){
     this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    try {
      if(roles.length === 0) return await this.userRepository.find();
      return await this.userRepository.createQueryBuilder().andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles)
        .getMany();
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({email});
    } catch (error){
      this.handleDBErrors({
        code: 'error-001',
        details: `${email} not found`
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({id});
    } catch (error){
      this.handleDBErrors({
        code: 'error-001',
        details: `${id} not found`
      });
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput, admin: User):Promise<User> {
    try {
      const user: User = await this.userRepository.preload(updateUserInput);
      user.lastUpdateBy = admin;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async block(id: string, admin: User): Promise<User> {
    const user: User = await this.findOneById(id);
    user.isActive = false;
    user.lastUpdateBy = admin;
    return await this.userRepository.save(user);
  }

  private handleDBErrors(error: any): never{
    this.logger.error(error);
    if(error.code === '23505'){
      throw new BadRequestException(error.detail.replace('Key', ''))
    }
    if(error.code === 'error-001'){
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Please check sever logs');
  }
}
