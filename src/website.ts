import express from "express";

import { engine } from "express-handlebars";

import { 

    useraccount,
     createprofile,
      senduserID,
       editbook,
        publishBook,
         editbookPOST,
          homepage,
           booklist,
            deletebook,
             addbook

             } from "./routes";

import helmet from "helmet";

import rateLimit from "express-rate-limit";

import { 

    sendUserValidator,
     publishBookValidator

     } from "./validators";


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

    private protection (): void {

        const limiter = rateLimit({

            windowMs: 15 * 60 * 1000,
            max: 100,

        });

        app.use(limiter);

    };

    private middlewares(): void {

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(helmet());

    };

    private serverGETmethod (): void {

        app.get('/', homepage);

        app.get('/insertbook', publishBookValidator, addbook);

        app.get('/profile', sendUserValidator, useraccount);

        app.get('/newprofile', sendUserValidator, senduserID);

        app.get('/list', booklist);

        app.get('/editbook/:id', editbook);

    };

    private serverPOSTmethod (): void {

        this.middlewares();

        app.post('/senduser', sendUserValidator, createprofile);

        app.post('/bookreceived', publishBookValidator, publishBook);

        app.post('/editbook/:id', editbookPOST);

        app.post('/deletebook/:id', deletebook);

    };

    public listen (): void {

        this.serverGETmethod();

        this.protection();
        
        this.serverPOSTmethod();

        app.listen (port, (): void => {
            console.log(`http://localhost:${port}`);
        });

    };

}

const start = new server();
start.listen();