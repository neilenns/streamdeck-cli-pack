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

  const version = getVersion()

  if (version) {
    arguments.push('--version', version)
  }

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

  if (!githubRef) {
    core.warn('No github ref found, using manifest.json version')
    return undefined
  }

  // Try getting the version from the release tag
  if (githubRef.startsWith('refs/tags/')) {
    version = `${githubRef.replace('refs/tags/', '').replace('v', '')}.0`
    core.info(`Using github tag version '${version}'`)

    return version
  }

  // Try getting the version from the pull request number
  if (githubRef.startsWith('refs/pull/')) {
    version = `0.0.${githubRef.replace('refs/pull/', '')}`
    core.info(`Using github pull request number '${version}'`)

    return version
  }

  core.warn(
    'No version found in github environment, using manifest.json version'
  )
  return undefined
}

module.exports = {
  run
}
