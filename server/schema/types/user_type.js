'use strict';
import graghql, { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
import GistType from './gist_type';
import { getGistsByUser } from '../../services/dbHelpers/gistHelper';

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLString },
    githubId: { type: GraphQLNonNull(GraphQLString) },
    avatar_url: { type: GraphQLString },
    gists_url: { type: GraphQLNonNull(GraphQLString) },
    nickName: { type: GraphQLString },
    name: { type: GraphQLString },
    api_token: { type: GraphQLString },
    node_id: { type: GraphQLString },
    gists: {
      type: new GraphQLList(GistType),
      async resolve(parentValue, args) {
        // const gists = await getGistsByUser(parentValue.id);
        // return gists;
      },
    },
  },
});

export default UserType;
