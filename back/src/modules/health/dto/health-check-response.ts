import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class HealthCheckResponse {
  @Field()
  result: string;
}