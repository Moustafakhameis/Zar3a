import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * PasswordHistory Model — Stores previous password hashes for each user.
 * 
 * WHY: Prevents password reuse. When a user changes their password,
 * we check the last N hashes to ensure they aren't recycling old passwords.
 * An attacker who steals one old hash cannot trick the user into "resetting"
 * back to a compromised password.
 */
const PasswordHistory = sequelize.define('PasswordHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'The old bcrypt hash (email-peppered) stored when the password is changed',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  indexes: [
    { fields: ['userId'] },
  ],
});

export default PasswordHistory;
