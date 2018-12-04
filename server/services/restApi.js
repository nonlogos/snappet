'use strict';
import axios from 'axios';

export class GithubGistAPI {
  constructor(accessToken) {
    this.token = accessToken;
    this.axiosInstance = axios.create({
      headers: {
        Authorization: `bearer ${this.token}`,
      },
    });
  }

  async getAllGists(gistsURI) {
    try {
      if (!gistsURI || typeof gistsURI !== 'string') throw 'a gistURI string is required';
      const baseGistsURI = gistsURI.split('{')[0];
      let finalResult = [];
      const page1Result = await this.axiosInstance.get(baseGistsURI).catch(error => this._apiErrorHandling(error));
      if (page1Result && page1Result.data && page1Result.data.length) finalResult.push(...page1Result.data);
      let hasNextLink = page1Result.headers.link.indexOf('next');
      let result = { ...page1Result };

      while (hasNextLink) {
        const nextResult = await this._apiPagination(result);
        if (nextResult && nextResult.data && nextResult.data.length) finalResult.push(...nextResult.data);
        hasNextLink = nextResult.headers.link.indexOf('next') > 0;
        result = { ...nextResult };
      }

      return finalResult;
    } catch (error) {
      console.log('getAllGists error', error);
      throw error;
    }
  }

  async _apiPagination(result) {
    try {
      const { link } = result.headers;
      const nextPageURI = this._getNextPageURI(result.headers.link);
      let nextPageResult = null;
      if (nextPageURI) {
        nextPageResult = await this.axiosInstance.get(nextPageURI).catch(error => this._apiErrorHandling(error));
      }
      return nextPageResult;
    } catch (error) {
      throw error;
    }
  }

  _getNextPageURI(linkStr) {
    const nextStr = linkStr.split(/,\s*</).filter(substr => substr.indexOf('next') > 0)[0];
    if (!nextStr) return null;
    return nextStr.substring(nextStr.indexOf('<') + 1, nextStr.indexOf('>'));
  }

  _apiErrorHandling(error) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: `Github api connection error: ${error.response.statusText}`,
      };
    }
  }
}
