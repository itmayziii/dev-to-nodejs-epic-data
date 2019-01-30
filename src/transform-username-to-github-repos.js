const axios = require('axios')
const stream = require('stream')

module.exports = class TransformUsernameToGithubRepos extends stream.Transform {
  constructor (options = {}) {
    super({ ...options, objectMode: true })
    this.requests = []
  }

  _transform (chunk, encoding, callback) {
    const username = chunk[0]
    const githubRequest = this.getGithubRepositoriesForUser(username)
    this.requests.push(this.prepareGithubRequest(username, githubRequest))
    if (this.requests.length < 5) {
      return callback()
    }

    this.processRequests(callback)
  }

  _flush (callback) {
    this.processRequests(callback)
  }

  getGithubRepositoriesForUser (username) {
    return axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Token ${process.env.GITHUB_ACCESS_TOKEN}`
      }
    })
  }

  prepareGithubRequest (username, githubRequest) {
    return githubRequest
      .then((response) => {
        let repositories = []
        if (response.data) {
          repositories = response.data.map((repository) => repository.name)
        }

        return {
          username,
          repositories
        }
      })
  }

  processRequests (callback) {
    return Promise.all(this.requests)
      .then((responses) => {
        this.requests = []

        this.push(responses.reduce((accumulator, currentValue) => {
          return accumulator + JSON.stringify(currentValue)
        }, ''))
        callback()
      })
      .catch(callback)
  }
}
