
const updateNotifier = require('update-notifier')
const $tip = require('./printTip')
const {getPkgPath} = require('./index')

const pkg = require(getPkgPath())
const notifier = updateNotifier({pkg, updateCheckInterval: 1000 * 60})

$tip.version(`Jsart v${pkg.version}`)

if (notifier.update) {
  $tip.version(`Jsart 有可更新版本: ${notifier.update.latest}，如需更新请执行 jsart update 命令`)
}

module.exports = pkg.version
