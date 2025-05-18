/* eslint-disable no-undef */
import chalk from "chalk";
import app from "./app.js";
import { environment } from './config/environment.js';
import { getConnection } from "./database/index.js";

async function start() {
    try {
        const db_connection = await getConnection();
        if (!db_connection) {
            console.log(chalk.red('[DATABASE] Error on database connection!!'));
            throw new Error('[DATABASE] Error on database connection!!');
        }

        app.listen(environment.server.port);
    } catch (err) {
        console.log(chalk.red('[SERVER] Error on server start - '), err);
        throw new Error('[SERVER] Error on server start');
    }
}

start()
    .then(() => {
        console.log(chalk.greenBright(`[SERVER] - Server is running on port ${environment.server.port}`));
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });