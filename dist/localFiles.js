var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let _port = 9988;
/**
 * Change port to access localFiles server
 * @param {number} port (default is 9988)
 */
export function changePort(port) {
    return __awaiter(this, void 0, void 0, function* () {
        _port = port;
    });
}
/**
 * get a directory listing
 * @returns {string[]}
 */
export function dir() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:${_port}/dir`);
        const json = yield response.json();
        return json;
    });
}
/** @private */
function _post(method, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:${_port}/${method}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(body),
            headers: { 'content-type': "application/json" }
        });
        const json = yield response.json();
        return json;
    });
}
/**
 * Downloads a javascript data structure from the server
 * @param {string} filename of json file
 * @returns {*}
 */
export function loadJson(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('downloadJson', { filename });
    });
}
/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export function saveJson(filename, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('uploadJson', { filename, data });
    });
}
/**
 * Downloads a file from the server
 * @param {string} filename of file
 * @returns {string} contents of the file in string format
 */
export function load(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('download', { filename });
    });
}
/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export function save(filename, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('upload', { filename, data });
    });
}
/**
 * Checks whether file exists on server
 * @param {string} filename
 */
export function exists(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('exists', { filename });
    });
}
/**
 * Deletes a file from the server
 * @param {string} filename
 */
export function unlink(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('unlink', { filename });
    });
}
/**
 * renames a file
 * @param {string} oldFilename
 * @param {string} newFilename
 */
export function rename(oldFilename, newFilename) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('rename', { oldFilename, newFilename });
    });
}
/**
 * returns fs.stat results for filename
 * @param {string} filename
 * @returns {Stats}
 */
export function stat(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _post('stat', { filename });
    });
}
//# sourceMappingURL=localFiles.js.map