const fs = require('fs')
const path = require('path')
const CsvParser = require('csv-parse')
const TransformUsernameToGithubRepos = require('./transform-username-to-github-repos')
const stream = require('stream')

const readGithubUsernamesStream = fs.createReadStream(path.resolve(__dirname, '../github-usernames.csv'))
const csvParser = new CsvParser({ columns: false })
const transformUsernameToGithubRepos = new TransformUsernameToGithubRepos()
const writeStream = fs.createWriteStream(path.resolve(__dirname, '../github-user-repositories.txt'))

stream.pipeline(
  readGithubUsernamesStream,
  csvParser,
  transformUsernameToGithubRepos,
  writeStream,
  (error) => {
    if (error) {
      console.error('error ', error)
      return process.exit(1)
    }

    process.exit()
  }
)
