// src/utils/auth.js
import crypto   from "crypto";
import jwt      from "jsonwebtoken";
import bcrypt   from "bcryptjs";

// ── Password ──────────────────────────────────────────────────────────────────

/**
 * Hash a password with an email-specific pepper.
 * All NEW hashes use this format: bcrypt(password:email)
 */
export const hashPassword = (plain, email) => {
  const pepper = email ? `:${email.toLowerCase().trim()}` : '';
  const input = `${plain}${pepper}`;
  return bcrypt.hash(input, 12);
};

/**
 * Verify a password against a stored hash.
 * 
 * Backward-compatible: tries the peppered format first (password:email),
 * then falls back to legacy format (plain password only) for users
 * whose hashes were created before the pepper was added.
 * 
 * Returns { valid: boolean, needsRehash: boolean }
 */
export const verifyPassword = async (plain, hashed, email) => {
  if (!hashed) return { valid: false, needsRehash: false };

  // 1) Try new peppered format first
  if (email) {
    const pepperedInput = `${plain}:${email.toLowerCase().trim()}`;
    const pepperedMatch = await bcrypt.compare(pepperedInput, hashed);
    if (pepperedMatch) return { valid: true, needsRehash: false };
  }

  // 2) Fallback: try legacy format (plain password, no pepper)
  const legacyMatch = await bcrypt.compare(plain, hashed);
  if (legacyMatch) return { valid: true, needsRehash: true };

  return { valid: false, needsRehash: false };
};

export const generateToken = () => crypto.randomBytes(32).toString("hex");

// ── JWT ───────────────────────────────────────────────────────────────────────
const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "zar3a-access-secret-fallback";
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "zar3a-refresh-secret-fallback";

export const createAccessToken = (userId, role, rememberMe = false) =>
  jwt.sign(
    { sub: String(userId), role, type: "access" },
    accessSecret,
    { expiresIn: rememberMe ? "30d" : (process.env.JWT_ACCESS_EXPIRES_IN || "1d") }
  );

export const createRefreshToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? "30d" : (process.env.JWT_REFRESH_EXPIRES_IN || "1d");

  const token = jwt.sign(
    { sub: String(userId), type: "refresh" },
    refreshSecret,
    { expiresIn }
  );

  // Parse expiry into an absolute Date for DB storage
  const days = expiresIn.endsWith("d") ? parseInt(expiresIn) : 7;
  const expiresAt = new Date(Date.now() + days * 86_400_000);

  return { token, expiresAt };
};

export const decodeAccessToken = (token) => {
  try   { return jwt.verify(token, accessSecret);  }
  catch { return null; }
};

export const decodeRefreshToken = (token) => {
  try   { return jwt.verify(token, refreshSecret); }
  catch { return null; }
};
