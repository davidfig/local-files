let _port = 9988

export interface Stats {
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;

    dev: number
    ino: number
    mode: number
    nlink: number
    uid: number
    gid: number
    rdev: number
    size: number
    blksize: number
    blocks: number
    atimeMs: number
    mtimeMs: number
    ctimeMs: number
    birthtimeMs: number
    atime: Date
    mtime: Date
    ctime: Date
    birthtime: Date
}

/**
 * Change port to access localFiles server
 * @param {number} port (default is 9988)
 */
export async function changePort(port: number) {
    _port = port
}

/**
 * get a directory listing
 * @returns {string[]}
 */
export async function dir(): Promise<string[]> {
    const response = await fetch(`http://localhost:${_port}/dir`)
    const json = await response.json()
    return json
}

/** @private */
async function _post(method: string, body: any): Promise<any> {
    const response = await fetch(`http://localhost:${_port}/${method}`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(body),
        headers: { 'content-type': "application/json" }
    })
    const json = await response.json()
    return json
}

/**
 * Downloads a javascript data structure from the server
 * @param {string} filename of json file
 * @returns {*}
 */
export async function loadJson(filename: string): Promise<any> {
    return await _post('downloadJson', { filename })
}

/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export async function saveJson(filename: string, data: any): Promise<any> {
    return await _post('uploadJson', { filename, data })
}

/**
 * Downloads a file from the server
 * @param {string} filename of file
 * @returns {string} contents of the file in string format
 */
export async function load(filename: string): Promise<string | null> {
    return await _post('download', { filename })
}

/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export async function save(filename: string, data: any): Promise<any> {
    return await _post('upload', { filename, data })
}

/**
 * Checks whether file exists on server
 * @param {string} filename
 */
export async function exists(filename: boolean): Promise<boolean> {
    return await _post('exists', { filename })
}

/**
 * Deletes a file from the server
 * @param {string} filename
 */
export async function unlink(filename: string): Promise<void> {
    return await _post('unlink', { filename })
}

/**
 * renames a file
 * @param {string} oldFilename
 * @param {string} newFilename
 */
export async function rename(oldFilename: string, newFilename: string): Promise<void> {
    return await _post('rename', { oldFilename, newFilename })
}

/**
 * returns fs.stat results for filename
 * @param {string} filename
 * @returns {Stats}
 */
export async function stat(filename: string): Promise<Stats> {
    return await _post('stat', { filename })
}