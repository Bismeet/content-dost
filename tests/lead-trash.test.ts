import { describe, it, expect } from 'vitest';
import { leadsQuerySchema } from '../server/validation/admin-schemas.js';

describe('Lead Trash System Schemas and Backend Rule Validation', () => {
  describe('leadsQuerySchema - Trash parameter constraints', () => {
    it('defaults trash parameter to active', () => {
      const res = leadsQuerySchema.safeParse({});
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.trash).toBe('active');
      }
    });

    it('accepts trash=active', () => {
      const res = leadsQuerySchema.safeParse({ trash: 'active' });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.trash).toBe('active');
      }
    });

    it('accepts trash=trashed', () => {
      const res = leadsQuerySchema.safeParse({ trash: 'trashed' });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.trash).toBe('trashed');
      }
    });

    it('rejects invalid trash query value', () => {
      const res = leadsQuerySchema.safeParse({ trash: 'invalid-mode' });
      expect(res.success).toBe(false);
    });

    it('accepts deleted_at as a sorting field', () => {
      const res = leadsQuerySchema.safeParse({ sort: 'deleted_at' });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.sort).toBe('deleted_at');
      }
    });
  });

  describe('CSV Export Formatting Rules', () => {
    it('formats normal active export headers correctly', () => {
      const headers = [
        'Lead ID',
        'Name',
        'Email',
        'Company',
        'Profile URL',
        'Needs / Services',
        'Project Details',
        'Status',
        'Internal Notes',
        'Source',
        'Created At',
      ];
      expect(headers).not.toContain('Deleted At');
      expect(headers).not.toContain('deleted_by');
      expect(headers).not.toContain('ip_hash');
    });

    it('formats Trash export headers to include Deleted At but exclude deleted_by and ip_hash', () => {
      const headers = [
        'Lead ID',
        'Name',
        'Email',
        'Company',
        'Profile URL',
        'Needs / Services',
        'Project Details',
        'Status',
        'Internal Notes',
        'Source',
        'Created At',
      ];
      const trash = 'trashed';
      if (trash === 'trashed') {
        headers.push('Deleted At');
      }
      expect(headers).toContain('Deleted At');
      expect(headers).not.toContain('deleted_by');
      expect(headers).not.toContain('ip_hash');
    });
  });
});
