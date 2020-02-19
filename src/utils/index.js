const path = require('path')
const {execSync} = require('child_process')

function getRootPath () {
  return path.resolve(__dirname, '../../')
}

function getPkgPath () {
  return path.join(getRootPath(), 'package.json')
}

function shouldUseCnpm () {
  try {
    execSync('cnpm --version', {stdio: 'ignore'})
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  getRootPath,
  getPkgPath,
  shouldUseCnpm
}
