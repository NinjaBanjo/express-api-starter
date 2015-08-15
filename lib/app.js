import express from 'express';
import bodyParser from 'body-parser';
import config from '../config.json';
// Controllers
import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
// Modules
import Response from './modules/Response';
import RouteHandlers from './modules/RouteHandlers';

// Bootstrap express
const app = express();

// Disable ETag (we are an api)
app.disable('etag');

app.set('config', config);

// Include middleware
app.use(bodyParser.json()); // Because we love JSON
// Catch unknown errors
app.use((err, req, res, next) => {
    new Response(res, err);
});

// Include controllers
app.use(AuthController);
app.use(UserController);

// And then we say no
app.all('/', RouteHandlers.notImplemented);

export default app;