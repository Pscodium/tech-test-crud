import mysql from 'mysql2/promise';
import { environment } from '../config/environment.js';
import chalk from 'chalk';

const db = mysql.createPool({
    host: environment.database.host,
    user: environment.database.user,
    password: environment.database.password,
    database: environment.database.name,
    port: environment.database.port
});

export async function getConnection() {
    try {
        const connection = await db.getConnection();
        console.log(chalk.blueBright('[DATABASE] - Successfully connected'));
        connection.release();
        return true;
    } catch (err) {
        console.error(err);
    }
}

export { db };