import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
    overwrite: true,
   schema: "http://localhost:4000/" ,
   ignoreNoDocuments: true,
   documents: ['src/**/*.tsx'],
   generates: {
      './src/gql/': {
        preset: 'client',
      }
   }
}
export default config