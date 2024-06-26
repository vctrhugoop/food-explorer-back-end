const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/DiskStorage');

class DishesController {
  async create(request, response) {
    const { name, description, category, price, ingredients } = request.body;

    const imageFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imageFileName);

    const [dish_id] = await knex('dishes').insert({
      name,
      description,
      price,
      category,
      image: filename,
    });

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dish_id,
        name: ingredient,
      };
    });

    await knex('ingredients').insert(ingredientsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex('dishes').where({ id }).first();

    const ingredients = await knex('ingredients')
      .where({ dish_id: id })
      .orderBy('name');

    return response.json({ ...dish, ingredients });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex('dishes').where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { search } = request.query;

    if (search === undefined) {
      search = '';
    }

    const dishes = await knex('dishes')
      .select('dishes.*')
      .from('dishes')
      .innerJoin('ingredients', 'dishes.id', '=', 'ingredients.dish_id')
      .whereLike('dishes.name', `%${search}%`)
      .orWhereLike('ingredients.name', `%${search}%`)
      .groupBy('dishes.name');

    return response.json(dishes);
  }

  async update(request, response) {
    const { name, description, category, price, image, ingredients } =
      request.body;
    const { id } = request.params;

    const imageFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex('dishes').where({ id }).first();

    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(imageFileName);

    dish.name = name ?? dish.name;
    dish.description = description ?? dish.description;
    dish.category = category ?? dish.category;
    dish.price = price ?? dish.price;
    dish.image = image ?? filename;

    await knex('dishes').where({ id }).update(dish);
    await knex('dishes').where({ id }).update('updatedAt', knex.fn.now());

    const hasOnlyOneIngredient = typeof ingredients === 'string';

    let ingredientsUpdated;

    if (hasOnlyOneIngredient) {
      ingredientsUpdated = {
        dish_id: dish.id,
        name: ingredients,
      };
    } else if (ingredients.length >= 1) {
      ingredientsUpdated = ingredients.map((ingredient) => {
        return {
          dish_id: dish.id,
          name: ingredient,
        };
      });

      await knex('ingredients').where({ dish_id: id }).delete();
      await knex('ingredients')
        .where({ dish_id: id })
        .insert(ingredientsUpdated);
    }

    return response.json();
  }
}

module.exports = DishesController;
