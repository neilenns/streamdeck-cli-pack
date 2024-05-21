/**
 * The entrypoint for the action.
 */
const core = require('@actions/core')

try {
  const { run } = require('./main')

  run()
} catch (error) {
  core.setFailed(error.message)
}
