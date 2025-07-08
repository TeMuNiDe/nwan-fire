import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'logs', 'api_log.log');

const logger = {
    log: (message) => {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        });
    }
};

export default logger;
