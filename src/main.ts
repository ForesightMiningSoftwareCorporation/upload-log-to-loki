import * as core from '@actions/core'
import {LogEntries, parse_logs} from './logs'
import {upload} from './upload'

async function run(): Promise<void> {
  try {
    const log_file: string = core.getInput('log_file')
    const separator: string = core.getInput('log_separator')
    const loki_url: string = core.getInput('loki_url')
    const loki_org_id: string = core.getInput('loki_org_id')
    const loki_username: string = core.getInput('loki_username')
    const loki_password: string = core.getInput('loki_password')
    const raw_loki_labels: string = core.getInput('loki_labels')
    const loki_labels: {[key: string]: string} = {}
    for (const raw_label of raw_loki_labels.split(',')) {
      const [key, value] = raw_label.split('=')
      loki_labels[key] = value
    }
    const entries: LogEntries = parse_logs(log_file, separator)
    if (entries.error) {
      core.setFailed(entries.error)
      return
    }
    await upload(
      entries,
      loki_url,
      loki_org_id,
      loki_username,
      loki_password,
      loki_labels
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
