const knex = require('../database/knex');

class FavoriteDishesController {
  async create(request, response) {
    const { user_id, dishe_id } = request.body;

    await knex('favorite_dishes').insert({
      user_id,
      dishe_id,
    });

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex('favorite_dishes').where({ id }).delete();

    response.json();
  }

  async index(request, response) {
    const { user_id } = request.query;
    const favorite_dishes = await knex('favorite_dishes').where({ user_id });

    return response.json({ favorite_dishes });
  }
}

module.exports = FavoriteDishesController;