import { Request, Response } from "express";

export const homepage = (req: Request, res: Response): void => {
    res.render('home');
};

export const addbook = (req: Request, res: Response): void => {
    res.render('addbook');
};

export const useraccount = (req: Request, res: Response): void => {
    res.render('useraccount');
};