# local-files
An easy to use local file server that makes designated directories available for use with your webapps via a simple to use client API or CLI.

## Motivation
I used to use Electron to create local graphics and (game) level editors. I realized that I didn't need much of what Electron provided. Mostly I needed to load and save files in local directories. I realized that a simple file server running in node could accomplish that.

There are other to achieve this in javascript through the browser, but none of the solutions are that great (at least currently). Similarly, you could accomplish this using Dropbox or Google Drive or similar services, but, again, it's not great if you want to work in a specific local directory without lots of scripting.

## How it works
You run a simple node server script that calls the localFiles() to start the file server. The server runs local-files by importing it via `import { localFilesServer } from 'local-files'` and start it with `localFiles()`. This turns on the local-files server (which internally uses express) and provides client access to the local-files API and the designated directory (which defaults to '.').

In your client, you include `import * as localFiles from 'local-files', and access the localFiles commands via, eg,  `const files = await localFiles.dir()`

## Installation
`npm install local-files`

## Complete Usage Example

You will need to clone this repository to see the full example. Here are the instructions:

1. `git clone https://github.com/davidfig/local-files.git`
2. `cd local-files`
3. `npm install`
4. `npm run start`
5. open browser to http://localhost:8090/

See sample directory for a simple file listing and content loading.

## Documentation

### CLI

`npm i -g local-files` will install local-files globally, or install it locally and use `node_modules/.bin/local-files`

`local-files --help` presents the help

Usage:
`local-files <directory="."> <port=9988> <limit=100mb>` will set up the server.

Either way, use the same client as below to access the hosted files.

### Server

import { localFilesServer }from 'local-files'

/**
 * create a localFiles server
 * @param {LocalFileOptions} [userOptions]
 * @param {string} [userOptions.directory='.'] to serve files
 * @param {number} [userOptions.port=9988] to host localFiles server
 * @param {Function} [userOptions.log=console.log] log output (if null then uses console.log, if false turns off logging)
 * @param {Function} [userOptions.error=console.error] log error (if null then uses console.error, if false turns off error logging)
 * @param {string} [userOptions.limit="500mb"] limit for size of files served
 */
export function localFiles(userOptions: Partial<LocalFilesOptions> = {}): Promise<void>

### Client

import * as localFiles from 'local-files'

export async function changePort(port: number) {
    _port = port
}

/**
 * get a directory listing
 * @returns {string[]}
 */
export async function dir(): Promise<string[]>

/**
 * Downloads a javascript data structure from the server
 * @param {string} filename of json file
 * @returns {*}
 */
export async function loadJson(filename: string): Promise<any>

/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export async function saveJson(filename: string, data: any): Promise<any>

/**
 * Checks whether file exists on server
 * @param {string} filename
 */
export async function exists(filename: boolean): Promise<boolean>

/**
 * Deletes a file from the server
 * @param {string} filename
 */
export async function unlink(filename: string): Promise<void>

/**
 * renames a file
 * @param {string} oldFilename
 * @param {string} newFilename
 */
export async function rename(oldFilename: string, newFilename: string): Promise<void>

/**
 * returns fs.stat results for filename
 * @param {string} filename
 * @returns {Stats}
 */
export async function stat(filename: string): Promise<Stats>

### Client URL Posting

It's also possible to POST to the webserver to get files and information. See localFiles for the format (documentation TBD if requested).

## License
MIT License
(c) 2021 [YOPEY YOPEY LLC](https://yopeyopey.com/) by David Figatner (https://twitter.com/yopey_yopey)