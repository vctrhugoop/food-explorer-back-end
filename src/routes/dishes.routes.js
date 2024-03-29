const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../config/upload');

const DishesController = require('../controllers/DishesController');

const {
  ensureAuthenticated,
  isAdmin,
} = require('../middlewares/ensureAuthenticated');

const dishesRouter = Router();

const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();

dishesRouter.use(ensureAuthenticated);

dishesRouter.post(
  '/',
  isAdmin,
  upload.single('image'),
  dishesController.create,
);

dishesRouter.get('/:id', dishesController.show);

dishesRouter.get('/', dishesController.index);

dishesRouter.delete('/:id', isAdmin, dishesController.delete);

dishesRouter.put(
  '/:id',
  isAdmin,
  upload.single('image'),
  dishesController.update,
);

module.exports = dishesRouter;
