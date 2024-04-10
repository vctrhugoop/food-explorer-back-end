const knex = require('../database/knex');

class FavoriteDishesController {
  async create(request, response) {
    const { user_id, dish_id } = request.body;

    await knex('favorite_dishes').insert({
      user_id,
      dish_id,
    });

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex('favorite_dishes').where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { user_id } = request.query;
    const favorite_dishes = await knex('favorite_dishes')
      .where({ user_id })
      .select('dishes.*')
      .innerJoin('dishes', 'favorite_dishes.dish_id', '=', 'dishes.id');

    return response.json({ favorite_dishes });
  }
}

module.exports = FavoriteDishesController;
