import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/sign-up', (req, res) => {
  res.send('hi');
});

export default usersRouter;
