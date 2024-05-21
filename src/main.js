const exec = require('@actions/exec')
const core = require('@actions/core')
const fs = require('fs')

async function run() {
  const arguments = ['streamdeck', 'pack']

  arguments.push(getSdPluginPath())

  if (core.getInput('outputPath')) {
    arguments.push('--output', core.getInput('outputPath'))
  }

  if (core.getBooleanInput('force')) {
    arguments.push('--force')
  }

  if (core.getInput('version')) {
    arguments.push('--version', core.getInput('version'))
  }

  await exec.exec('npx', arguments)
}

function getSdPluginPath() {
  let sdPluginPath = core.getInput('path')

  if (sdPluginPath === '') {
    const files = fs.readdirSync(process.cwd(), { withFileTypes: true })
    const foundPlugin = files.find(
      file => file.isDirectory() && file.name.endsWith('.sdPlugin')
    )

    if (!foundPlugin) {
      core.setFailed(
        'path not specified and no .sdPlugin directory found in the current working directory.'
      )
      return
    } else {
      sdPluginPath = foundPlugin.name
      core.info(`Using auto-detected .sdPlugin directory '${sdPluginPath}'`)
    }
  }

  if (!fs.existsSync(sdPluginPath)) {
    core.setFailed(`Path '${sdPluginPath}' does not exist.`)
    return
  }

  return sdPluginPath
}
module.exports = {
  run
}
