const express = require('express')
const path = require('path')
const localFiles = require('../server')

const HTML_PORT = 8090

localFiles({ directory: 'sample/files'})

const app = express()

app.use(express.static('sample'))
app.listen(HTML_PORT, () => console.log(`HTML server Listening on ${HTML_PORT}`))