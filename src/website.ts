import express from "express";

import { engine } from "express-handlebars";

import { useraccount } from "./routes";

import helmet from "helmet";

import { sendUser } from "./routes";

import { publishBook } from "./routes";

import { homepage } from "./routes";

import { booklist } from "./routes";

import { deletebook } from "./routes";

import { addbook } from "./routes";

import { sendUserValidator } from "./validators";

import { publishBookValidator } from "./validators";

import path from "path";

const app = express();

app.use(express.static('public'));

app.engine('handlebars', engine({

    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '../views/partials'),

}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

const port = process.env.PORT || 8443;

export class server {

    private middlewares(): void {

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(helmet());

    };

    private serverGETmethod (): void {

        app.get('/', homepage);
        app.get('/insertbook', publishBookValidator, addbook);
        app.get('/profile', sendUserValidator, useraccount);
        app.get('/list', booklist);

    };

    private serverPOSTmethod (): void {

        this.middlewares();

        app.post("/receiveaccount/:id", sendUser, sendUserValidator);
        app.post('/bookreceived', publishBookValidator, publishBook);
        app.post('/deletebook/:id', deletebook);

    };

    public listen (): void {

        this.serverGETmethod();
        
        this.serverPOSTmethod();

        app.listen (port, (): void => {
            console.log(`http://localhost:${port}`);
        });

    };

}

const start = new server();
start.listen();