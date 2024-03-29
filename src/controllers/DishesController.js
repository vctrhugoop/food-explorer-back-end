const knex = require('../database/knex');
const DiskStorage = require('../providers/DisckStorage');

class DishesController {
  async create(request, response) {
    const { name, description, category, price, ingredients } = request.body;

    const [dishe_id] = await knex('dishes').insert({
      name,
      description,
      price,
      category,
    });

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        dishe_id,
        name: ingredient,
      };
    });

    await knex('ingredients').insert(ingredientsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const dishe = await knex('dishes').where({ id }).first();

    const ingredients = await knex('ingredients')
      .where({ dishe_id: id })
      .orderBy('name');

    return response.json({ ...dishe, ingredients });
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
      .innerJoin('ingredients', 'dishes.id', '=', 'ingredients.dishe_id')
      .whereLike('dishes.name', `%${search}%`)
      .orWhereLike('ingredients.name', `%${search}%`)
      .groupBy('dishes.name');

    return response.json(dishes);
  }

  async update(request, response) {
    const { name, description, category, price, image, ingredients } =
      request.body;
    const { id } = request.params;

    const dishe = await knex('dishes').where({ id }).first();

    let filename = '';

    if (request.file && request.file.filename) {
      const imageFilename = request.file.filename;
      const diskStorage = new DiskStorage();

      if (dishe && dishe.image) {
        await diskStorage.deleteFile(dishe.image);
      }

      filename = await diskStorage.saveFile(imageFilename);
    }

    dishe.name = name ?? dishe.name;
    dishe.description = description ?? dishe.description;
    dishe.category = category ?? dishe.category;
    dishe.price = price ?? dishe.price;
    dishe.image = image ?? dishe.image;

    await knex('dishes').where({ id }).update(dishe);
    await knex('dishes').where({ id }).update('updatedAt', knex.fn.now());

    const hasOnlyOneIngredient = typeof ingredients === 'string';

    let ingredientsUpdated;

    if (hasOnlyOneIngredient) {
      ingredientsUpdated = {
        dishe_id: dishe.id,
        name: ingredients,
      };
    } else if (ingredients.length >= 1) {
      ingredientsUpdated = ingredients.map((ingredient) => {
        return {
          dishe_id: dishe.id,
          name: ingredient,
        };
      });

      await knex('ingredients').where({ dishe_id: id }).delete();
      await knex('ingredients')
        .where({ dishe_id: id })
        .insert(ingredientsUpdated);
    }

    return response.json();
  }
}

module.exports = DishesController;
