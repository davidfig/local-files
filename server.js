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
 */
module.exports = function(options={})
{
    const resolveFilename = (filename = '') => path.join(__dirname, directory, filename)

    const app = express()
    app.use(cors())

    app.get('/dir', async (req, res) => {
        const dir = await fs.readdir(resolveFilename())
        res.json(dir)
    })

    app.use(bodyParser.json())
    app.post('/download', async (req, res) => {
        try
        {
            const file = await fs.readJSON(resolveFilename(req.body.filename))
            res.json(file)
        }
        catch(e)
        {
            res.json({ error: e.message })
        }
    })
    app.post('/upload', async (req, res) => {
        try
        {
            await fs.writeJSON(resolveFilename(req.body.filename), req.body.json)
            res.json({})
        }
        catch(e)
        {
            res.json({ error: e.message})
        }
    })
    app.post('/exists', async (req, res) => {
        try
        {
            const exists = await fs.exists(resolveFilename(req.body.filename))
            res.json(exists)
        }
        catch(e)
        {
            res.json({ error: e.message })
        }
    })
    app.post('/rename', async (req, res) => {
        try
        {
            await fs.rename(resolveFilename(req.body.oldFilename), resolveFilename(req.body.newFilename))
            res.json({})
        }
        catch(e)
        {
            res.json({ error: e.message })
        }
    })
    app.post('/unlink', async (req, res) => {
        try
        {
            await fs.unlink(resolveFilename(req.body.filename))
            res.json({})
        }
        catch(e)
        {
            res.json({ error: e.message })
        }
    })
    const port = options.port || 9988
    const directory = options.directory || '.'
    console.log(`local-files server for ${directory}/ running on localhost:${port}`)
    app.listen(port)
}