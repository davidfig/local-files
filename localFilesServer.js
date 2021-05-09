var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs-extra';
import path from 'path';
import express from 'express';
import cors from 'cors';
const defaultOptions = {
    directory: '.',
    port: 9988,
    log: console.log,
    error: console.error,
    limit: '500mb',
};
/**
 * create a localFiles server
 * @param {LocalFileOptions} [userOptions]
 * @param {string} [userOptions.directory='.'] to serve files
 * @param {number} [userOptions.port=9988] to host localFiles server
 * @param {Function} [userOptions.log=console.log] log output (if null then uses console.log, if false turns off logging)
 * @param {Function} [userOptions.error=console.error] log error (if null then uses console.error, if false turns off error logging)
 * @param {string} [userOptions.limit="500mb"] limit for size of files served
 */
export function localFilesServer(userOptions = {}) {
    return new Promise((resolve) => {
        const options = Object.assign(Object.assign({}, defaultOptions), userOptions);
        const resolveFilename = (filename = '') => path.join(options.directory, filename);
        const app = express();
        const log = options.log === false ? () => { } : options.log;
        const error = options.error === false ? () => { } : options.error;
        app.use(cors());
        app.get('/dir', (_, result) => __awaiter(this, void 0, void 0, function* () {
            const dir = yield fs.readdir(resolveFilename());
            log(`Dir request found ${dir.length} files.`);
            result.json(dir);
        }));
        app.use(express.json({ limit: options.limit }));
        app.use(express.json());
        app.post('/downloadJson', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield fs.readJSON(resolveFilename(req.body.filename));
                res.json(file);
                log(`Downloaded ${req.body.filename}.`);
            }
            catch (e) {
                error(`Error downloading ${req.body.filename}: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.post('/uploadJson', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.writeJSON(resolveFilename(req.body.filename), req.body.data);
                res.json({});
                log(`Uploaded ${req.body.filename}.`);
            }
            catch (e) {
                error(`Error uploading ${req.body.filename}: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.post('/download', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield fs.readFile(resolveFilename(req.body.filename));
                res.json({ file: file.toString() });
                log(`Downloaded ${req.body.filename}.`);
            }
            catch (e) {
                error(`Error downloading ${req.body.filename}: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.post('/upload', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.outputFile(resolveFilename(req.body.filename), req.body.data);
                res.json({});
                log(`Uploaded ${req.body.filename}.`);
            }
            catch (e) {
                error(`Error uploading ${req.body.filename}: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.post('/exists', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield fs.pathExists(resolveFilename(req.body.filename));
                res.json(exists);
                log(`Check if ${req.body.filename} exists (${exists ? 'it does' : 'it does not'}).`);
            }
            catch (e) {
                error(`Error checking if ${req.body.filename} exists: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.post('/rename', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.rename(resolveFilename(req.body.oldFilename), resolveFilename(req.body.newFilename));
                res.json({});
                log(`Rename ${req.body.oldFilename} to ${req.body.newFilename}.`);
            }
            catch (e) {
                error(`Error renaming ${req.body.oldFilename} to ${req.body.newFilename}: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.post('/unlink', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.unlink(resolveFilename(req.body.filename));
                res.json({});
                log(`Unlink ${req.body.filename}.`);
            }
            catch (e) {
                error(`Error unlinking ${req.body.filename}: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.post('/stat', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.json(yield fs.stat(resolveFilename(req.body.filename)));
            }
            catch (e) {
                error(`Error checking stat of ${req.body.filename}: ${e.message}`);
                res.json({ error: e.message });
            }
        }));
        app.listen(options.port, () => {
            console.log(`local-files server for ${options.directory}/ running on localhost:${options.port}`);
            resolve();
        });
    });
}
//# sourceMappingURL=localFilesServer.js.map