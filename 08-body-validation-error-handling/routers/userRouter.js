import { Router } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/users.js';
import validate from '../middlewares/validate.js';
import { userSchema } from '../schemas/user.schema.js';

const userRouter = Router();

userRouter.route('/').get(getUsers).post(validate(userSchema), createUser);
userRouter.route('/:id').get(getUserById).put(validate(userSchema), updateUser).delete(deleteUser);

export default userRouter;
