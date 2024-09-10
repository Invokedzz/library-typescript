import express from "express";

import { engine } from "express-handlebars";

import { useraccount } from "./routes";

import { sendUser } from "./routes";

import { publishBook } from "./routes";

import { homepage } from "./routes";

import { booklist } from "./routes";

import { addbook } from "./routes";

import path from "path";

const app = express();

app.engine('handlebars', engine({

    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '../views/partials'),

}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static('public'));

const port = process.env.PORT || 3000;

export class server {

    private configExpress (): void {

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

    };

    private serverGETmethod (): void {

        app.get('/', homepage);
        app.get('/insertbook', addbook);
        app.get('/profile', useraccount);
        app.get('/list', booklist);

    };

    private serverPOSTmethod (): void {

        this.configExpress();

        app.post('/receiveaccount', sendUser);
        app.post('/receivebook', publishBook);

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