import { Request, RequestParamHandler, Response } from "express";

import validator from "validator";

import { createPool } from "./database";

import { validationResult } from "express-validator";

export function homepagemiddleware (request: Request, response: Response): void {

    response.render('home'); // Done

};

export function addbookmiddleware (request: Request, response: Response): void {

    response.render('addbook'); // Done

};

export async function booklistmiddleware (request: Request, response: Response): Promise <void> {

    try {

        const connect = await createPool.getConnection();

        const id = request.params.id;

        try {

            const [rowsbooks] = await connect.query("SELECT * FROM books");

            const [getid] = await connect.query("SELECT id FROM books WHERE id = ?", [id]);

            response.render('booklist', {books: rowsbooks, id: getid});

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again!");

    };

};

export async function editbookmiddleware (request: Request, response: Response): Promise <void> {

    const id = request.params.id;
    
    try {

        const [rows] = await createPool.query("SELECT * FROM books WHERE id = ?", [id]);

        response.render('editbook', { rows, id });

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};

export async function editbookPOSTmiddleware (request: Request, response: Response): Promise <void> {

    const id = request.params.id;

    const title: string = request.body.title;

    const author: string = request.body.author;

    const description: string = request.body.description;

    const year: number = request.body.year;

    if (validator.isEmpty(title) && validator.isEmpty(author)) {

        response.send("Title and author are required");
        return;
    };

    if (validator.isEmpty(description) && isNaN(year)) {

        response.send("Description and year are required");
        return;

    };

    try {

        await createPool.query("UPDATE books SET title = ?, author = ?, description = ?, year = ? WHERE id = ?", [title, author, description, year, id]);
        response.redirect('/list');

    } catch (e) {

        console.error("Something went wrong with the update: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};

export async function deletebookmiddleware (request: Request, response: Response): Promise <void> {

    const id = request.params.id;

    try {

        const connect = await createPool.getConnection();

        try {

            await connect.query("DELETE FROM books WHERE id = ?", [id]);
            response.redirect('/list');

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error(e);
        throw new Error("Something went wrong. Try again.");

    };

};

export async function publishbookmiddleware (request: Request, response: Response): Promise <void | boolean> {

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        response.status(400).json({ errors: errors.array() });
        return false;
    };

    let respon = false;

    const title: string = request.body.title;

    const author: string = request.body.author;

    const description: string = request.body.description;

    const year: number = request.body.year;

    if (isNaN(year) && !title) {

        response.send("Insert a valid year and a valid title.");
        return false;

    };

    if (!author && !description) {

        response.send("Insert a valid author and a valid description.");
        return false;

    };

    try {

        const connectSystem = await createPool.getConnection();

        try {

        const [rowsbooks] = await connectSystem.query('SELECT 1 FROM books WHERE title = ?', [title]);
        
        if ((rowsbooks as any[]).length > 0) {

            response.send("This book already exists in the system");
            return false;

        };

        const insertDATA = `INSERT INTO books (title, author, year, description) VALUES (?, ?, ?, ?)`;

        await connectSystem.query(insertDATA, [title, author, year, description]);

        } finally {

            connectSystem.release();

        };

        response.render('receivebook', {title});
        return true;

    } catch (e) {

        console.error(`An error ocurred, ${e}`);
        throw new Error("Something went wrong!");

    };

};

export function useraccountmiddleware (request: Request, response: Response): void {

    response.render('useraccount'); // Done

};

export async function createprofilemiddleware (request: Request, response: Response): Promise <void> {

    const name: string = request.body.name;

    const email: string = request.body.email;

    const favoritebook: string = request.body.favoritebook;

    const favoritegenre: string = request.body.favoritegenre;

    let respon = false;

    if (!validator.isEmail(email) && validator.isEmpty(name)) {

        response.send("Insert a valid e-mail and a valid name.");
        return;

    };

    if (validator.isEmpty(favoritebook) && validator.isEmpty(favoritegenre)) {

        response.send("Insert a valid favorite book and a valid favorite genre.");
        return;

    };

    try {

        const connect = await createPool.getConnection();

        try {

            const insertDATA = `INSERT INTO users (name, email, favoritebook, favoritegenre) VALUES (?, ?, ?, ?)`;

            await connect.query(insertDATA, [name, email, favoritebook, favoritegenre]);

            respon = true;

            response.render('receiveuser', {name, response});

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something went wrong: ", e);
        throw new Error("Something went wrong. Try again.");

    };


};

export async function senduserIDmiddleware (request: Request, response: Response): Promise <void> {

    try {

        const id = request.params.id;
        const connect = await createPool.getConnection();

        try {

            const [rowsusers] = await connect.query("SELECT * FROM users");

            const [getid] = await connect.query("SELECT id FROM users WHERE id = ?", [id]);

            response.render('profile', {user: rowsusers, id: getid});

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};

export async function deleteusermiddleware (request: Request, response: Response): Promise <void> {

    try {

        const id = request.params.id;
        const connect = await createPool.getConnection();

        try {

            await connect.query("DELETE FROM users WHERE id = ?", [id]);

            response.redirect('/');

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something went wrong: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};

export async function editusermiddleware (request: Request, response: Response): Promise <void> {

    const id = request.params.id;
    
    try {

        const [rows] = await createPool.query("SELECT * FROM users WHERE id = ?", [id]);

        response.render('edituser', { rows, id });

    } catch (e) {

        console.error("Something happened: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};

export async function edituserPOSTmiddleware (request: Request, response: Response): Promise <void> {


    const id = request.params.id;

    const name: string = request.body.name;

    const email: string = request.body.email;

    const favoritebook: string = request.body.favoritebook;

    const favoritegenre: string = request.body.favoritegenre;

    try {

        const connect = await createPool.getConnection();

        try {

            await createPool.query("UPDATE users SET name = ?, email = ?, favoritebook = ?, favoritegenre = ? WHERE id = ?", [name, email, favoritebook, favoritegenre, id]);  

            response.redirect('/newprofile');

        } finally {

            connect.release();

        };

    } catch (e) {

        console.error("Something went wrong: ", e);
        throw new Error("Something went wrong. Try again.");

    };

};