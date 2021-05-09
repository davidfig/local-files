export interface LocalFilesOptions {
    directory?: string;
    port?: number;
    log?: false | ((...data: any[]) => void);
    error?: false | ((...data: any[]) => void);
    limit?: string;
}
/**
 * create a localFiles server
 * @param {LocalFileOptions} [userOptions]
 * @param {string} [userOptions.directory='.'] to serve files
 * @param {number} [userOptions.port=9988] to host localFiles server
 * @param {Function} [userOptions.log=console.log] log output (if null then uses console.log, if false turns off logging)
 * @param {Function} [userOptions.error=console.error] log error (if null then uses console.error, if false turns off error logging)
 * @param {string} [userOptions.limit="500mb"] limit for size of files served
 */
export declare function localFilesServer(userOptions?: LocalFilesOptions): Promise<void>;
