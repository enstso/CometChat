/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

// Container object to hold GraphQL documents keyed by their query strings
const documents: any = [];

/**
 * The graphql function parses GraphQL query strings into document nodes
 * that can be used by GraphQL clients for operations like queries or mutations.
 *
 * Example usage:
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * Note: The argument type is unknown because the documents object is empty.
 * To get proper typings, you need to regenerate the GraphQL types.
 */
export function graphql(source: string): unknown;

// Implementation of the graphql function returns the matching document from the cache
// or an empty object if the document is not found.
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

// Utility type to extract the TypeScript type from a TypedDocumentNode.
// Given a DocumentNode with data type TType, this extracts TType.
export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
