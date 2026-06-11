import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * AuditLog Model — Tracks every security-relevant action in the system.
 * 
 * WHY: If an attacker gains DB access or a user performs suspicious actions,
 * this table provides a forensic trail. Logs are immutable (no UPDATE/DELETE API).
 */
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null for anonymous actions (failed login with unknown user)
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g. LOGIN_SUCCESS, LOGIN_FAILED, PASSWORD_CHANGED, ACCOUNT_LOCKED, ROLE_CHANGED',
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON-serialized details about the action',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['action'] },
    { fields: ['createdAt'] },
  ],
});

export default AuditLog;
