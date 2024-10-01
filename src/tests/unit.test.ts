import { Request, Response } from "express";

import { homepagemiddleware, addbookmiddleware, useraccountmiddleware, editusermiddleware, edituserPOSTmiddleware, deleteusermiddleware, senduserIDmiddleware, createprofilemiddleware } from "../middlewares";

import { createPool } from "../database";

describe ("Testing the get handlers", (): void => {

    let Request: Partial <Request>;

    let Response: Partial <Response>;

    beforeEach((): void => {

        Request = {};

        Response = {

            render: jest.fn(),

        };

    });

    afterEach((): void => {

        jest.clearAllMocks();

    });

    it ("should render the home page", (): void => {

        homepagemiddleware(Request as Request, Response as Response);

        expect(Response.render).toHaveBeenCalledWith("home");

    });

    it ("Should render the add book page", (): void => {

        addbookmiddleware(Request as Request, Response as Response);

        expect(Response.render).toHaveBeenCalledWith("addbook");

    });

    it ("Should render the user account page", (): void => {

        useraccountmiddleware(Request as Request, Response as Response);

        expect(Response.render).toHaveBeenCalledWith("useraccount");

    });

});

describe ("Creating test for edit user middleware, get method", (): void => {

    let Request: Partial <Request>;

    let Response: Partial <Response>;

    const mockQuery = jest.fn();

    beforeEach((): void => {

        Request = {

            params: {

                id: "1",

            },

        };

        Response = {

            render: jest.fn(),

        };

        (createPool.query as jest.Mock) = mockQuery;

    });

    afterEach((): void => {

        jest.clearAllMocks();

    });

    it ("Should handle the database properly", async (): Promise <void> => {

        const users = [{"name": "test", "email": "test", "favoritebook": "test", "favoritegenre": "test"}];

        mockQuery.mockResolvedValue([users]);

        await editusermiddleware(Request as Request, Response as Response);

        expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM users WHERE id = ?", ["1"]);

        expect(Response.render).toHaveBeenCalledWith("edituser", { rows: users });

    });

    it ("Should handle the errors properly", async (): Promise <void> => {

        mockQuery.mockRejectedValueOnce(new Error("Something went wrong"));

        await expect (editusermiddleware(Request as Request, Response as Response)).rejects.toThrow("Something went wrong. Try again.");

    });

});

describe ("Creating a test for the POST method in edituser middleware", (): void => {

    let Request: Partial <Request>;

    let Response: Partial <Response>;

    const mockQuery = jest.fn();

    beforeEach((): void => {

        Request = {

            params: {

                id: "1",

            },

            body: {

                name: "testing",

                email: "test@gmail.com",

                favoritebook: "Berserk",

                favoritegenre: "Fantasy",

            },

        };

        Response = {

            redirect: jest.fn(),

        };

        (createPool.query as jest.Mock) = mockQuery;

    });

    afterEach((): void => {

        jest.clearAllMocks();

    });

    it ("Should handle the database properly", async (): Promise <void> => {

        await edituserPOSTmiddleware(Request as Request, Response as Response);

        expect(mockQuery).toHaveBeenCalledWith("UPDATE users SET name = ?, email = ?, favoritebook = ?, favoritegenre = ? WHERE id = ?", ["testing", "test@gmail.com", "Berserk", "Fantasy", "1"]);

        expect(Response.redirect).toHaveBeenCalledWith("/newprofile");

    });

    it ("Should handle the errors properly", async (): Promise <void> => {

        mockQuery.mockRejectedValueOnce(new Error("Something went wrong"));

        await expect (edituserPOSTmiddleware(Request as Request, Response as Response)).rejects.toThrow("Something went wrong. Try again.");

    });

});

describe ("Test for deleting a user, middleware", (): void => {

    let Request: Partial <Request>;

    let Response: Partial <Response>;

    const mockQuery = jest.fn();

    beforeEach((): void => {

        Request = {

            params: {

                id: "1",

            },

        };

        Response = {

            render: jest.fn(),

        };

        (createPool.query as jest.Mock) = mockQuery;

    });

    afterEach((): void => {

        jest.clearAllMocks();

    });

    it ("Should handle the database properly", async (): Promise <void> => {

        await senduserIDmiddleware(Request as Request, Response as Response);

        const rowusers = [{"name": "test", "email": "test", "favoritebook": "test", "favoritegenre": "test"}];

        mockQuery.mockResolvedValue([rowusers]);

    });

    it ("Should handle an error properly", async (): Promise <void> => {

        mockQuery.mockRejectedValueOnce(new Error("Something went wrong")); 

        await expect (deleteusermiddleware(Request as Request, Response as Response)).rejects.toThrow("Something went wrong. Try again.");

    });

});