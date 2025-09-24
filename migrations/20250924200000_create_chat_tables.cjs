'use strict';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    // Tabela de Setores
    knex.schema.createTable('sectors', function(table) {
      table.string('id').primary(); // Ex: 'ti', 'vendas'
      table.string('name').notNullable(); // Ex: 'Suporte T.I.', 'Vendas'
      table.timestamps(true, true);
    }),

    // Tabela de Conversas
    knex.schema.createTable('conversations', function(table) {
      table.increments('id').primary();
      table.integer('client_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('agent_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.string('sector_id').notNullable().references('id').inTable('sectors').onDelete('CASCADE');
      table.enum('status', ['pending', 'active', 'closed', 'rated']).notNullable().defaultTo('pending');
      table.integer('rating').nullable();
      table.timestamps(true, true);
    }),

    // Tabela de Mensagens
    knex.schema.createTable('messages', function(table) {
      table.increments('id').primary();
      table.integer('conversation_id').unsigned().notNullable().references('id').inTable('conversations').onDelete('CASCADE');
      // O sender pode ser um usuário (cliente/agente) ou o sistema
      table.integer('sender_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.enum('sender_type', ['user', 'system']).notNullable().defaultTo('user');
      table.text('content').notNullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
    })
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('messages'),
    knex.schema.dropTableIfExists('conversations'),
    knex.schema.dropTableIfExists('sectors')
  ]);
};
