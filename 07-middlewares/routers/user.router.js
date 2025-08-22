import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import validate from '../middlewares/validate.js';
import { UserPostSchema, UserUpdateSchema } from '../schemas/user.schemas.js';

const userRouter = Router();

userRouter.post('/', validate(UserPostSchema), createUser);
userRouter.get('/', getUsers);
userRouter.get(
  '/:id',
  (req, res, next) => {
    req.myData = 42;

    next();
  },
  (req, res, next) => {
    console.log('Zweite in der Kette');
    next();
  },
  getUserById
);
userRouter.put('/:id', validate(UserUpdateSchema), updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
