// @ts-check
import { test } from '@substrate-system/tapzero'
import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import path from 'node:path'
import * as util from 'node:util'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const stat = util.promisify(fs.stat)
const rm = util.promisify(fs.rm)

const cliPath = path.join(__dirname, '..', 'bin', 'to-string.js')

test('Use the CLI', async t => {
    const base64 = execSync(cliPath + ' nichoth testing').toString()
    t.ok(base64.includes('data:image/jpeg;'), 'should return base64 string')
})

test('Use the CLI with a local file', t => {
    const localFilePath = path.join(__dirname, '..', 'example', '100.jpg')
    const base64 = execSync(cliPath + ' ' + localFilePath)

    t.ok(base64.includes('data:image/jpeg;'), 'should return a base64 string')
})

test('resize an image to default sizes', async t => {
    const resizePath = path.join(__dirname, '..', 'bin', 'resize.js')
    execSync(resizePath + ' ' + path.join(__dirname, '..', 'example', '100.jpg' +
        // `testing` is relative to the cwd
        ' -o testing'))

    t.ok(await stat(path.join(__dirname, '../', 'testing', '100-480.jpg')),
        'should create the 480 file')
    t.ok(await stat(path.join(__dirname, '../', 'testing', '100-768.jpg')),
        'should create the 768 file')
    t.ok(await stat(path.join(__dirname, '../', 'testing', '100-1024.jpg')),
        'should create the 1024 file')
    t.ok(await stat(path.join(__dirname, '../', 'testing', '100.jpg')),
        'should copy the original file to the new directory')
})

test('clean up', async () => {
    await rm(path.join(process.cwd(), 'testing'), { recursive: true })
})
