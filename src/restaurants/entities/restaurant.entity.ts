import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// entity에서 InputType 안써주고 이렇게 할 수도 있는데 추천은 X
// @InputType({ isAbstract: true }) // 스키마에 포함되지 않길 원한다는 뜻. 이걸 어디선가 복사해서 쓴다는 뜻. 직접 쓰는게 아니라 어디로 확장시킨다는 뜻.

// 이 클래스 하나로 DB에 저장되는 실제 데이터 형식을 만들 수 있다. 아래 2개의 decorator만 있으면!
@ObjectType() // for graphql automatic schema
@Entity() // for db (typeorm)
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @Column()
  name: string;

  @Field((type) => Boolean)
  @Column()
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownerName: string;

  @Field((type) => String)
  @Column()
  categoryName: string;
}
