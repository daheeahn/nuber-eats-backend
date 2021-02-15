import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

// entity에서 InputType 안써주고 이렇게 할 수도 있는데 추천은 X

// 이 클래스 하나로 DB에 저장되는 실제 데이터 형식을 만들 수 있다. 아래 2개의 decorator만 있으면!
@InputType('CategoryInputType', { isAbstract: true }) // 스키마에 포함되지 않길 원한다는 뜻. 이걸 어디선가 복사해서 쓴다는 뜻. 직접 쓰는게 아니라 어디로 확장시킨다는 뜻.
@ObjectType() // for graphql automatic schema
@Entity() // for db (typeorm)
export class Category extends CoreEntity {
  @Field((type) => String) // for graphql
  @Column() // for db
  @IsString() // for dto
  @Length(5) // for dto
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
