import { Router } from 'express';
import {
  addUserToNote,
  createNote,
  deleteNote,
  getAllNotes,
  getOneNote,
  updateNote,
} from '../controllers/note.controller.js';

const noteRouter = Router();

noteRouter.get('/', getAllNotes);
noteRouter.post('/', createNote);
noteRouter.get('/:id', getOneNote);
noteRouter.put('/:id', updateNote);
noteRouter.delete('/:id', deleteNote);

noteRouter.put('/:noteId/users/:userId', addUserToNote);

export default noteRouter;
