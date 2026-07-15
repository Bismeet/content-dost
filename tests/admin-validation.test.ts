import { describe, it, expect, vi } from 'vitest';
import { leadUpdateSchema, leadsQuerySchema } from '../server/validation/admin-schemas.js';
import { validateOrigin } from '../server/security/origin.js';
import { escapeCsvField, escapeCsvFormula } from '../server/helpers/csv.js';
import { readAndValidateJson } from '../server/security/request-size.js';
import { Readable } from 'stream';

// Mock config variables for testing
vi.mock('../server/config.js', () => {
  return {
    getConfig: () => ({
      APP_ORIGIN: 'http://localhost:5173',
      ADDITIONAL_ALLOWED_ORIGINS: ['https://contentdost.agency'],
      NODE_ENV: 'production',
      IP_HASH_SECRET: 'test_hash_secret',
    }),
  };
});

describe('Admin Schemas and Security Helpers', () => {
  describe('Origin Validation', () => {
    it('passes for APP_ORIGIN', () => {
      expect(validateOrigin('http://localhost:5173')).toBe(true);
      expect(validateOrigin('http://localhost:5173/')).toBe(true);
    });

    it('passes for ADDITIONAL_ALLOWED_ORIGINS', () => {
      expect(validateOrigin('https://contentdost.agency')).toBe(true);
    });

    it('rejects random origins in production', () => {
      expect(validateOrigin('https://evil-domain.com')).toBe(false);
    });
  });

  describe('Lead Update PATCH schema', () => {
    it('passes on valid status update', () => {
      const res = leadUpdateSchema.safeParse({ status: 'qualified' });
      expect(res.success).toBe(true);
    });

    it('passes on valid notes update', () => {
      const res = leadUpdateSchema.safeParse({ internalNotes: 'Client was contacted' });
      expect(res.success).toBe(true);
    });

    it('rejects if both are omitted', () => {
      const res = leadUpdateSchema.safeParse({});
      expect(res.success).toBe(false);
    });

    it('rejects invalid status tier', () => {
      const res = leadUpdateSchema.safeParse({ status: 'super-qualified' });
      expect(res.success).toBe(false);
    });

    it('rejects internal notes that exceed 5000 chars', () => {
      const res = leadUpdateSchema.safeParse({ internalNotes: 'a'.repeat(5001) });
      expect(res.success).toBe(false);
    });
  });

  describe('Query Parameter Clamping', () => {
    it('clamps limit to maximum 100', () => {
      const res = leadsQuerySchema.safeParse({ limit: '150' });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.limit).toBe(100);
      }
    });

    it('defaults limit to 20 on invalid entry', () => {
      const res = leadsQuerySchema.safeParse({ limit: '-10' });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.limit).toBe(20);
      }
    });

    it('clamps page to minimum 1', () => {
      const res = leadsQuerySchema.safeParse({ page: '-5' });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.page).toBe(1);
      }
    });
  });

  describe('CSV Formula Escaping', () => {
    it('escapes formulas starting with "="', () => {
      expect(escapeCsvFormula('=SUM(A1:A5)')).toBe("'=SUM(A1:A5)");
    });

    it('escapes formulas starting with "+", "-", "@"', () => {
      expect(escapeCsvFormula('+10')).toBe("'+10");
      expect(escapeCsvFormula('-50')).toBe("'-50");
      expect(escapeCsvFormula('@value')).toBe("'@value");
    });

    it('escapes formulas with leading spaces and tabs', () => {
      expect(escapeCsvFormula('  =1+1')).toBe("'  =1+1");
      expect(escapeCsvFormula('\t=SUM()')).toBe("'\t=SUM()");
    });

    it('does not touch ordinary text values', () => {
      expect(escapeCsvFormula('anunaykumar1925@gmail.com')).toBe('anunaykumar1925@gmail.com');
      expect(escapeCsvFormula('123 Main St')).toBe('123 Main St');
    });

    it('properly quotes fields containing commas or quotes', () => {
      expect(escapeCsvField('Name, Jr.')).toBe('"Name, Jr."');
      expect(escapeCsvField('John "Jack" Doe')).toBe('"John ""Jack"" Doe"');
    });
  });

  describe('Request Size Limits and Safe Parser', () => {
    it('rejects requests that exceed the size limit', async () => {
      const mockReq = Readable.from([Buffer.from('a'.repeat(2000))]) as any;
      mockReq.headers = {
        'content-type': 'application/json',
        'content-length': '2000',
      };

      await expect(readAndValidateJson(mockReq, 1000)).rejects.toThrow('Payload Too Large');
    });

    it('rejects invalid JSON content silently without revealing internal parsers', async () => {
      const mockReq = Readable.from([Buffer.from('{invalid_json}')]) as any;
      mockReq.headers = {
        'content-type': 'application/json',
        'content-length': '14',
      };

      await expect(readAndValidateJson(mockReq, 1000)).rejects.toThrow('Invalid JSON');
    });
  });
});
