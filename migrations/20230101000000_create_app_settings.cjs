exports.up = function(knex) {
  return knex.schema.createTable('app_settings', function(table) {
    table.string('key').primary();
    table.text('value');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('app_settings');
};
