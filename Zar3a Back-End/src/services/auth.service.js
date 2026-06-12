import bcrypt from "bcryptjs";
import { User, RefreshToken, AuditLog, PasswordHistory } from "../models/index.js";
import { createAccessToken, createRefreshToken } from "../utils/auth.js";

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_FAILED_ATTEMPTS = 5;          // Lock account after 5 consecutive failures
const LOCK_DURATION_MINUTES = 30;       // Lock for 30 minutes
const PASSWORD_HISTORY_DEPTH = 5;       // Check last 5 passwords for reuse

/**
 * AuthService — Centralized, production-ready authentication logic.
 *
 * Security features:
 *  1. Email-peppered bcrypt hashing  → same password produces different hash per user
 *  2. Account auto-locking           → blocks brute-force after N failures
 *  3. Password history               → prevents reusing the last N passwords
 *  4. Audit logging                  → forensic trail for every security event
 */
export class AuthService {

  // ═══════════════════════════════════════════════════════════════════════════
  //  HASHING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Hashes password + email pepper with bcrypt (cost 12).
   * WHY email pepper: copying a passwordHash from User A to User B won't work
   * because the hash is bound to the email address.
   */
  static async secureHash(password, email) {
    if (!email) throw new Error("Email is required for secure hashing.");
    const input = `${password}:${email.toLowerCase().trim()}`;
    return await bcrypt.hash(input, 12);
  }

