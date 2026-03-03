import { gql } from "@apollo/client";

export const GET_PLAYGROUNDS = gql`
  query {
    playgrounds {
      id
      title
      description
    }
  }
`;

export const CREATE_PLAYGROUND = gql`
  mutation CreatePlayground($title: String!, $description: String!) {
    createPlayground(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;
