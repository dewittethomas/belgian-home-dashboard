import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import ConfigurationManager from './config_manager.js';

const devMode = ConfigurationManager.getDevMode;

class Logger {
    static logFilePath = path.resolve('app.log');

    static initialize() {
        if (!fs.existsSync(Logger.logFilePath)) {
            fs.writeFileSync(Logger.logFilePath, '');
        }
    }

    static info(message) {
        Logger.log('INFO', message, chalk.green);
    }

    static warn(message) {
        Logger.log('WARN', message, chalk.yellow);
    }

    static error(message) {
        Logger.log('ERROR', message, chalk.red);  
    }

    static debug(message) {
        if (devMode) {
            Logger.log('DEBUG', message, chalk.magenta);
        }
    }
    
    static log(level, message, color) {
        const timestamp = new Date().toISOString();
        const formattedLevel = color(`[${level}]`);
        let logMessage = `${timestamp} ${formattedLevel}: ${message}`;

        console.log(logMessage);
        fs.appendFileSync(Logger.logFilePath, `${logMessage}\n`);
    }
}

Logger.initialize();

export default Logger;