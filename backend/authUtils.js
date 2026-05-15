const crypto = require('crypto');

const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = 'sha512';
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 40;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;

function normalizeCredential(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateCredentials(username, password) {
  const normalizedUsername = normalizeCredential(username);
  if (normalizedUsername.length < MIN_USERNAME_LENGTH || normalizedUsername.length > MAX_USERNAME_LENGTH) {
    return { valid: false, message: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters` };
  }
  if (!/^[A-Za-z0-9_-]+$/.test(normalizedUsername)) {
    return { valid: false, message: 'Username can only include letters, numbers, underscores, and hyphens' };
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, message: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters` };
  }
  return { valid: true, username: normalizedUsername };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString('hex');
  return {
    passwordHash: hash,
    passwordSalt: salt,
    passwordIterations: PASSWORD_ITERATIONS,
    passwordDigest: PASSWORD_DIGEST,
  };
}

function verifyPassword(password, user) {
  if (!user.passwordHash || !user.passwordSalt) {
    if (typeof user.password !== 'string' || typeof password !== 'string') return false;
    console.warn('Plaintext password format detected; record will be migrated after successful login.');
    const expected = Buffer.from(user.password);
    const actual = Buffer.from(password);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  }

  const iterations = user.passwordIterations || PASSWORD_ITERATIONS;
  const digest = user.passwordDigest || PASSWORD_DIGEST;
  const expected = Buffer.from(user.passwordHash, 'hex');
  const actual = crypto.pbkdf2Sync(password, user.passwordSalt, iterations, expected.length, digest);

  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function removePlaintextPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  hashPassword,
  removePlaintextPassword,
  validateCredentials,
  verifyPassword,
};
