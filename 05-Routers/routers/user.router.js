import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getOneUser, updateUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/', createUser);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getOneUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
