import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING(255),
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'FARMER', 'BUYER', 'SUPPLIER', 'AGRO_EXPERT'),
    allowNull: true,
  },
  pendingRole: {
    type: DataTypes.ENUM('FARMER', 'SUPPLIER', 'AGRO_EXPERT'),
    allowNull: true,
  },
  authProvider: {
    type: DataTypes.ENUM('EMAIL', 'GOOGLE'),
    defaultValue: 'EMAIL',
  },
  googleId: {
    type: DataTypes.STRING(255),
    unique: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'pending_sensor', 'pending_second_approval', 'approved'),
    defaultValue: 'pending',
    allowNull: false,
  },
  subscriptionTier: {
    type: DataTypes.ENUM('FREE', 'STARTER', 'GROWTH', 'PRO'),
    defaultValue: 'FREE',
    allowNull: false,
  },
  subscriptionExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cv: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  failedLoginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: 'Counter for consecutive failed login attempts',
  },
  lockedUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    comment: 'Account is locked until this timestamp (null = not locked)',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export default User;