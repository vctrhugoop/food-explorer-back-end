const { Router } = require('express');

const usersRouter = require('./users.routes');
const dishesRouter = require('./dishes.routes');
const favoriteDishesRouter = require('./favoriteDishes.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/dishes', dishesRouter);
routes.use('/favorite_dishes', favoriteDishesRouter);

module.exports = routes;
