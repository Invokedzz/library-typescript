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

export const booklist = (req: Request, res: Response): void => {

    res.render('booklist');

};

export const useraccount = (req: Request, res: Response): void => {

    res.render('useraccount');
    
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

        const insertDATA = `INSERT INTO bookoptions (title, author, year, description) VALUES (?, ?, ?, ?)`;

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

    const username: string = req.body.username;

    const email: string = req.body.email;

    const favoritebook: string = req.body.favoritebook;

    const favoritegenre: string = req.body.favoritegenre;

    if (!validator.isEmail(email) && !username) {
        
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

            const insertDATAUSER = 'INSERT INTO useroptions (username, email, favoritebook, favoritegenre) VALUES (?, ?, ?, ?)';

            await connectSystem.query(insertDATAUSER, [username, email, favoritebook, favoritegenre]);

        } finally {

            connectSystem.release();

        };

    } catch (e) {

        console.error("An error ocurred: ", e);
        throw new Error("Something went wrong. Try again.");

    };

    console.log(`We received: ${username}, ${email}, ${favoritebook}, ${favoritegenre}`);

};
