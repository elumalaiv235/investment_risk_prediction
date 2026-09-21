import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateToken, verifyToken } from '../utils/tokenUtils';
import { registerSchema, loginSchema } from '../validators/authValidator';

describe('Auth Utilities & Validation Tests', () => {
  it('should correctly hash and verify passwords', async () => {
    const raw = 'SecurePassword@123';
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(hash.startsWith('$2')).toBe(true);

    const match = await comparePassword(raw, hash);
    expect(match).toBe(true);

    const wrongMatch = await comparePassword('WrongPassword', hash);
    expect(wrongMatch).toBe(false);
  });

  it('should generate and verify valid JWT tokens', () => {
    const payload = {
      userId: 'test-user-uuid-1234',
      email: 'user@example.com',
      role: 'USER',
    };

    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe(payload.role);
  });

  it('should validate strong registration passwords correctly', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPassword1',
      confirmPassword: 'StrongPassword1',
    };

    const parsed = registerSchema.safeParse(validData);
    expect(parsed.success).toBe(true);

    const mismatchData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPassword1',
      confirmPassword: 'DifferentPassword1',
    };
    const mismatchParsed = registerSchema.safeParse(mismatchData);
    expect(mismatchParsed.success).toBe(false);

    const weakPassword = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'weak',
      confirmPassword: 'weak',
    };
    const weakParsed = registerSchema.safeParse(weakPassword);
    expect(weakParsed.success).toBe(false);
  });

  it('should validate login inputs correctly', () => {
    const validLogin = {
      email: 'user@example.com',
      password: 'Password123',
      rememberMe: true,
    };
    expect(loginSchema.safeParse(validLogin).success).toBe(true);

    const invalidEmail = {
      email: 'not-an-email',
      password: 'Password123',
    };
    expect(loginSchema.safeParse(invalidEmail).success).toBe(false);
  });
});
