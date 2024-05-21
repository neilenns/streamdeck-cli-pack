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
  const sdPluginPath = core.getInput('path')

  if (sdPluginPath === '') {
    const files = fs.readdirSync(process.cwd(), { withFileTypes: true })
    const sdPluginPath = files.find(
      file => file.isDirectory() && file.name.endsWith('.sdPlugin')
    )

    if (!sdPluginPath) {
      core.setFailed(
        'path not specified and no .sdPlugin directory found in the current working directory.'
      )
      return
    } else {
      sdPluginPath = file.name
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
