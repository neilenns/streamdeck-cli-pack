async function run() {
  const exec = require('@actions/exec')
  const core = require('@actions/core')
  const fs = require('fs')
  const path = require('path')

  const arguments = ['streamdeck', 'pack']

  try {
    if (core.getInput('path', { required: true })) {
      const sdPluginPath = core.getInput('path')

      if (!fs.existsSync(sdPluginPath)) {
        core.setFailed(`Path '${sdPluginPath}' does not exist.`)
        return
      }

      arguments.push(sdPluginPath)
    }
  } catch (error) {
    core.setFailed(`path is required`)
    return
  }

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
