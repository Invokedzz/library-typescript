import { body } from "express-validator";

export const publishBookValidator = [

    body('title')
        .isString()
        .isLength({ min: 6 })
        .withMessage("The title must be a string with at least 6 characters"),

    body('author')
        .isString()
        .isLength({ min: 4 })
        .withMessage("The author name must be a string with at least 4 characters"),

    body('description')
        .isString()
        .isLength({ min: 10 ,max: 20 })
        .withMessage("The description must be a string with at least 10 characters"),

    body('year')
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('Insert a valid year'),

];

export const sendUserValidator = [

    body('username')
        .isString()
        .isLength({ min: 3 })
        .withMessage("Username must be a string with at least 3 characters"),

    body('email')
        .isEmail()
        .withMessage("Must be a valid E-mail."),

    body('favoritebook')
        .isString()
        .isLength({ min: 5 })
        .withMessage("Must be a string with at least 5 characters"),

    body('favoritegenre')
        .isString()
        .isLength({ min: 3 })
        .withMessage("Must be a string with at least 3 characters"),

];
