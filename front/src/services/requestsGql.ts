import { gql } from "@apollo/client";

// Query to fetch the current logged-in user's profile information (id, email, username)
export const GET_ME = gql`
  query Me {
    me {
      id
      email
      username
    }
  }
`;

// Query to search for users by username, returning id, username, and email for matches
export const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      username
      email
    }
  }
`;

// Query to fetch conversations of the authenticated user with pagination support
// Returns conversation details including messages and participants info
export const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations($cursor: String, $limit: Int!) {
    getUserConversations(cursor: $cursor, limit: $limit) {
      edges {
        cursor
        node {
          id
          title
          messages {
            content
            createdAt
            sender {
              username
            }
          }
          participants {
            id
            user {
              id
              username
              email
              auth0Id
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
    }
  }
`;

// Query to fetch messages of a specific conversation with pagination support
// Returns message id, content, creation date, and sender info
export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!, $cursor: String, $limit: Int!) {
    getMessages(conversationId: $conversationId, cursor: $cursor, limit: $limit) {
      edges {
        cursor
        node {
          id
          content
          createdAt
          sender {
            id
            username
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
    }
  }
`;

// Mutation to create a new conversation between users with given input data
// Returns the new conversation id, title, and participant details
export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      title
      participants {
        id
        user {
          id
          username
        }
      }
    }
  }
`;

// Mutation to send a message in a conversation
// Returns a result string and optional jobId (e.g., for async processing)
export const SEND_MESSAGE = gql`
  mutation SendMessage($sendMessageInput: SendMessageInput!) {
    sendMessage(sendMessageInput: $sendMessageInput) {
      result
      jobId
    }
  }
`;
