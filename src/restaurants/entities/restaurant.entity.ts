import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';

// entity에서 InputType 안써주고 이렇게 할 수도 있는데 추천은 X
// @InputType({ isAbstract: true }) // 스키마에 포함되지 않길 원한다는 뜻. 이걸 어디선가 복사해서 쓴다는 뜻. 직접 쓰는게 아니라 어디로 확장시킨다는 뜻.

// 이 클래스 하나로 DB에 저장되는 실제 데이터 형식을 만들 수 있다. 아래 2개의 decorator만 있으면!
@ObjectType() // for graphql automatic schema
@Entity() // for db (typeorm)
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String) // for graphql
  @Column() // for db
  @IsString() // for dto
  @Length(5) // for dto
  name: string;

  @Field((type) => Boolean, { nullable: true }) // for graphql
  @Column({ default: true }) // for db
  @IsOptional() // for dto
  @IsBoolean() // for dto
  isVegan: boolean;

  @Field((type) => String, { defaultValue: '강남' })
  @Column() // 여기에 default: 안써도 되긴 하네~ 위처럼 Column에만 default: true를 해줘도 되고(graphql에는 nullable), 여기처럼 graphql에만 해줘도 되고 상관없나보다
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  ownerName: string;

  @Field((type) => String)
  @Column()
  @IsString()
  categoryName: string;
}
