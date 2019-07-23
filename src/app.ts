import express from "express";
import bodyParser from "body-parser";
import {database } from "./util/database";

import * as adminRoutes from "./routes/admin";
import * as userRoutes from "./routes/user";

import * as  notFoundController from './controllers/errors';
import * as  welcomeController from './controllers/welcome';

const app = express();

app.set('views','views');
app.set('view engine','pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
database.execute("SELECT * FROM a").then(
  (r)=>{
    console.log(r);
  }
);


app.use('/admin',adminRoutes.router);
app.use('/user',userRoutes.router);
app.get('/',welcomeController.getWelcomePage);

app.use(notFoundController.getWelcomeNotFound);

app.listen(3001, 'localhost');
