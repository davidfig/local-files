let _port = 9988

/**
 * Change port to access localFiles server
 * @param {number} port
 */
export async function changePort(port)
{
    _port = port
}

/**
 * get a directory listing
 * @returns {string[]}
 */
export async function dir()
{
    const response = await fetch(`http://localhost:${_port}/dir`)
    const json = await response.json()
    return json
}

/** @private */
async function _post(method, body)
{
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
export async function loadJson(filename)
{
    return await _post('download', { filename })
}

/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export async function saveJson(filename, data)
{
    return await _post('upload', { filename, data })
}

/**
 * Checks whether file exists on server
 * @param {string} filename
 */
export async function exists(filename)
{
    return await _post('exists', { filename })
}

/**
 * Deletes a file from the server
 * @param {string} filename
 */
export async function unlink(filename)
{
    return await _post('unlink', { filename })
}

/**
 * renames a file
 * @param {string} oldFilename
 * @param {string} newFilename
 */
export async function rename(oldFilename, newFilename)
{
    return await _post('rename', { oldFilename, newFilename })
}

/**
 * returns fs.stat results for filename
 * @param {string} filename
 * @returns {Stats}
 */
export async function stat(filename)
{
    return await _post('stat', { filename })
}