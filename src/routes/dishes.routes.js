const { Router } = require('express');

const DishesController = require('../controllers/DishesController');

const {
  ensureAuthenticated,
  isAdmin,
} = require('../middlewares/ensureAuthenticated');

const dishesRouter = Router();

const dishesController = new DishesController();

dishesRouter.use(ensureAuthenticated);

dishesRouter.post('/', isAdmin, dishesController.create);

dishesRouter.get('/:id', dishesController.show);

dishesRouter.get('/', dishesController.index);

dishesRouter.delete('/:id', isAdmin, dishesController.delete);

module.exports = dishesRouter;
