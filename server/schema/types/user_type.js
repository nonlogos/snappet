import graghql, { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    githubId: { type: GraphQLString },
    avatar_url: { type: GraphQLString },
    gists_url: { type: GraphQLString },
    nickName: { type: GraphQLString },
    name: { type: GraphQLString },
    api_token: { type: GraphQLString },
    node_id: { type: GraphQLString },
  },
});

export default UserType;
