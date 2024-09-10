import { Request, Response } from "express";

import mysql from "mysql2/promise";

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