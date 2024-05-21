const exec = require('@actions/exec')
const core = require('@actions/core')
const fs = require('fs')

async function run() {
  const arguments = ['streamdeck', 'pack']

  // Get the plugin path, either as specified in the workflow or auto-detected.
  arguments.push(getSdPluginPath())
  if (core.getInput('outputPath')) {
    arguments.push('--output', core.getInput('outputPath'))
  }

  // Get the version, either as specified in the workflow or from the GitHub environment.
  const version = getVersion()
  if (version) {
    arguments.push('--version', version)
  }

  // Set the --force flag if requested.
  if (core.getBooleanInput('force')) {
    arguments.push('--force')
  }

  // Set the --dry-run flag if requested.
  if (core.getBooleanInput('dryRun')) {
    arguments.push('--dry-run')
  }

  // Set the --force-update-check and --no-update-check flags if requested,
  // but only one or the other.
  const forceUpdateCheck = core.getBooleanInput('forceUpdateCheck')
  const noUpdateCheck = core.getBooleanInput('noUpdateCheck')
  if (forceUpdateCheck && noUpdateCheck) {
    core.setFailed(
      'forceUpdateCheck and noUpdateCheck cannot be set to true at the same time'
    )
    return
  }

  if (forceUpdateCheck) {
    arguments.push('--force-update-check')
  }

  if (noUpdateCheck) {
    arguments.push('--no-update-check')
  }

  // Run the actual command
  await exec.exec('npx', arguments)
}

/**
 * Figures out the location of the plugin directory. Uses the provided `path` input if it is set, otherwise
 * looks for a directory ending in `.sdPlugin` in the current working directory.
 * @returns {string} The path to the plugin directory
 */
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

/**
 * Figures out the version for the plugin. Uses the provided `version` input if it is set, otherwise
 * uses either the github tag version or the pull request number.
 * @returns {string} The version string
 */
function getVersion() {
  let version = core.getInput('version')

  if (version !== '') {
    return version
  }

  // Version wasn't specified so try getting something from the github environment
  const githubRef = process.env.GITHUB_REF

  // Try getting the version from the release tag
  if (githubRef && githubRef.startsWith('refs/tags/')) {
    version = `${githubRef.replace('refs/tags/', '').replace('v', '')}.0`
    core.info(`Using github tag version '${version}'`)
  } else {
    // Use the version from the run number, which is typically the pull request number
    version = `0.0.${process.env.GITHUB_RUN_NUMBER}.0`
    core.info(`Using github event and run number for version: '${version}'`)
  }

  return version
}

module.exports = {
  run
}
