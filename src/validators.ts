import { body } from "express-validator";

export const publishBookValidator = [

    body('title').isLength({min: 6}).isString().withMessage("The title must be a string with at least 6 characters"),

    body('author').isLength({min: 4}).isString().withMessage("The author name must be a string with at least 4 characters"),

    body('description').isLength({min: 100}).isString().withMessage("The description must be a string with at least 200 characters"),

    body('year').isInt({ min: 1900, max: new Date().getFullYear()}).withMessage('Insert a valid year'),

];

export const sendUserValidator = [

    body('username').isLength({min: 3}).isString().withMessage("Username must be a string with at least 3 characters"),

    body('email').isEmail().isString().withMessage("Must be a valid E-mail."),

    body('favoritebook').isLength({min: 5}).isString().withMessage("Must be a string with at least 5 characters"),

    body('favoritegenre').isLength({min: 3}).isString().withMessage("Must be a string with at least 3 characters"),

];