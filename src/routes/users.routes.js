const { Router } = require('express');

const usersRouter = Router();

usersRouter.post('/', (resquest, responso) => {
  const { name, email, password } = resquest.body;

  responso.json({ name, email, password });
});

module.exports = usersRouter;
