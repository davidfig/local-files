import express from 'express'
import { localFilesServer } from '../dist/localFilesServer.js'

const HTML_PORT = 8090

localFilesServer({ directory: 'src' })

const app = express()
app.use(express.static('.'))
app.listen(HTML_PORT, () => console.log(`HTML server Listening on http://localhost:${HTML_PORT}/sample-bundled/ (open browser here)`))