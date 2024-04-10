const { Router } = require('express');

const usersRouter = require('./users.routes');
const sessionsRoutes = require('./sessions.routes');
const dishesRouter = require('./dishes.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRoutes);
routes.use('/dishes', dishesRouter);

module.exports = routes;
