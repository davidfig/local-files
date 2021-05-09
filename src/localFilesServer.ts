import fs from 'fs-extra'
import path from 'path'
import express from 'express'
import cors from 'cors'

export interface LocalFilesOptions {
    directory?: string
    port?: number
    log?: false | ((...data: any[]) => void)
    error?: false | ((...data: any[]) => void)
    limit?: string
}

interface LocalFilesOptionsAll {
    directory: string
    port: number
    log: false | ((...data: any[]) => void)
    error: false | ((...data: any[]) => void)
    limit: string
}

const defaultOptions: LocalFilesOptions = {
    directory: '.',
    port: 9988,
    log: console.log,
    error: console.error,
    limit: '500mb',
}

/**
 * create a localFiles server
 * @param {LocalFileOptions} [userOptions]
 * @param {string} [userOptions.directory='.'] to serve files
 * @param {number} [userOptions.port=9988] to host localFiles server
 * @param {Function} [userOptions.log=console.log] log output (if null then uses console.log, if false turns off logging)
 * @param {Function} [userOptions.error=console.error] log error (if null then uses console.error, if false turns off error logging)
 * @param {string} [userOptions.limit="500mb"] limit for size of files served
 */
export function localFilesServer(userOptions: LocalFilesOptions = {}): Promise<void> {
    return new Promise((resolve: () => void) => {
        const options: LocalFilesOptionsAll = { ...defaultOptions as LocalFilesOptionsAll, ...userOptions as LocalFilesOptionsAll }
        const resolveFilename = (filename = '') => path.join(options.directory, filename)
        const app = express()
        const log = options.log === false ? () => { } : options.log
        const error = options.error === false ? () => { } : options.error
        app.use(cors())
        app.get('/dir', async (_: express.Request, result: express.Response) => {
            const dir = await fs.readdir(resolveFilename())
            log(`Dir request found ${dir.length} files.`)
            result.json(dir)
        })
        app.use(express.json({ limit: options.limit }))
        app.use(express.json())

        app.post('/downloadJson', async (req: express.Request, res: express.Response) => {
            try {
                const file = await fs.readJSON(resolveFilename(req.body.filename))
                res.json(file)
                log(`Downloaded ${req.body.filename}.`)
            }
            catch (e) {
                error(`Error downloading ${req.body.filename}: ${e.message}`)
                res.json({ error: e.message })
            }
        })

        app.post('/uploadJson', async (req: express.Request, res: express.Response) => {
            try {
                await fs.writeJSON(resolveFilename(req.body.filename), req.body.data)
                res.json({})
                log(`Uploaded ${req.body.filename}.`)
            }
            catch (e) {
                error(`Error uploading ${req.body.filename}: ${e.message}`)
                res.json({ error: e.message })
            }
        })

        app.post('/download', async (req: express.Request, res: express.Response) => {
            try {
                const file = await fs.readFile(resolveFilename(req.body.filename))
                res.json({ file: file.toString() })
                log(`Downloaded ${req.body.filename}.`)
            }
            catch (e) {
                error(`Error downloading ${req.body.filename}: ${e.message}`)
                res.json({ error: e.message })
            }
        })

        app.post('/upload', async (req: express.Request, res: express.Response) => {
            try {
                await fs.outputFile(resolveFilename(req.body.filename), req.body.data)
                res.json({})
                log(`Uploaded ${req.body.filename}.`)
            }
            catch (e) {
                error(`Error uploading ${req.body.filename}: ${e.message}`)
                res.json({ error: e.message })
            }
        })

        app.post('/exists', async (req: express.Request, res: express.Response) => {
            try {
                const exists = await fs.pathExists(resolveFilename(req.body.filename))
                res.json(exists)
                log(`Check if ${req.body.filename} exists (${exists ? 'it does' : 'it does not'}).`)
            }
            catch (e) {
                error(`Error checking if ${req.body.filename} exists: ${e.message}`)
                res.json({ error: e.message })
            }
        })
        app.post('/rename', async (req: express.Request, res: express.Response) => {
            try {
                await fs.rename(resolveFilename(req.body.oldFilename), resolveFilename(req.body.newFilename))
                res.json({})
                log(`Rename ${req.body.oldFilename} to ${req.body.newFilename}.`)
            }
            catch (e) {
                error(`Error renaming ${req.body.oldFilename} to ${req.body.newFilename}: ${e.message}`)
                res.json({ error: e.message })
            }
        })
        app.post('/unlink', async (req: express.Request, res: express.Response) => {
            try {
                await fs.unlink(resolveFilename(req.body.filename))
                res.json({})
                log(`Unlink ${req.body.filename}.`)
            }
            catch (e) {
                error(`Error unlinking ${req.body.filename}: ${e.message}`)
                res.json({ error: e.message })
            }
        })
        app.post('/stat', async (req: express.Request, res: express.Response) => {
            try {
                res.json(await fs.stat(resolveFilename(req.body.filename)))
            }
            catch (e) {
                error(`Error checking stat of ${req.body.filename}: ${e.message}`)
                res.json({ error: e.message })
            }
        })
        app.listen(options.port, () => {
            console.log(`local-files server for ${options.directory}/ running on localhost:${options.port}`)
            resolve()
        })
    })
}