const chalk = require('chalk')
const symbols = require('log-symbols')

class PrintTip {
  constructor () {
    const tipList = {
      success: chalk.greenBright(`${symbols.success} 成功`),
      fail: chalk.redBright(`${symbols.error} 失败`),
      error: chalk.redBright(`${symbols.error} 错误`),
      warming: chalk.yellow(`${symbols.warning} 提示`),
      version: chalk.blueBright('版本'),
      log: chalk.underline.white('提示')
    }

    Object.keys(tipList).forEach(key => {
      const value = tipList[key]
      this[key] = function (msg) {
        console.log(value, chalk.white(msg))
      }
    })
  }
}

module.exports = new PrintTip()
