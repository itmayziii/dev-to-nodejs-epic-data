const fs = require('fs')
const path = require('path')
const CsvParser = require('csv-parse')
const TransformUsernameToGithubRepos = require('./transform-username-to-github-repos')

const readGithubUsernamesStream = fs.createReadStream(path.resolve(__dirname, '../github-usernames.csv'))
const csvParser = new CsvParser({ columns: false })
const transformUsernameToGithubRepos = new TransformUsernameToGithubRepos()
const writeStream = fs.createWriteStream(path.resolve(__dirname, '../github-user-repositories.txt'))

let githubUserRepositories = []
readGithubUsernamesStream
  .pipe(csvParser)
  .pipe(transformUsernameToGithubRepos)
  .pipe(writeStream)
  .on('end', () => process.exit())
