import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {parse_logs} from "../src/logs";
import exp = require("constants");

// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_LOG_FILE'] = '__tests__/log.txt'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })
test('test log should fail if files is not existing', () => {
  const log_file = '__tests__/non_existing.txt'
  const log_entries = parse_logs(log_file);
  expect(log_entries.entries).toBeNull()
  expect(log_entries.error).toEqual(`Error: File ${log_file} not found`);
})

test('test log parsing should ignore empty lines or lines not haveing timestamp', () => {
  const log_file = '__tests__/log.txt'
  const log_entries = parse_logs(log_file);
  expect(log_entries.error).toBeNull()
  expect(log_entries.entries).toHaveLength(2);
})

test('test log parsing with different separator', () => {
  const log_file = '__tests__/log_2.txt'
  const separator = '#';
  const log_entries = parse_logs(log_file, separator);
  expect(log_entries.error).toBeNull()
  expect(log_entries.entries).toHaveLength(2);
})

test('test log parsing', () => {
  const log_file = '__tests__/log.txt'
  const log_entries = parse_logs(log_file);
  expect(log_entries.error).toBeNull()
  expect(log_entries.entries).not.toBeNull()
  expect(log_entries.entries).toHaveLength(2);
  expect(log_entries.entries![0][0]).toEqual('1677496460000781300');
  expect(log_entries.entries![0][1]).toEqual('fizz buzz');
  expect(log_entries.entries![1][0]).toEqual('1677496460000781800');
  expect(log_entries.entries![1][1]).toEqual('bizz fuzz');
})


test('test log parsing', () => {
  const log_file = '__tests__/log_3.txt'
  const log_entries = parse_logs(log_file);
  expect(log_entries.error).toBeNull()
  expect(log_entries.entries).not.toBeNull()
  expect(log_entries.entries).toHaveLength(2);
})
