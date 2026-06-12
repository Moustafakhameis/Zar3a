import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Sector = sequelize.define('Sector', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  farmId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sensorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  crop: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isAuto: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  moisture: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
}, {
  timestamps: true,
});

export default Sector;
