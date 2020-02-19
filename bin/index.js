#!/usr/bin/env node

const program = require('commander')
const {version, JsartInit} = require('../dist/index.js')

program
  .version(version, '-v, --version')
  .usage('<command> [options]')

program
  .command('init <projectName>')
  .description('Init a project with default templete')
  .action(projectName => new JsartInit(projectName))

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
