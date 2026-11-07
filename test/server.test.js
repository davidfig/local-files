import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'

import { localFilesServer } from '../localFilesServer.js'

const PORT = 19987
const ALLOWED_ORIGIN = 'http://tools.example.test:3000'

let parent, root, outside

/** Uses http.request because fetch won't send a custom Host header. */
function request(pathname, { method = 'GET', body, host = `localhost:${PORT}`, origin, address = 'localhost' } = {}) {
    return new Promise((resolve, reject) => {
        const headers = { host }
        if (origin) {
            headers.origin = origin
        }
        const data = body === undefined ? undefined : JSON.stringify(body)
        if (data) {
            headers['content-type'] = 'application/json'
            headers['content-length'] = Buffer.byteLength(data)
        }
        const req = http.request({ host: address, port: PORT, path: pathname, method, headers }, (res) => {
            let text = ''
            res.on('data', (chunk) => (text += chunk))
            res.on('end', () => {
                let json
                try {
                    json = JSON.parse(text)
                } catch {
                    json = text
                }
                resolve({ status: res.statusCode, headers: res.headers, json })
            })
        })
        req.on('error', reject)
        req.end(data)
    })
}

const post = (route, body, options) => request(`/${route}`, { method: 'POST', body, ...options })

before(async () => {
    parent = fs.mkdtempSync(path.join(os.tmpdir(), 'local-files-'))
    root = path.join(parent, 'served')
    outside = path.join(parent, 'secret.txt')
    fs.mkdirSync(path.join(root, 'nested'), { recursive: true })
    fs.writeFileSync(path.join(root, 'data.json'), '{"a":1}')
    fs.writeFileSync(path.join(root, 'nested', 'file.txt'), 'nested')
    fs.writeFileSync(path.join(root, '..not-a-parent.txt'), 'dots')
    fs.writeFileSync(outside, 'secret')
    await localFilesServer({ directory: root, port: PORT, log: false, error: false, allowedOrigins: [ALLOWED_ORIGIN] })
})

after(() => fs.rmSync(parent, { recursive: true, force: true }))

describe('files inside the served directory', () => {
    it('lists the directory', async () => {
        const { status, json } = await request('/dir')
        assert.equal(status, 200)
        assert.ok(json.includes('data.json'))
    })

    it('reads, writes, renames and deletes', async () => {
        assert.deepEqual((await post('downloadJson', { filename: 'data.json' })).json, { a: 1 })
        assert.deepEqual((await post('upload', { filename: 'nested/new.txt', data: 'hi' })).json, {})
        assert.deepEqual((await post('download', { filename: 'nested/new.txt' })).json, { file: 'hi' })
        assert.deepEqual((await post('rename', { oldFilename: 'nested/new.txt', newFilename: 'renamed.txt' })).json, {})
        assert.equal((await post('exists', { filename: 'renamed.txt' })).json, true)
        assert.deepEqual((await post('unlink', { filename: 'renamed.txt' })).json, {})
        assert.equal((await post('exists', { filename: 'renamed.txt' })).json, false)
    })

    it('keeps paths that only look like they leave', async () => {
        assert.deepEqual((await post('download', { filename: 'nested/../data.json' })).json, { file: '{"a":1}' })
        assert.deepEqual((await post('download', { filename: '/data.json' })).json, { file: '{"a":1}' })
        assert.deepEqual((await post('download', { filename: '..not-a-parent.txt' })).json, { file: 'dots' })
    })
})

describe('paths outside the served directory', () => {
    const escapes = ['../secret.txt', 'nested/../../secret.txt', '../served/../secret.txt']

    for (const filename of escapes) {
        it(`refuses to read ${filename}`, async () => {
            for (const route of ['download', 'downloadJson', 'stat']) {
                const { json } = await post(route, { filename })
                assert.ok(json.error, `${route} should return an error`)
                assert.ok(!JSON.stringify(json).includes('secret"'), `${route} should not return the contents`)
            }
            assert.ok((await post('exists', { filename })).json.error)
        })

        it(`refuses to change ${filename}`, async () => {
            assert.ok((await post('upload', { filename, data: 'overwritten' })).json.error)
            assert.ok((await post('uploadJson', { filename, data: {} })).json.error)
            assert.ok((await post('unlink', { filename })).json.error)
            assert.equal(fs.readFileSync(outside, 'utf8'), 'secret')
        })
    }

    it('refuses to rename across the boundary, in either direction', async () => {
        assert.ok((await post('rename', { oldFilename: '../secret.txt', newFilename: 'stolen.txt' })).json.error)
        assert.ok((await post('rename', { oldFilename: 'data.json', newFilename: '../moved.json' })).json.error)
        assert.ok(fs.existsSync(outside))
        assert.ok(fs.existsSync(path.join(root, 'data.json')))
        assert.ok(!fs.existsSync(path.join(parent, 'moved.json')))
    })
})

describe('browser origins', () => {
    for (const origin of [`http://localhost:8090`, 'http://127.0.0.1:5173', 'http://[::1]:3000', 'https://localhost', ALLOWED_ORIGIN]) {
        it(`allows ${origin}`, async () => {
            const { status, headers } = await request('/dir', { origin })
            assert.equal(status, 200)
            assert.equal(headers['access-control-allow-origin'], origin)
        })
    }

    it('answers the preflight from an allowed origin', async () => {
        const { status } = await request('/upload', { method: 'OPTIONS', origin: 'http://localhost:8090' })
        assert.equal(status, 204)
    })

    for (const origin of ['https://evil.example', 'http://evil.localhost:8090', 'http://localhost.evil.example', 'null', 'file://', 'chrome-extension://localhost']) {
        it(`blocks ${origin}, and doesn't run the request`, async () => {
            assert.equal((await request('/dir', { origin })).status, 403)
            assert.equal((await request('/upload', { method: 'OPTIONS', origin })).status, 403)
            const { status } = await post('upload', { filename: 'attack.txt', data: 'x' }, { origin })
            assert.equal(status, 403)
            assert.ok(!fs.existsSync(path.join(root, 'attack.txt')))
        })
    }

    it('still allows requests with no origin, such as curl', async () => {
        assert.equal((await request('/dir')).status, 200)
    })
})

describe('network', () => {
    for (const host of ['evil.example', `evil.example:${PORT}`, `localhost.evil.example:${PORT}`, '192.168.1.5']) {
        it(`blocks the Host header ${host} (DNS rebinding)`, async () => {
            assert.equal((await request('/dir', { host })).status, 403)
        })
    }

    for (const host of [`localhost:${PORT}`, `127.0.0.1:${PORT}`, `[::1]:${PORT}`]) {
        it(`allows the Host header ${host}`, async () => {
            assert.equal((await request('/dir', { host })).status, 200)
        })
    }

    it('only listens on the loopback interface', async () => {
        const external = Object.values(os.networkInterfaces()).flat().find((i) => i.family === 'IPv4' && !i.internal)
        if (!external) {
            return
        }
        await assert.rejects(request('/dir', { address: external.address }))
    })
})
