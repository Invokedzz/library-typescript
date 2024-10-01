import { Request, Response } from "express";

import { homepagemiddleware, addbookmiddleware, useraccountmiddleware, editusermiddleware, edituserPOSTmiddleware } from "../middlewares";

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