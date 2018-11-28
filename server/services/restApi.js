import axios from 'axios';
import userQuery from '../schema/githubQueries/user';

// const axiosGithubGraphQL = axios.create({
//   baseURL: 'https://api.github.com/graphql',
//   headers: {
//     Authorization: `bearer `
//   }
// })

export class GithubGraphQL {
  constructor(accessToken) {
    this.token = accessToken;
    this.axiosInstance = axios.create({
      baseURL: 'https://api.github.com/graphql',
      headers: {
        Authorization: `bearer ${this.token}`,
      },
    });
  }

  async getNode(nodeId) {
    const result = await this.axiosInstance.post('', { query: userQuery, variables: { id: nodeId } });
    if (result && result.data) return result.data;
    return null;
  }
}
