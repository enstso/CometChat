/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Conversation = {
  __typename?: 'Conversation';
  id: Scalars['ID']['output'];
  messages: Array<Message>;
  participants: Array<ConversationParticipant>;
  title: Scalars['String']['output'];
};

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

export type ConversationParticipant = {
  __typename?: 'ConversationParticipant';
  id: Scalars['ID']['output'];
  user: User;
};

export type CreateConversationInput = {
  title: Scalars['String']['input'];
  userId1: Scalars['ID']['input'];
  userId2: Scalars['ID']['input'];
};

export type HealthCheckResponse = {
  __typename?: 'HealthCheckResponse';
  result: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  sender: User;
};

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

export type Mutation = {
  __typename?: 'Mutation';
  createConversation: Conversation;
  sendMessage: SendMessageResponse;
};


export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};


export type MutationSendMessageArgs = {
  sendMessageInput: SendMessageInput;
};

export type Query = {
  __typename?: 'Query';
  getMessages: MessageConnection;
  getUserConversations: ConversationConnection;
  healthCheck: HealthCheckResponse;
  hello: Scalars['String']['output'];
  me: User;
  searchUsers: Array<User>;
};


export type QueryGetMessagesArgs = {
  conversationId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
};


export type QueryGetUserConversationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
};


export type QuerySearchUsersArgs = {
  query: Scalars['String']['input'];
};

export type SendMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
  senderId: Scalars['ID']['input'];
  socketId?: InputMaybe<Scalars['String']['input']>;
};

export type SendMessageResponse = {
  __typename?: 'SendMessageResponse';
  jobId?: Maybe<Scalars['ID']['output']>;
  result: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  auth0Id: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};
