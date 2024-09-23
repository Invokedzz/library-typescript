import dotenv from "dotenv";

import mysql from "mysql2/promise";

dotenv.config({
    path: __dirname + '/file.env' });

const userKey = process.env.SQL_USER;

const passKey = process.env.SQL_PASSWORD;

export const createPool = mysql.createPool({

    host: "localhost",

    user: userKey,

    password: passKey,

    database: "official_bookstore",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

});