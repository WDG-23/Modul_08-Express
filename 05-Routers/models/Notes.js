import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Note = sequelize.define(
  'note',
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(234),
    },
  },
  {
    paranoid: true,
  }
);

export default Note;
