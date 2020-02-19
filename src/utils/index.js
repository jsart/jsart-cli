const path = require('path')
const {execSync} = require('child_process')
const NODE_ENV = process.env.NODE_ENV || 'development'

function getRootPath () {
  return path.resolve(__dirname, NODE_ENV === 'production' ? '../' : '../../')
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
