const AppError = require('../utils/AppError');

const sqliteConnection = require('../datebase/sqlite');

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const db = await sqliteConnection();
    const checkUserExists = await db.get(
      'SELECT * FROM users WHERE email = (?)',
      [email],
    );

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.');
    }

    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      password,
    ]);

    return response.status(201).json();
  }
}

module.exports = UsersController;
