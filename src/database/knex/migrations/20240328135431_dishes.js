exports.up = (knex) =>
  knex.schema.createTable('dishes', (table) => {
    table.increments('id');
    table.text('name');
    table.text('description');
    table.text('category');
    table.integer('price');
    table.text('image').nullable();
    table.timestamp('createdAt').default(knex.fn.now());
    table.timestamp('updatedAt').default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('dishes');
