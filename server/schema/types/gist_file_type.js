'use strict';
import graghql, { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';

const GistFileType = new GraphQLObjectType({
  name: 'GistFileType',
  fields: {
    filename: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) },
    language: { type: GraphQLString },
    raw_url: { type: GraphQLNonNull(GraphQLString) },
    size: { type: GraphQLInt },
  },
});

export default GistFileType;
