import { Request, Response } from "express";

import validator from "validator";

import { body, validationResult } from "express-validator";

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

// As function for POST requests

export const publishBook = (req: Request, res: Response): void | boolean => {



    const title: string = req.body.title;

    const author: string = req.body.author;

    const description: string = req.body.description;

    const year: number = req.body.year;


    console.log(`We received: ${title}, ${author}, ${year}, ${description}`);

};

export const sendUser = (req: Request, res: Response): void | boolean => {

    const username: string = req.body.username;

    const email: string = req.body.email;

    const favoritebook: string = req.body.favoritebook;

    const favoritegenre: string = req.body.favoritegenre;


    console.log(`We received: ${username}, ${email}, ${favoritebook}, ${favoritegenre}`);

};