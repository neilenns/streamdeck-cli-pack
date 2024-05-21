async function run() {
  const exec = require('@actions/exec')
  const core = require('@actions/core')

  const arguments = ['streamdeck', 'pack']

  try {
    if (core.getInput('outputPath', { required: true })) {
      arguments.push('--output', core.getInput('outputPath'))
    }
  } catch (error) {
    core.setFailed(`outputPath is required`)
    return
  }

  if (core.getBooleanInput('force')) {
    arguments.push('--force')
  }

  if (core.getInput('version')) {
    arguments.push('--version', core.getInput('version'))
  }

  await exec.exec('npx', arguments)
}
