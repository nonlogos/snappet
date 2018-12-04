'use strict';
import graghql, { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList } from 'graphql';
import GistFileType from './gist_file_type';

const GistType = new GraphQLObjectType({
  name: 'GistType',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    githubId: { type: GraphQLNonNull(GraphQLString) },
    isPublic: { type: GraphQLString },
    created_at: { type: GraphQLString },
    url: { type: GraphQLString },
    forks_url: { type: GraphQLString },
    commits_url: { type: GraphQLString },
    node_id: { type: GraphQLString },
    git_pull_url: { type: GraphQLString },
    git_push_url: { type: GraphQLString },
    html_url: { type: GraphQLString },
    files: {
      type: new GraphQLList(GistFileType),
      resolve(obj) {
        const { files } = obj;
        const filesArray = [];
        for (let key of Object.keys(files)) {
          filesArray.push(files[key]);
        }
        return filesArray;
      },
    },
    updated_at: { type: GraphQLString },
    description: { type: GraphQLString },
    comments_url: { type: GraphQLString },
    _user: { type: GraphQLID },
  },
});

export default GistType;
