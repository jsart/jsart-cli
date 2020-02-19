const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ora = require('ora')
const download = require('download-git-repo')
const handlebars = require('handlebars')
const {exec} = require('child_process')
const chalk = require('chalk')

const $tip = require('../utils/printTip')
const config = require('../config')
const {shouldUseCnpm} = require('../utils/index')

class InitProject {
  constructor (projectName) {
    this.projectName = projectName
    this.projectDir = process.cwd()
    return this.init
  }

  init () {
    const question = this.promptFillItem(fs.existsSync(this.projectName))
    inquirer.prompt(question).then(answers => {
      this.projectName = answers.projectName || this.projectName
      this.projectPath = path.join(this.projectDir, this.projectName)
      this.answers = answers
      $tip.log('Jsart 即将创建一个新项目！')
      this.downloadTpl().then(() => {
        this.initGit()
        this.installPkg().then(() => {
          $tip.success(`创建项目 ${chalk.green.bold(this.projectName)} 成功！`)
          $tip.success(`请进入项目目录 ${chalk.green.bold(this.projectName)} 开始工作吧！😝`)
        })
      })
    })
  }

  promptFillItem (needProjectName) {
    const fillItem  = []

    // 项目名称
    if (needProjectName) {
      fillItem.push({
        type: 'input',
        name: 'projectName',
        message: '当前目录已经存在 ${projectName} 项目，请换一个项目名！',
        validate (input) {
          if (!input) {
            return '项目名不能为空！'
          }
          if (fs.existsSync(input)) {
            return '项目名依然重复！'
          }
          return true
        }
      })
    }

    // 项目介绍
    fillItem.push({
      type: 'input',
      name: 'description',
      message: '请输入项目介绍！'
    })

    // CSS预处理器
    fillItem.push({
      type: 'list',
      name: 'css',
      message: '请选择 CSS 预处理器 (Sass/Less)',
      choices: [
        {name: 'Sass', value: 'sass'},
        {name: 'Less', value: 'less'},
        {name: '无', value: 'none'}
      ]
    })

    return fillItem
  }

  downloadTpl () {
    const {projectName, answers} = this
    return new Promise(resolve => {
      const spinner = ora('正在下载模板文件...')
      spinner.start()
      download(config.tplGitUrl, projectName, {clone: true}, err => {
        if (err) {
          spinner.fail()
          $tip.error('模板下载失败，请重试！')
          $tip.error(err)
        } else {
          spinner.succeed()
          const pkgFileName = `${projectName}/package.json`
          const meta = {
            name: answers.projectName || projectName,
            description: answers.description
          }
          if (fs.existsSync(pkgFileName)) {
            const content = fs.readFileSync(pkgFileName).toString()
            const result = handlebars.compile(content)(meta)
            fs.writeFileSync(pkgFileName, result)
          }
          $tip.success('模板下载成功！')
          resolve()
        }
      })
    })
  }

  initGit () {
    const {projectName, projectPath} = this
    const spinner = ora(`cd ${chalk.cyan.bold(projectName)}, 执行 ${chalk.cyan.bold('git init')}`)
    spinner.start()
    process.chdir(projectPath)
    const gitInit = exec('git init')
    gitInit.on('close', code => {
      if (code === 0) {
        spinner.color = 'green'
        spinner.succeed(gitInit.stdout.read())
      } else {
        spinner.color = 'red'
        spinner.fail(gitInit.stderr.read())
      }
    })
  }

  installPkg () {
    return new Promise(resolve => {
      if (!config.autoInstallPkg) return resolve()
      const command = shouldUseCnpm() ? 'cnpm install' : 'npm install'
      const spinner = ora(`执行安装项目依赖 ${chalk.cyan.bold(command)}, 请稍等...`)
      spinner.start()
      exec(command, (error, stdout, stderr) => {
        if (error) {
          spinner.fail()
          $tip.error('安装项目依赖失败，请自行重新安装！')
          $tip.error(error)
        } else {
          spinner.succeed()
          $tip.success('依赖安装成功！')
          $tip.success(`${stderr}${stdout}`)
        }
        resolve()
      })
    })
  }
}

module.exports = new InitProject()
