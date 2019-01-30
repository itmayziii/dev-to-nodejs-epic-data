const fs = require('fs')
const path = require('path')

const readGithubUsernamesStream = fs.createReadStream(path.resolve(__dirname, '../github-usernames.json'))

let githubUsernames = ''
readGithubUsernamesStream.on('data', (data) => githubUsernames += data)
readGithubUsernamesStream.on('end', () => console.log(JSON.parse(githubUsernames)))
// Outputs
/*
  ['itmayziii',
  'dhershman1',
  'HetaRZinzuvadia',
  'joeswislocki',
  'justinvoelkel',
  'mandarm2593',
  'mfrost503',
  'wmontgomery',
  'kentcdodds',
  'gaearon',
  'btholt',
  'paulirish',
  'ryanflorence']
 */


