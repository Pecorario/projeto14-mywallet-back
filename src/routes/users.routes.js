import { Router } from 'express';

import { signIn, signUp, logout } from '../controllers/users.controller.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { userSchema, loginSchema } from '../schemas/users.schema.js';

const usersRouter = Router();

usersRouter.post('/sign-up', validateSchema(userSchema), signUp);
usersRouter.post('/sign-in', validateSchema(loginSchema), signIn);
usersRouter.delete('/session', logout);

export default usersRouter;
