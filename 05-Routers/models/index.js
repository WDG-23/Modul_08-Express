import sequelize from '../db/index.js';
import Note from './Notes.js';
import User from './User.js';

const UsersNotes = sequelize.define('UsersNotes');
User.belongsToMany(Note, { through: 'UsersNotes' });
Note.belongsToMany(User, { through: 'UsersNotes' });

await sequelize.sync();

export { User, Note, UsersNotes };
