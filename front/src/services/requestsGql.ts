import { gql } from "@apollo/client";

// ✅ Me (profil utilisateur actuel)
export const GET_ME = gql`
  query Me {
    me {
      id
      email
      username
    }
  }
`;

// ✅ Recherche d'utilisateurs par username
export const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      username
      email
    }
  }
`;

// ✅ Conversations de l'utilisateur connecté (avec pagination)
export const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations($cursor: String, $limit: Int!) {
    getUserConversations(cursor: $cursor, limit: $limit) {
      edges {
        cursor
        node {
          id
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

// ✅ Messages d'une conversation (avec pagination)
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

// ✅ Mutation pour créer une conversation
export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
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

// ✅ Mutation pour envoyer un message (retourne jobId + message)
export const SEND_MESSAGE = gql`
  mutation SendMessage($sendMessageInput: SendMessageInput!) {
    sendMessage(sendMessageInput: $sendMessageInput) {
      result
      jobId
    }
  }
`;
