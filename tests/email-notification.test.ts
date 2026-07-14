import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendLeadNotificationEmail } from '../server/email/notification.js';

// We mock config
const mockConfig = {
  RESEND_API_KEY: 're_valid_api_key_for_test',
  RESEND_FROM_EMAIL: 'Content Dost <onboarding@resend.dev>',
  LEAD_NOTIFICATION_EMAIL: 'bismeetsingh711@gmail.com',
  NODE_ENV: 'development',
};

vi.mock('../server/config.js', () => {
  return {
    getConfig: () => mockConfig,
  };
});

// Use vi.hoisted to ensure mockSend is initialized before vi.mock executes
const { mockSend } = vi.hoisted(() => {
  return {
    mockSend: vi.fn(),
  };
});

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: mockSend,
      };
    },
  };
});

describe('Email Notification Service', () => {
  const mockLead = {
    id: 'lead-uuid-123',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    profileUrl: 'https://linkedin.com/in/johndoe',
    budget: '<1500',
    needs: ['Content Strategy'],
    projectDetails: 'Need short reels edited.',
    createdAt: '2026-07-14T12:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfig.RESEND_API_KEY = 're_valid_api_key_for_test';
    mockConfig.RESEND_FROM_EMAIL = 'Content Dost <onboarding@resend.dev>';
    mockConfig.LEAD_NOTIFICATION_EMAIL = 'bismeetsingh711@gmail.com';
  });

  it('sends email successfully and returns success with email ID', async () => {
    mockSend.mockResolvedValue({
      data: { id: 'msg_12345' },
      error: null,
    });

    const result = await sendLeadNotificationEmail(mockLead);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.emailId).toBe('msg_12345');
    }
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: mockConfig.RESEND_FROM_EMAIL,
        to: [mockConfig.LEAD_NOTIFICATION_EMAIL],
        subject: expect.stringContaining('John Doe'),
      })
    );
  });

  it('handles provider error response safely', async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: {
        name: 'validation_error',
        message: 'Send to unverified address is restricted',
        statusCode: 403,
      },
    });

    const result = await sendLeadNotificationEmail(mockLead);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorType).toBe('validation_error');
      expect(result.statusCode).toBe(403);
      expect(result.message).toContain('restricted');
    }
  });

  it('handles unexpected exceptions safely', async () => {
    mockSend.mockRejectedValue(new Error('Connection timeout'));

    const result = await sendLeadNotificationEmail(mockLead);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorType).toBe('Error');
      expect(result.message).toBe('Connection timeout');
    }
  });

  it('returns failure when RESEND_API_KEY is missing', async () => {
    mockConfig.RESEND_API_KEY = '';

    const result = await sendLeadNotificationEmail(mockLead);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorType).toBe('MISSING_API_KEY');
    }
  });

  it('returns failure when RESEND_API_KEY format is invalid', async () => {
    mockConfig.RESEND_API_KEY = 'invalid_key_no_prefix';

    const result = await sendLeadNotificationEmail(mockLead);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorType).toBe('INVALID_API_KEY_FORMAT');
    }
  });
});
