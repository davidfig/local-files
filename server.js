const fs = require('fs-extra')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

/**
 * create a localFiles server
 * @param {object} [options]
 * @param {string} [options.directory='.'] to serve files
 * @param {number} [options.port=9988] to host localFiles server
 * @param {boolean} [options.log] output operations
 */
module.exports = function(options={})
{
    return new Promise(resolve =>
    {
        const resolveFilename = (filename = '') => path.join(process.cwd(), directory, filename)
        const log = s => { if (options.log) console.log(s) }

        const app = express()
        app.use(cors())

        app.get('/dir', async (req, res) =>
        {
            const dir = await fs.readdir(resolveFilename())
            const results = dir.filter(filename => filename.includes('.json'))
            log(`Dir request found ${results.length} files.`)
            res.json(results)
        })

        app.use(bodyParser.json())
        app.post('/download', async (req, res) =>
        {
            try
            {
                const file = await fs.readJSON(resolveFilename(req.body.filename))
                res.json(file)
                log(`Downloaded ${req.body.filename}.`)
            }
            catch (e)
            {
                res.json({ error: e.message })
            }
        })
        app.post('/upload', async (req, res) =>
        {
            try
            {
                await fs.writeJSON(resolveFilename(req.body.filename), req.body.json)
                res.json({})
                log(`Uploaded ${req.body.filename}.`)
            }
            catch (e)
            {
                res.json({ error: e.message })
            }
        })
        app.post('/exists', async (req, res) =>
        {
            try
            {
                const exists = await fs.exists(resolveFilename(req.body.filename))
                res.json(exists)
                log(`Check if ${req.body.filename} exists (${exists ? 'it does' : 'it does not'}).`)
            }
            catch (e)
            {
                res.json({ error: e.message })
            }
        })
        app.post('/rename', async (req, res) =>
        {
            try
            {
                await fs.rename(resolveFilename(req.body.oldFilename), resolveFilename(req.body.newFilename))
                res.json({})
                log(`Rename ${req.body.oldFilename} to ${req.body.newFilename}.`)
            }
            catch (e)
            {
                res.json({ error: e.message })
            }
        })
        app.post('/unlink', async (req, res) =>
        {
            try
            {
                await fs.unlink(resolveFilename(req.body.filename))
                res.json({})
                log(`Unlink ${req.body.filename}.`)
            }
            catch (e)
            {
                res.json({ error: e.message })
            }
        })
        app.post('/stat', async (req, res) =>
        {
            try
            {
                res.json(await fs.stat(resolveFilename(req.body.filename)))
            }
            catch (e)
            {
                res.json({ error: e.message })
            }
        })
        const port = options.port || 9988
        const directory = options.directory || '.'
        app.listen(port, () =>
        {
            console.log(`local-files server for ${directory}/ running on localhost:${port}`)
            resolve()
        })
    })
}