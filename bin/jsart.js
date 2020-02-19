#!/usr/bin/env node

const program = require('commander')
const version = require('../src/utils/version')

const action_init = require('../src/action/jsart-init')
// const action_build = require('../src/action/jsart-build')
// const action_serve = require('../src/action/jsart-serve')
// const action_update = require('../src/action/jsart-update')

program
  .version(version, '-v, --version')
  .usage('<command> [options]')

program
  .command('init <projectName>')
  .description('Init a project with default templete')
  .action(action_init)

// program
//   .command('build')
//   .description('Build a project')
//   .action(action_build)

// program
//   .command('serve')
//   .description('Create development services a project')
//   .action(action_serve)

// program
//   .command('update')
//   .description('Update packages of jsart-cli')
//   .action(action_update)

program.parse(process.argv)
