import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from 'src/app.resolver';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    // Configure GraphQL module with Apollo driver
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false, // Disable the old GraphQL Playground UI
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Automatically generate schema file
      sortSchema: true, // Sort the schema lexicographically
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Enable Apollo Sandbox landing page plugin
    }),
  ],
  providers: [AppResolver], // Register the application-level GraphQL resolver
})
export class GqlModule {
  constructor() {}
}
