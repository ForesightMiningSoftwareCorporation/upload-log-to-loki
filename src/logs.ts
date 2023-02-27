import * as fs from 'fs'
import * as core from '@actions/core'

export interface LogEntries {
  entries: string[][] | null
  error: string | null
}

export const parse_logs = (log_file: string, separator = '; '): LogEntries => {
  try {
    fs.accessSync(log_file, fs.constants.R_OK)
    const raw_entries = fs.readFileSync(log_file, 'utf-8')
    const entries: string[][] = []
    for (const line of raw_entries.split('\n')) {
      const line_splitted = line.split(separator)
      core.info(`Got ${line} from logs ${separator} ...`)
      if (line_splitted.length !== 2) continue
      // Parse the timestamp
      const [date_sec, nanoseconds] = line_splitted[0].split('.')
      const date = new Date(`${date_sec}Z`)
      if (isNaN(date.getTime())) continue
      const timestamp =
        date.getTime() * 1e6 + parseInt(nanoseconds.replace('Z', ''), 10)
      entries.push([`${timestamp}`, line_splitted[1]])
    }
    return {entries, error: null}
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return {entries: null, error: `Error: File ${err.path} not found`}
    } else if (err.code === 'EACCES') {
      return {entries: null, error: `Error: File ${err.path} cannot be read`}
    } else {
      return {entries: null, error: `Error: ${err.message}`}
    }
  }
}
