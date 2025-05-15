// You need to install node version using the .nvmrc cause in this node version you don't need to use dotenv lib

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
}

export { environment };