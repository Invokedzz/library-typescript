import { Request, Response } from "express";

import dotenv from "dotenv";

import mysql from "mysql2/promise";

dotenv.config({
    path: __dirname + 'file.env' });

const userKey = process.env.SQL_USER;

const passKey = process.env.SQL_PASS;

const createPool = mysql.createPool({

    host: "localhost",
    user: userKey,
    password: passKey,
    database: "official_bookstore",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

});

export const homepage = (req: Request, res: Response): void => {
    res.render('home');
};

export const addbook = (req: Request, res: Response): void => {
    res.render('addbook');
};

export const booklist = (req: Request, res: Response): void => {
    res.render('booklist');
};

export const useraccount = (req: Request, res: Response): void => {
    res.render('useraccount');
};

export const publishBook = (req: Request, res: Response): void => {

};

export const sendUser = (req: Request, res: Response): void => {

};