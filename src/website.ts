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
             addbook,
             deleteuser,
             edituserPOST,
             edituser

             } from "./routes";

import helmet from "helmet";

import rateLimit from "express-rate-limit";

import session from "express-session";

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

        app.use(session({

            secret: 'ILOVELINKINPARKANDTHEIRNEWSINGERHAHAHA',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true, httpOnly: true },

        }));

        app.use(limiter);

        app.use(helmet({

            contentSecurityPolicy: false,
            dnsPrefetchControl: { allow: false },
            frameguard: { action: 'deny' },
            hidePoweredBy: true,
            referrerPolicy: { policy: 'no-referrer' },
            xssFilter: true,
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
            ieNoOpen: true,
            noSniff: true,

        }));

    };

    private middlewares(): void {

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

    };

    private serverGETmethod (): void {

        app.get('/', homepage);

        app.get('/insertbook', publishBookValidator, addbook);

        app.get('/profile', sendUserValidator, useraccount);

        app.get('/newprofile', sendUserValidator, senduserID);

        app.get('/list', booklist);

        app.get('/edituser/:id', edituser)

        app.get('/editbook/:id', editbook);

    };

    private serverPOSTmethod (): void {

        app.post('/senduser', sendUserValidator, createprofile);

        app.post('/bookreceived', publishBookValidator, publishBook);

        app.post('/editbook/:id', editbookPOST);

        app.post('/edituser/:id', edituserPOST);

        app.post('/deletebook/:id', deletebook);

        app.post('/deleteuser/:id', deleteuser);

    };

    public listen (): void {

        this.serverGETmethod();

        this.middlewares();

        this.protection();
        
        this.serverPOSTmethod();

        if (require.main === module) {

            app.listen (port, (): void => {
                console.log(`http://localhost:${port}`);
            });

        };

        module.exports = app;

    };

}

const start = new server();
start.listen();