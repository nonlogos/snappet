'use strict';
import graphql, { GraphQLObjectType, GraphQLID, GraphQLList } from 'graphql';
import UserType from './user_type';
import GistType from './gist_type';
import { userFindById } from '../../services/dbHelpers/userHelper';
import { getGistsByUser } from '../../services/dbHelpers/gistHelper';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      async resolve(parentValue, args, req) {
        const user = await userFindById(req.user);
        return user;
      },
    },
    gists: {
      type: new GraphQLList(GistType),
      async resolve(parentValue, args, req) {
        const gists = await getGistsByUser(req.user);
        return gists;
      },
    },
  },
});

export default RootQueryType;
