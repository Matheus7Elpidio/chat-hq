'use strict';

const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Limpa os dados existentes para evitar duplicatas em re-execuções
  await knex('users').del();

  // Criptografa a senha padrão uma única vez
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Insere os usuários iniciais
  await knex('users').insert([
    {
      name: 'Administrador',
      email: 'admin@chathq.com',
      password: hashedPassword,
      role: 'admin'
    },
    {
      name: 'Cliente Teste',
      email: 'cliente@chathq.com',
      password: hashedPassword,
      role: 'client'
    }
  ]);
};
