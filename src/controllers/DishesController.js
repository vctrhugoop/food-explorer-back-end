const knex = require('../database/knex');

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

    response.json();
  }
}

module.exports = DishesController;
