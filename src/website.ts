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

const application = express();

application.use(express.static('public'));

application.engine('handlebars', engine({

    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '../views/partials'),

}));

application.set('view engine', 'handlebars');
application.set('views', path.join(__dirname, '../views'));

const port = process.env.PORT || 8444;

export class server {

    private protection (): void {

        const limiter = rateLimit({

            windowMs: 15 * 60 * 1000,
            max: 100,

        });

        application.use(session({

            secret: 'ILOVELINKINPARKANDTHEIRNEWSINGERHAHAHA',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true, httpOnly: true },

        }));

        application.use(limiter);

        application.use(helmet({

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

        application.use(express.json());

        application.use(express.urlencoded({ extended: true }));

    };

    private serverGETmethod (): void {

        application.get('/', homepage);

        application.get('/insertbook', publishBookValidator, addbook);

        application.get('/profile', sendUserValidator, useraccount);

        application.get('/newprofile', sendUserValidator, senduserID);

        application.get('/list', booklist);

        application.get('/edituser/:id', edituser)

        application.get('/editbook/:id', editbook);

    };

    private serverPOSTmethod (): void {

        application.post('/senduser', sendUserValidator, createprofile);

        application.post('/bookreceived', publishBookValidator, publishBook);

        application.post('/editbook/:id', editbookPOST);

        application.post('/edituser/:id', edituserPOST);

        application.post('/deletebook/:id', deletebook);

        application.post('/deleteuser/:id', deleteuser);

    };

    public listen (): void {

        this.serverGETmethod();

        this.middlewares();

        this.protection();
        
        this.serverPOSTmethod();


        application.listen (port, (): void => {

                console.log(`http://localhost:${port}`);
                
        });

    };

};


const start = new server();
start.listen();