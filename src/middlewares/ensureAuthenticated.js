const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../config/auth');
const knex = require('../database/knex');

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token não informado', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(user_id),
    };

    return next();
  } catch {
    throw new AppError('JWT Token Inválido', 401);
  }
}

async function isAdmin(request, response, next) {
  const user_id = request.user.id;

  const user = await knex('users').where({ id: user_id }).first();

  if (user.role !== 'admin') {
    throw new AppError('Usuário não é um administrator', 401);
  }
}

module.exports = { ensureAuthenticated, isAdmin };
