import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const User = sequelize.define('user', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false, // NOT NULL Constraint
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // UNIQUE Constraint
  },
});

export default User;
