import { Request, Response } from "express";

import validator from "validator";

import { validationResult } from "express-validator";

export function homepagemiddleware (request: Request, response: Response): void {

    response.render('home');

};