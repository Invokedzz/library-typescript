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
        
        const id = req.params.id;

        try {

            const [rowsbooks] = await connect.query("SELECT * FROM books");

            const [getid] = await connect.query("SELECT id FROM users WHERE id = ?", [id]);

            res.render('booklist', {books: rowsbooks, id: getid});

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again!");

    };

};

export const editbook = async (req: Request, res: Response): Promise <void> => {

    const id = req.params.id;
    
    try {

        const [rows] = await createPool.query("SELECT * FROM books WHERE id = ?", [id]);

        res.render('editbook', { rows, id });

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};

export const editbookPOST = async (req: Request, res: Response): Promise <void> => {

    const id = req.params.id;

    const title = req.body.title;

    const author = req.body.author;

    const description = req.body.description;

    const year = req.body.year;

    try {

        await createPool.query("UPDATE books SET title = ?, author = ?, description = ?, year = ? WHERE id = ?", [title, author, description, year, id]);
        res.redirect('/list');

    } catch (e) {

        console.error("Something went wrong with the update: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};

export const deletebook = async (req: Request, res: Response): Promise <void | boolean> => {

    const id = req.params.id;

    try {

        const connect = await createPool.getConnection();

        try {

            await connect.query("DELETE FROM books WHERE id = ?", [id]);
            res.redirect('/list');

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error(e);
        throw new Error("Something went wrong. Try again.");

    };

};

export const useraccount = async (req: Request, res: Response): Promise <void | boolean> => {

    const id = req.params.id;
    
    try {

        const connect = await createPool.getConnection();

        try {

            await connect.query("SELECT * FROM users WHERE id = ?", [id]);
            
            res.render('useraccount', {id});

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

// Tem que arrumar o debaixo
export const sendUser = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const name: string = req.body.name;
    const email: string = req.body.email;
    const favoritebook: string = req.body.favoritebook;
    const favoritegenre: string = req.body.favoritegenre;
    const id: string = req.params.id;

    if (!validator.isEmail(email) && !name) {
        res.status(400).send("Insert a valid email and a valid username.");
        return;
    }

    if (!favoritebook && !favoritegenre) {
        res.status(400).send("Insert a valid book and a valid genre.");
        return;
    }

    try {
        const connection = await createPool.getConnection();

        try {
            
            const [existingUserByName] = await connection.query('SELECT 1 FROM users WHERE name = ? AND id != ?', [name, id]);
            const [existingUserByEmail] = await connection.query('SELECT 1 FROM users WHERE email = ? AND id != ?', [email, id]);

            if ((existingUserByName as any[]).length > 0) {

                res.status(400).send("This user already exists in the system.");
                return;

            }

            if ((existingUserByEmail as any[]).length > 0) {

                res.status(400).send("This email already exists in the system.");
                return;

            }

            const updateUserQuery = `
                UPDATE users
                SET name = ?, email = ?, favoritebook = ?, favoritegenre = ?
                WHERE id = ?
            `;
            await connection.query(updateUserQuery, [name, email, favoritebook, favoritegenre, id]);

            res.render('useraccount', {
                id,
                name,
                email,
                favoritebook,
                favoritegenre
            });

        } finally {

            connection.release();

        };

    } catch (e) {

        console.error("An error occurred: ", e);
        res.status(500).send("Something went wrong. Try again.");

    };
};
