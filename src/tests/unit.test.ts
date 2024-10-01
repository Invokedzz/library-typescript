import { Request, Response } from "express";

import { homepagemiddleware, addbookmiddleware, useraccountmiddleware,  } from "../middlewares";

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