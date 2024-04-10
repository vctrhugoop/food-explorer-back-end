exports.up = (knex) =>
  knex.schema.createTable('favorite_dishes', (table) => {
    table.increments('id');
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('dish_id')
      .references('id')
      .inTable('dishes')
      .onDelete('CASCADE');

    table.timestamp('createdAt').default(knex.fn.now());
    table.timestamp('updatedAt').default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('favorite_dishes');
