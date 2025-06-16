/* eslint-disable */
// Utility types to handle nullable values and optional keys in types
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;

// Exact enforces that T matches exactly with no extra keys
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

// Makes keys K in T optional and nullable
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };

// Makes keys K in T nullable but required
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

// Makes keys K in T excluded (never)
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };

// Incremental type supports partial loading for deferred fields except for fragment name and typename
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

// Scalar type mapping between input and output types
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, compliant with date-time format, e.g. 2019-12-03T09:54:33Z */
  DateTime: { input: any; output: any };
};

// Conversation represents a chat conversation with id, messages, participants, and title
export type Conversation = {
  __typename?: 'Conversation';
  id: Scalars['ID']['output'];
  messages: Array<Message>;
  participants: Array<ConversationParticipant>;
  title: Scalars['String']['output'];
};

// Pagination info and connection types for conversations
export type ConversationConnection = {
  __typename?: 'ConversationConnection';
  edges: Array<ConversationEdge>;
  pageInfo: ConversationPageInfo;
};

export type ConversationEdge = {
  __typename?: 'ConversationEdge';
  cursor: Scalars['String']['output'];
  node: Conversation;
};

export type ConversationPageInfo = {
  __typename?: 'ConversationPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

// Participant in a conversation with id and linked user
export type ConversationParticipant = {
  __typename?: 'ConversationParticipant';
  id: Scalars['ID']['output'];
  user: User;
};

// Input type for creating a new conversation between two users with a title
export type CreateConversationInput = {
  title: Scalars['String']['input'];
  userId1: Scalars['ID']['input'];
  userId2: Scalars['ID']['input'];
};

// Response type for health check query
export type HealthCheckResponse = {
  __typename?: 'HealthCheckResponse';
  result: Scalars['String']['output'];
};

// Message type with content, creation timestamp, id, and sender user
export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  sender: User;
};

// Pagination info and connection types for messages
export type MessageConnection = {
  __typename?: 'MessageConnection';
  edges: Array<MessageEdge>;
  pageInfo: MessagePageInfo;
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  cursor: Scalars['String']['output'];
  node: Message;
};

export type MessagePageInfo = {
  __typename?: 'MessagePageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

// Root Mutation type with operations to create conversations and send messages
export type Mutation = {
  __typename?: 'Mutation';
  createConversation: Conversation;
  sendMessage: SendMessageResponse;
};

// Arguments for createConversation mutation input
export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};

// Arguments for sendMessage mutation input
export type MutationSendMessageArgs = {
  sendMessageInput: SendMessageInput;
};

// Root Query type with operations to fetch messages, conversations, user info, and perform health checks
export type Query = {
  __typename?: 'Query';
  getMessages: MessageConnection;
  getUserConversations: ConversationConnection;
  healthCheck: HealthCheckResponse;
  hello: Scalars['String']['output'];
  me: User;
  searchUsers: Array<User>;
};

// Arguments for getMessages query including conversationId, cursor, and limit for pagination
export type QueryGetMessagesArgs = {
  conversationId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
};

// Arguments for getUserConversations query with pagination options
export type QueryGetUserConversationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
};

// Arguments for searching users by query string
export type QuerySearchUsersArgs = {
  query: Scalars['String']['input'];
};

// Input type for sending a message with content, conversationId, senderId, and optional socketId
export type SendMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
  senderId: Scalars['ID']['input'];
  socketId?: InputMaybe<Scalars['String']['input']>;
};

// Response type for sendMessage mutation, including optional jobId and result string
export type SendMessageResponse = {
  __typename?: 'SendMessageResponse';
  jobId?: Maybe<Scalars['ID']['output']>;
  result: Scalars['String']['output'];
};

// User type representing a user with auth0Id, optional email, id, and username
export type User = {
  __typename?: 'User';
  auth0Id: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};
