import gql from 'graphql-tag';

export default `
  query Node($id: ID!) {
    node(id: $id) {
      ... on User {
        name
        login
        gists(first: 25) {
          edges {
            node {
              id
              description
              updatedAt
            }
          }
        }
      }
    }
  }
`;
