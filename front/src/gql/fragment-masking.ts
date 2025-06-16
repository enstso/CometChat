/* eslint-disable */
import type { ResultOf, DocumentTypeDecoration, TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { FragmentDefinitionNode } from 'graphql';
import type { Incremental } from './graphql';

// Type helper to infer the fragment reference type from a DocumentTypeDecoration
export type FragmentType<TDocumentType extends DocumentTypeDecoration<any, any>> = TDocumentType extends DocumentTypeDecoration<
  infer TType,
  any
>
  ? [TType] extends [{ ' $fragmentName'?: infer TKey }]
    ? TKey extends string
      ? { ' $fragmentRefs'?: { [key in TKey]: TType } }
      : never
    : never
  : never;

// Overloads for useFragment function to handle different fragmentType input scenarios:

// Return non-nullable if fragmentType is non-nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>>
): TType;

// Return nullable if fragmentType is undefined
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | undefined
): TType | undefined;

// Return nullable if fragmentType is null
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | null
): TType | null;

// Return nullable if fragmentType is null or undefined
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | null | undefined
): TType | null | undefined;

// Return array of non-nullable if fragmentType is an array of non-nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: Array<FragmentType<DocumentTypeDecoration<TType, any>>>
): Array<TType>;

// Return array of nullable if fragmentType is array of nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: Array<FragmentType<DocumentTypeDecoration<TType, any>>> | null | undefined
): Array<TType> | null | undefined;

// Return readonly array of non-nullable if fragmentType is readonly array of non-nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>>
): ReadonlyArray<TType>;

// Return readonly array of nullable if fragmentType is readonly array of nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>> | null | undefined
): ReadonlyArray<TType> | null | undefined;

// Implementation of useFragment that simply returns the input fragmentType casted as any
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>> | Array<FragmentType<DocumentTypeDecoration<TType, any>>> | ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>> | null | undefined
): TType | Array<TType> | ReadonlyArray<TType> | null | undefined {
  return fragmentType as any;
}

// Converts raw data into a fragment reference type
export function makeFragmentData<
  F extends DocumentTypeDecoration<any, any>,
  FT extends ResultOf<F>
>(data: FT, _fragment: F): FragmentType<F> {
  return data as FragmentType<F>;
}

// Checks if the fragment data is ready (i.e. all deferred fields are loaded)
// Uses metadata from the queryNode to identify deferred fields for the fragment
export function isFragmentReady<TQuery, TFrag>(
  queryNode: DocumentTypeDecoration<TQuery, any>,
  fragmentNode: TypedDocumentNode<TFrag>,
  data: FragmentType<TypedDocumentNode<Incremental<TFrag>, any>> | null | undefined
): data is FragmentType<typeof fragmentNode> {
  // Retrieve deferred fields metadata if available
  const deferredFields = (queryNode as { __meta__?: { deferredFields: Record<string, (keyof TFrag)[]> } }).__meta__
    ?.deferredFields;

  // If no deferred fields, fragment is ready
  if (!deferredFields) return true;

  // Extract fragment name from fragment definition node
  const fragDef = fragmentNode.definitions[0] as FragmentDefinitionNode | undefined;
  const fragName = fragDef?.name?.value;

  // Get list of deferred fields for the fragment
  const fields = (fragName && deferredFields[fragName]) || [];

  // Check if all deferred fields exist in the data object
  return fields.length > 0 && fields.every(field => data && field in data);
}
