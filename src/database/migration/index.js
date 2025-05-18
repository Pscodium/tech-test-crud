/* eslint-disable no-undef */
import mysql from 'mysql2/promise';
import fs from 'fs';
import chalk from 'chalk';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { environment } from '../../config/environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
    const db = await mysql.createConnection({
        host: environment.database.host,
        user: environment.database.user,
        password: environment.database.password,
        database: environment.database.name,
        port: environment.database.port
    });

    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    const queries = sql.split(';').map(query => query.trim()).filter(cmd => cmd.length > 0);

    for (const query of queries) {
        try {
            await db.query(query);
            console.log(chalk.green('Comando executado com sucesso:'), query.substring(0, 30));
        } catch (err) {
            console.error(chalk.red('Erro ao executar comando:'), query);
            console.error(err);
            throw err;
        }
    }
}

migrate()
    .then(() => {
        console.log(chalk.blueBright('Database migrated successfully'));
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });