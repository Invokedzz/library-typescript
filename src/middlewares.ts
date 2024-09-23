import { Request, Response } from "express";

import validator from "validator";

import { createPool } from "./database";

import { validationResult } from "express-validator";

export function homepagemiddleware (request: Request, response: Response): void {

    response.render('home');

};

export function addbookmiddleware (request: Request, response: Response): void {

    response.render('addbook');

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