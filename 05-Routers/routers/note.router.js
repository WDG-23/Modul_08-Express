import { Router } from 'express';

const noteRouter = Router();

noteRouter.post('/', () => {});
noteRouter.get('/', () => {});
noteRouter.get('/:id', () => {});
noteRouter.put('/:id', () => {});
noteRouter.delete('/:id', () => {});

export default noteRouter;
