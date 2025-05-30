/* eslint-disable no-undef */

const environment = {
    server: {
        port: process.env.SERVER_PORT
    },
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: 'mysql'
    }
};

export { environment };