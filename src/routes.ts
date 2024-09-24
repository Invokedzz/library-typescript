import { Request, Response } from "express";

import { homepagemiddleware, addbookmiddleware, booklistmiddleware, editbookmiddleware, editbookPOSTmiddleware, deletebookmiddleware, publishbookmiddleware, useraccountmiddleware, createprofilemiddleware, senduserIDmiddleware, deleteusermiddleware, editusermiddleware, edituserPOSTmiddleware } from "./middlewares";

export const homepage = (request: Request, response: Response): void => {

    homepagemiddleware(request, response);

};

export const addbook = (request: Request, response: Response): void => {

    addbookmiddleware(request, response);

};


export const booklist = async (request: Request, response: Response): Promise <void | boolean> => {

    await booklistmiddleware(request, response);

};

export const editbook = async (request: Request, response: Response): Promise <void> => {

    await editbookmiddleware(request, response);

};

export const editbookPOST = async (request: Request, response: Response): Promise <void> => {

    await editbookPOSTmiddleware(request, response);

};

export const deletebook = async (request: Request, response: Response): Promise <void> => {

    await deletebookmiddleware(request, response);

};

// As function for POST requests

export const publishBook = async (request: Request, response: Response): Promise <void | boolean> => {

    await publishbookmiddleware(request, response);

};

export const useraccount = (request: Request, response: Response): void => {

    useraccountmiddleware(request, response);

};

export const createprofile = async (request: Request, response: Response): Promise <void> => {

    await createprofilemiddleware(request, response);

};

export const senduserID = async (request: Request, response: Response): Promise <void> => {

    await senduserIDmiddleware(request, response);

};

export const deleteuser = async (request: Request, response: Response): Promise <void> => {

    await deleteusermiddleware(request, response);

};

export const edituser = async (request: Request, response: Response): Promise <void> => {

    await editusermiddleware(request, response);

};

export const edituserPOST = async (request: Request, response: Response): Promise <void> => {

    await edituserPOSTmiddleware(request, response);

};