import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Farm = sequelize.define('Farm', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Farm;
