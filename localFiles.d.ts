export interface Stats {
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
}
/**
 * Change port to access localFiles server
 * @param {number} port (default is 9988)
 */
export declare function changePort(port: number): Promise<void>;
/**
 * get a directory listing
 * @returns {string[]}
 */
export declare function dir(): Promise<string[]>;
/**
 * Downloads a javascript data structure from the server
 * @param {string} filename of json file
 * @returns {*}
 */
export declare function loadJson(filename: string): Promise<any>;
/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export declare function saveJson(filename: string, data: any): Promise<any>;
/**
 * Downloads a file from the server
 * @param {string} filename of file
 * @returns {string} contents of the file in string format
 */
export declare function load(filename: string): Promise<string | null>;
/**
 * Uploads a javascript data structure to the server
 * @param {string} filename of json file
 * @param {*} data
 */
export declare function save(filename: string, data: any): Promise<any>;
/**
 * Checks whether file exists on server
 * @param {string} filename
 */
export declare function exists(filename: boolean): Promise<boolean>;
/**
 * Deletes a file from the server
 * @param {string} filename
 */
export declare function unlink(filename: string): Promise<void>;
/**
 * renames a file
 * @param {string} oldFilename
 * @param {string} newFilename
 */
export declare function rename(oldFilename: string, newFilename: string): Promise<void>;
/**
 * returns fs.stat results for filename
 * @param {string} filename
 * @returns {Stats}
 */
export declare function stat(filename: string): Promise<Stats>;
