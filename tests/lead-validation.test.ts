import { describe, it, expect } from 'vitest';
import { leadSubmitSchema } from '../server/validation/lead-schema.js';

describe('Public Lead Submission Schema Validation', () => {
  const validPayload = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    company: 'Acme Corp',
    profileUrl: 'https://linkedin.com/in/janedoe',
    budget: '<1500',
    needs: ['Content Strategy', 'Scriptwriting'],
    details: 'Looking to produce 10 high-retention short videos per month.',
    website: '', // Honeypot (empty)
  };

  it('passes on a valid payload', () => {
    const res = leadSubmitSchema.safeParse(validPayload);
    expect(res.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const payload = { ...validPayload, name: '   ' };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain('required');
    }
  });

  it('rejects an oversized name', () => {
    const payload = { ...validPayload, name: 'a'.repeat(121) };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('rejects an invalid email format', () => {
    const payload = { ...validPayload, email: 'notanemail' };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('rejects an email that exceeds 254 characters', () => {
    const longDomain = 'a'.repeat(246) + '@test.com'; // length is 246 + 9 = 255
    const payload = { ...validPayload, email: longDomain };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('converts emails to lowercase', () => {
    const payload = { ...validPayload, email: 'JANE@EXAMPLE.COM' };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.email).toBe('jane@example.com');
    }
  });

  it('rejects invalid budget values', () => {
    const payload = { ...validPayload, budget: '1000000' };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('rejects empty service checklist', () => {
    const payload = { ...validPayload, needs: [] };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('rejects unknown service names', () => {
    const payload = { ...validPayload, needs: ['Cinematography'] };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('rejects a javascript: protocol in profile URL', () => {
    const payload = { ...validPayload, profileUrl: 'javascript:alert(1)' };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('rejects excessive details length (over 5000 characters)', () => {
    const payload = { ...validPayload, details: 'a'.repeat(5001) };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });

  it('rejects unknown schema properties (strict check)', () => {
    const payload = { ...validPayload, extraField: 'attacker-payload' };
    const res = leadSubmitSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });
});