  /**
   * Verifies password against stored hash.
   * Backward-compatible: tries peppered format first, then legacy (plain).
   * Returns { valid: boolean, needsRehash: boolean }
   */
  static async secureVerify(plainPassword, hashedPassword, email) {
    if (!plainPassword || !hashedPassword) return { valid: false, needsRehash: false };

    // 1) Try new peppered format: bcrypt(password:email)
    if (email) {
      const pepperedInput = `${plainPassword}:${email.toLowerCase().trim()}`;
      const pepperedMatch = await bcrypt.compare(pepperedInput, hashedPassword);
      if (pepperedMatch) return { valid: true, needsRehash: false };
    }

    // 2) Fallback: try legacy format (plain password, no pepper)
    const legacyMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (legacyMatch) return { valid: true, needsRehash: true };

    return { valid: false, needsRehash: false };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  AUDIT LOGGING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Writes an immutable audit log entry.
   * Called on every security-relevant action (login, lockout, password change, etc.).
   */
  static async logAudit({ userId = null, action, details = null, req = null }) {
    try {
      await AuditLog.create({
        userId,
        action,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || null,
        userAgent: req?.headers?.['user-agent']?.substring(0, 500) || null,
      });
    } catch (err) {
      // Audit logging must never crash the main flow
      console.error('[AuditLog] Failed to write:', err.message);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ACCOUNT LOCKING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Returns true if the account is currently locked.
   */
  static isAccountLocked(user) {
    return user.lockedUntil && new Date(user.lockedUntil) > new Date();
  }

  /**
   * Increments failed attempt counter. Locks account if threshold is reached.
   */
  static async recordFailedAttempt(user, req) {
    const attempts = (user.failedLoginAttempts || 0) + 1;
    const updateData = { failedLoginAttempts: attempts };

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
      updateData.lockedUntil = lockUntil;

      await this.logAudit({
        userId: user.id,
        action: 'ACCOUNT_LOCKED',
        details: { reason: `${MAX_FAILED_ATTEMPTS} consecutive failed login attempts`, lockedUntil: lockUntil.toISOString(), attempts },
        req,
      });

      console.warn(`[SECURITY] Account locked for user ${user.id} (${user.email}) until ${lockUntil.toISOString()}`);
    }

    await User.update(updateData, { where: { id: user.id } });
  }

  /**
   * Resets the failed attempt counter after a successful login.
   */
  static async clearFailedAttempts(user) {
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await User.update(
        { failedLoginAttempts: 0, lockedUntil: null },
        { where: { id: user.id } }
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PASSWORD HISTORY
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Saves the current passwordHash to history before a password change.
   * Keeps only the last PASSWORD_HISTORY_DEPTH entries per user.
   */
  static async savePasswordToHistory(userId, currentHash) {
    await PasswordHistory.create({ userId, passwordHash: currentHash });

    // Prune old entries beyond the depth limit
    const allHistory = await PasswordHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (allHistory.length > PASSWORD_HISTORY_DEPTH) {
      const idsToDelete = allHistory.slice(PASSWORD_HISTORY_DEPTH).map(h => h.id);
      await PasswordHistory.destroy({ where: { id: idsToDelete } });
    }
  }

  /**
   * Checks if the new password matches any of the last N passwords.
   * Returns true if the password was recently used (i.e., should be rejected).
   */
  static async isPasswordReused(userId, newPassword, email) {
    const history = await PasswordHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: PASSWORD_HISTORY_DEPTH,
    });

    for (const entry of history) {
      const matches = await this.secureVerify(newPassword, entry.passwordHash, email);
      if (matches) return true;
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  REGISTRATION
  // ═══════════════════════════════════════════════════════════════════════════

  static async registerUser({ fullName, username, email, phone, password }, req = null) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existingEmail = await User.findOne({ where: { email: normalizedEmail } });
    if (existingEmail) {
      const err = new Error("Email already registered");
      err.statusCode = 409;
      throw err;
    }

    const existingUsername = await User.findOne({ where: { username: normalizedUsername } });
    if (existingUsername) {
      const err = new Error("Username already taken");
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await this.secureHash(password, normalizedEmail);

    const user = await User.create({
      fullName: fullName.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      phone: phone.trim().replace(/^\+/, ""),
      passwordHash,
      role: null,
      isApproved: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    await this.logAudit({
      userId: user.id,
      action: 'USER_REGISTERED',
      details: { email: normalizedEmail, username: normalizedUsername },
      req,
    });

    return user;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  LOGIN
  // ═══════════════════════════════════════════════════════════════════════════

  static async loginUser(identifier, plainPassword, req = null) {
    const isEmail = identifier.includes("@");
    const normalizedIdentifier = identifier.trim().toLowerCase();

    const whereClause = isEmail
      ? { email: normalizedIdentifier }
      : { username: identifier.trim() };

    const user = await User.findOne({ where: whereClause });

    if (!user) {
      await this.logAudit({
        action: 'LOGIN_FAILED',
        details: { reason: 'User not found', identifier: normalizedIdentifier },
        req,
      });
      const err = new Error("Invalid email/username or password");
      err.statusCode = 401;
      throw err;
    }

    // ── Account lock check ──────────────────────────────────────────────────
    if (this.isAccountLocked(user)) {
      const minutesLeft = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);

      await this.logAudit({
        userId: user.id,
        action: 'LOGIN_BLOCKED_LOCKED',
        details: { lockedUntil: user.lockedUntil, minutesLeft },
        req,
      });

      const err = new Error(`Account is temporarily locked. Try again in ${minutesLeft} minute(s).`);
      err.statusCode = 423;
      throw err;
    }

    if (!user.passwordHash) {
      const err = new Error("Invalid email/username or password");
      err.statusCode = 401;
      throw err;
    }

    // ── Password verification ───────────────────────────────────────────────
    const { valid, needsRehash } = await this.secureVerify(plainPassword, user.passwordHash, user.email);

    if (!valid) {
      await this.recordFailedAttempt(user, req);

      await this.logAudit({
        userId: user.id,
        action: 'LOGIN_FAILED',
        details: { reason: 'Invalid password', attempts: (user.failedLoginAttempts || 0) + 1 },
        req,
      });

      const err = new Error("Invalid email/username or password");
      err.statusCode = 401;
      throw err;
    }

    // Auto-migrate legacy hash to peppered format on successful login
    if (needsRehash) {
      try {
        const newHash = await this.secureHash(plainPassword, user.email);
        await User.update({ passwordHash: newHash }, { where: { id: user.id } });
        console.log(`[AUTH] Auto-rehashed legacy password for user ${user.id}`);
        await this.logAudit({
          userId: user.id,
          action: 'PASSWORD_AUTO_REHASHED',
          details: { reason: 'Legacy hash migrated to peppered format' },
          req,
        });
      } catch (rehashErr) {
        console.error(`[AUTH] Failed to auto-rehash for user ${user.id}:`, rehashErr.message);
      }
    }

    // ── Post-auth checks ────────────────────────────────────────────────────
    if (!user.isActive) {
      const err = new Error("Account deactivated");
      err.statusCode = 403;
      throw err;
    }

    // ── Success — clear lockout counter ──────────────────────────────────────
    await this.clearFailedAttempts(user);

    await this.logAudit({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      details: { role: user.role },
      req,
    });

    return user;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  TOKEN ISSUANCE
  // ═══════════════════════════════════════════════════════════════════════════

  static async issueTokens(user) {
    const accessToken = createAccessToken(user.id, user.role);
    const { token: refreshToken, expiresAt } = createRefreshToken(user.id);

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}
