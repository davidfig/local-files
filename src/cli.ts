#!/usr/bin/env node

import { LocalFilesOptions, localFilesServer } from './localFilesServer.js'

function arg(name: string): string | undefined {
    for (let i = 2; i < process.argv.length; i++) {
        if (process.argv[i].includes(`${name}=`)) {
            const split = process.argv[i].split('=')
            return split[1]
        }
    }
}

function start() {
    console.log(process.argv)
    if (process.argv[2] === '--help') {
        console.log('localFilesServer <directory="."> <port=9988> <limit=100mb>')
        process.exit(0)
    } else {
        const options: Partial<LocalFilesOptions> = {}
        const port = arg('port')
        if (port) {
            options.port = parseInt(port)
        }
        const directory = arg('directory')
        if (directory) {
            options.directory = directory
        }
        const limit = arg('limit')
        if (limit) {
            options.limit = limit
        }
        localFilesServer(options)
    }
}

start()