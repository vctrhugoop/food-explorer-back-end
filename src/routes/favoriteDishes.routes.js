const { Router } = require('express');

const favoriteRouter = Router();

const FavoriteDishesController = require('../controllers/favoriteDishesController');

const favoriteDishesController = new FavoriteDishesController();

favoriteRouter.post('/', favoriteDishesController.create);

favoriteRouter.get('/', favoriteDishesController.index);

favoriteRouter.delete('/:id', favoriteDishesController.delete);

module.exports = favoriteRouter;
