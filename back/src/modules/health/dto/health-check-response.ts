import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class HealthCheckResponse {
  @Field()
  result: string;
}
