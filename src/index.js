/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'
import { run } from './main.js'

try {
  await run()
} catch (error) {
  core.setFailed(error.message)
}
