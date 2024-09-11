import { Request, Response } from "express";

import validator from "validator";

import { validationResult } from "express-validator";

import dotenv from "dotenv";

import mysql from "mysql2/promise";

dotenv.config({
    path: __dirname + '/file.env' });

const userKey = process.env.SQL_USER;

const passKey = process.env.SQL_PASSWORD;

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

export const booklist = async (req: Request, res: Response): Promise <void | boolean> => {

    try {

        const connect = await createPool.getConnection();

        try {

            const [rowsbooks] = await connect.query("SELECT * FROM books");
            res.render('booklist', {books: rowsbooks});

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again!");

    };

};

export const useraccount = async (req: Request, res: Response): Promise <void | boolean> => {

    const id = req.params.id;
    
    try {

        const connect = await createPool.getConnection();

        try {

            const [getid] = await connect.query(`SELECT * FROM users WHERE id = ${id}`);
            res.render('useraccount', {user: getid});

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again");

    };
    
};

// As function for POST requests

export const publishBook = async (req: Request, res: Response): Promise <void | boolean> => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return false;
    };

    const title: string = req.body.title;

    const author: string = req.body.author;

    const description: string = req.body.description;

    const year: number = req.body.year;

    if (isNaN(year) && !title) {

        res.send("Insert a valid year and a valid title.");
        return false;

    };

    if (!author && !description) {

        res.send("Insert a valid author and a valid description.");
        return false;

    };

    try {

        const connectSystem = await createPool.getConnection();

        try {

        const [rowsbooks] = await connectSystem.query('SELECT 1 FROM books WHERE title = ?', [title]);
        
        if ((rowsbooks as any[]).length > 0) {

            res.send("This book already exists in the system");
            return false;

        };

        const insertDATA = `INSERT INTO books (title, author, year, description) VALUES (?, ?, ?, ?)`;

        await connectSystem.query(insertDATA, [title, author, year, description]);

        } finally {

            connectSystem.release();

        };

        res.render('receivebook', {title});
        return true;

    } catch (e) {

        console.error(`An error ocurred, ${e}`);
        throw new Error("Something went wrong!");

    };

};


export const sendUser = async (req: Request, res: Response): Promise <void | boolean> => {

    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {

        res.status(400).json({ errors: errors.array() });
        return false;

    };

    const name: string = req.body.name;

    const email: string = req.body.email;

    const favoritebook: string = req.body.favoritebook;

    const favoritegenre: string = req.body.favoritegenre;

    if (!validator.isEmail(email) && !name) {
        
        res.send("Insert a valid email and a valid username");
        return false;

    };

    if (!favoritebook && !favoritegenre) {

        res.send("Insert a valid book and a valid genre");
        return false;

    };

    try {
        
        const connectSystem = await createPool.getConnection();

        try {

            const [rowusers] = await connectSystem.query('SELECT 1 FROM users WHERE name = ?', [name]);

            const [rowemail] = await connectSystem.query('SELECT 1 FROM users WHERE email = ?', [email]);

            if ((rowusers as any []).length > 0) {

                res.send("This user already exists in the system");
                return false;

            };

            if ((rowemail as any []).length > 0) {

                res.send("This e-mail already exists in the system");
                return false;

            };

            const insertDATAUSER = 'INSERT INTO users (name, email, favoritebook, favoritegenre) VALUES (?, ?, ?, ?)';

            await connectSystem.query(insertDATAUSER, [name, email, favoritebook, favoritegenre]);

        } finally {

            connectSystem.release();

        };

        res.render('receiveuser', {name});
        return true;

    } catch (e) {

        console.error("An error ocurred: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};
