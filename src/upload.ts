import {LogEntries} from './logs'
import fetch from 'node-fetch'

export const upload = async (
  entries: LogEntries,
  url: string,
  org_id: string,
  username: string,
  password: string,
  loki_labels: {[key: string]: string}
): Promise<void> => {
  const auth = `Basic ${Buffer.from(`${username}:${password}`).toString(
    'base64'
  )}`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: auth,
    'X-Scope-OrgID': org_id
  }

  const data = {
    streams: [
      {
        stream: loki_labels,
        values: entries.entries
      }
    ]
  }

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  }

  await fetch(url, options)
}
