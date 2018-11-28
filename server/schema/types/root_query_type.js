import graphql, { GraphQLObjectType, GraphQLID } from 'graphql';
import UserType from './user_type';
import mongoose from 'mongoose';
import '../../models/User';

const User = mongoose.model('User');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      async resolve(parentValue, args, req) {
        const user = await User.findOne({ id: req.user.id });
        return user;
      },
    },
  },
});

export default RootQueryType;
