'use strict';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deleta todas as entradas existentes na tabela sectors
  await knex('sectors').del();

  // Insere as novas entradas de setores
  await knex('sectors').insert([
    { id: 'ti', name: 'Suporte T.I.' },
    { id: 'vendas', name: 'Vendas' },
    { id: 'financeiro', name: 'Financeiro' }
  ]);
};
