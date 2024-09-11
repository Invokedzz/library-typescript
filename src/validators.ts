import { body } from "express-validator";

export const publishBookValidator = [

    body('title')
        .isString()
        .isLength({ min: 4, max: 30 })  
        .withMessage("The title must be a string with at least 6 characters, and have a limit of 30 characters"),

    body('author')
        .isString()
        .isLength({ min: 4, max: 25 })
        .withMessage("The author name must be a string with at least 4 characters, with a limit of 25 characters"),

    body('description')
        .isString()
        .isLength({ min: 10, max: 100 })
        .withMessage("The description must be a string with at least 10 characters, and have a limit of 100 characters (space included)"),

    body('year')
        .isInt({ min: 500, max: new Date().getFullYear() })
        .withMessage('Insert a valid year'),

];

export const sendUserValidator = [

    body('username')
        .isString()
        .isLength({ min: 3, max: 25 })
        .withMessage("Username must be a string with at least 3 characters, and have a limit of 25 characters"),

    body('email')
        .isEmail()
        .isString()
        .withMessage("Please, insert a valid e-mail address"),

    body('favoritebook')
        .isString()
        .isLength({ min: 5, max: 30 })
        .withMessage("Must be a string with at least 5 characters, and have a limit of 30 characters"),

    body('favoritegenre')
        .isString()
        .isLength({ min: 3, max: 20 })
        .withMessage("Must be a string with at least 3 characters, and have a limit of 20 characters"),

];
