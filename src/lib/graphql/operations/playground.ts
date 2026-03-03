import { gql } from "@apollo/client";

export const GET_PLAYGROUND = gql`
  query GetPlayground($id: ID!) {
    playground(id: $id) {
      id
      title
      description
      isPublic
      diagram
      versions {
        title
        description
        diagram
        createdAt
      }
    }
  }
`;

export const UPDATE_PLAYGROUND = gql`
  mutation UpdatePlayground($id: ID!, $title: String!, $description: String!, $diagram: JSON, $createVersion: Boolean) {
    updatePlayground(
      id: $id
      title: $title
      description: $description
      diagram: $diagram
      createVersion: $createVersion
    ) {
      id
      title
      description
      diagram
      versions {
        title
        description
        diagram
        createdAt
      }
    }
  }
`;

export const TOGGLE_PUBLIC = gql`
  mutation TogglePublic($id: ID!, $isPublic: Boolean!) {
    togglePublic(id: $id, isPublic: $isPublic) {
      id
      isPublic
    }
  }
`;

export const DELETE_PLAYGROUND = gql`
  mutation DeletePlayground($id: ID!) {
    deletePlayground(id: $id)
  }
`;

export const GET_SHARED_PLAYGROUND = gql`
  query GetSharedPlayground($id: ID!) {
    sharedPlayground(id: $id) {
      id
      title
      description
      isPublic
      diagram
    }
  }
`;
