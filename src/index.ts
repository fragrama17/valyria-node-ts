import express from 'express';
import {router as valyriaRouter} from './routes/valyria';
import bodyParser from 'body-parser';
import {connect} from 'mongoose';
import {dbUri} from "./config/dev";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/v1', valyriaRouter);

connect(dbUri)
    .then(() => app.listen(3000, () => {
        console.log('Connected to mongoDB locally')
        console.log('Listening on port 3000');
    }))
    .catch(err => console.log('error starting the server', err));
