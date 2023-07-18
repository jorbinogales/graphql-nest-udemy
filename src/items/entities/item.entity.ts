import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn, Entity} from "typeorm";

@Entity({ name: 'items'})
@ObjectType()
export class Item {

  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => String, { nullable: true})
  @Column({
    nullable: true
  })
  quantityUnits?: string;
}
