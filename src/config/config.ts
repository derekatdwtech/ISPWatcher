//Future Configuration
import yaml from 'js-yaml';
import fs from 'fs';
import * as path from 'path';

interface Config {
    environment: string,
    db: {
        type: string,
        filename?: string,
        hostname?: string,
        username?: string,
        password?: string,
        port?: number
    }
}

function GetConfig(): Config {
    const configfile = path.resolve(__dirname, 'default.yaml')
    const file = process.env.CONFIG_FILE || configfile ;
    const y = yaml.load(fs.readFileSync(file, 'utf-8')) as Config;

    if (y.db.type) {
        return y;
    }
    else {
        throw new Error(`Failed to load configuration file ${file}. Invalid YAML.`);
    }
}

export const Config = GetConfig();