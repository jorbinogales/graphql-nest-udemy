import { ObjectType, Field, Int, ID } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { ValidRoles } from "../../auth/enums/valid-roles.enum";

@Entity({ name: 'users'})
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email:string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: [ValidRoles.user]
  })
  @Field(() => [String])
  roles: string[]

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  // TODO RELACIONES
  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true})
  @JoinColumn({ name: 'lastUpdateBy'})
  @Field(() => User, { nullable: true})
  lastUpdateBy?: User;

}
