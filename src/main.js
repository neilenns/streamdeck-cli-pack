async function run() {
  const exec = require('@actions/exec')
  const core = require('@actions/core')

  const arguments = ['streamdeck', 'pack']

  try {
    if (core.getInput('path', { required: true })) {
      arguments.push(core.getInput('path'))
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

module.exports = {
  run
}
