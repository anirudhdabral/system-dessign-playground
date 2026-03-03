export const typeDefs = `#graphql

  scalar JSON

  type Version {
    title: String!
    description: String!
    diagram: JSON
    createdAt: String!
  }

  type Playground {
    id: ID!
    title: String!
    description: String!
    isPublic: Boolean!
    diagram: JSON
    versions: [Version!]!
    createdAt: String
    updatedAt: String
  }

  type Query {
    playgrounds: [Playground]
    playground(id: ID!): Playground
    sharedPlayground(id: ID!): Playground
  }

  type Mutation {
    createPlayground(title: String!, description: String!): Playground
    updatePlayground(id: ID!, title: String!, description: String!, diagram: JSON, createVersion: Boolean = true): Playground
    togglePublic(id: ID!, isPublic: Boolean!): Playground
    deletePlayground(id: ID!): Boolean!
  }
`;
