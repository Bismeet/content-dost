import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Lock, ChevronDown } from 'lucide-react';

import { SERVICE_NAMES } from '../../shared/lead-constants';

const needsOptions = SERVICE_NAMES;

// Custom Inline SVG Brand Icons to avoid version conflicts in lucide-react
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.54a29 29 0 0 0 .46 5.12 2.78 2.78 0 0 0 1.95 1.96C5.12 19.08 12 19.08 12 19.08s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.12 29 29 0 0 0-.46-5.12z" />
    <polygon points="9.75 15.02 15.5 11.54 9.75 8.06 9.75 15.02" fill="currentColor" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/contentdost', icon: InstagramIcon, className: 'instagram', glow: 'rgba(225, 48, 108, 0.4)' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/contentdost', icon: LinkedInIcon, className: 'linkedin', glow: 'rgba(0, 119, 181, 0.4)' },
  { name: 'YouTube', href: 'https://youtube.com/contentdost', icon: YouTubeIcon, className: 'youtube', glow: 'rgba(255, 0, 0, 0.4)' },
  { name: 'Twitter X', href: 'https://twitter.com/contentdost', icon: XIcon, className: 'twitter', glow: 'rgba(255, 255, 255, 0.25)' },
] as const;

const ContactIntro = React.memo(function ContactIntro() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleDockMouseMove = (event: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    if ('ontouchstart' in window) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const maxTilt = 4;
    event.currentTarget.style.setProperty('--tilt-x', `${-((y / (rect.height / 2)) * maxTilt)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(x / (rect.width / 2)) * maxTilt}deg`);
    setHoveredIdx(index);
  };

  const handleDockMouseLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
    setHoveredIdx(null);
  };

  return (
    <div className="lg:col-span-5 contact-intro-block">
      <div>
        <h2>
          Have an idea <br />
          worth <br />
          shaping?
        </h2>

        <div className="relative inline-block w-full max-w-[420px] pt-8 social-dock-wrapper mx-auto lg:mx-0">
          <div className="dock-moon-backdrop" />
          <div className="social-dock-capsule relative z-10" onMouseLeave={() => setHoveredIdx(null)}>
            {socialLinks.map((item, index) => {
              const distance = hoveredIdx !== null ? Math.abs(hoveredIdx - index) : null;
              const scale = distance === 0 ? 1.35 : distance === 1 ? 1.15 : 1;
              const translateY = distance === 0 ? '-16px' : distance === 1 ? '-6px' : '0px';
              const Icon = item.icon;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-dock-item ${item.className}`}
                  style={{
                    transform: `scale(${scale}) translateY(${translateY})`,
                    filter: hoveredIdx === index ? `drop-shadow(0 10px 25px ${item.glow})` : 'none',
                  }}
                  onMouseMove={(event) => handleDockMouseMove(event, index)}
                  onMouseLeave={handleDockMouseLeave}
                  aria-label={item.name}
                >
                  <div className="social-dock-icon-wrapper"><Icon /></div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default function ProjectEnquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    profileUrl: '',
    details: '',
    website: '', // honeypot
  });

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on pointer interaction outside
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleNeed = (label: string) => {
    setSelectedNeeds((current) =>
      current.includes(label)
        ? current.filter((need) => need !== label)
        : [...current, label],
    );
    if (errors.needs) {
      setErrors((current) => ({ ...current, needs: '' }));
    }
    setIsDropdownOpen(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.details.trim()) newErrors.details = 'Please tell us a bit about your project';
    if (selectedNeeds.length === 0) newErrors.needs = 'Please select at least one service';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          profileUrl: formData.profileUrl || undefined,
          details: formData.details,
          needs: selectedNeeds,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        throw new Error('Enquiry submission failed');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        profileUrl: '',
        details: '',
        website: '',
      });
      setSelectedNeeds([]);
      setErrors({});
    } catch (err) {
      console.error('[Public Lead Form Submission Error]:', err);
      setSubmitError('An error occurred while submitting your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-transparent scroll-mt-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto relative z-10">
          
          {/* 1. LEFT COLUMN: Heading & Social Presence (Order 1 on mobile, span 5 on desktop) */}
          <ContactIntro />

          {/* 2. RIGHT COLUMN: Form Card (Order 2 on mobile, spans 7 columns on desktop) */}
          <div className="lg:col-span-7 bg-[var(--ink-soft)] border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden contact-form-block">
            
            {!submitSuccess ? (
              <form onSubmit={handleSubmit} className="contact-form space-y-5">
                
                {/* GROUP 1: ABOUT YOU */}
                <div className="form-group-section">
                  <h4 className="form-group-title">01 — About You</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-[10px] uppercase tracking-wider font-mono text-white">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Alex"
                        className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-xs font-mono text-white placeholder-[var(--muted-dark)] focus:outline-none focus:border-[var(--lime)] transition-colors ${
                          errors.name ? 'border-[#ff3b30]' : 'border-white/5'
                        }`}
                      />
                      {errors.name && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.name}</span>}
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-[10px] uppercase tracking-wider font-mono text-white">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. alex@brand.com"
                        className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-xs font-mono text-white placeholder-[var(--muted-dark)] focus:outline-none focus:border-[var(--lime)] transition-colors ${
                          errors.email ? 'border-[#ff3b30]' : 'border-white/5'
                        }`}
                      />
                      {errors.email && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Brand field */}
                    <div className="space-y-2">
                      <label htmlFor="company" className="block text-[10px] uppercase tracking-wider font-mono text-white">
                        Brand / Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g. TechCorp"
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-lg text-xs font-mono text-white placeholder-[var(--muted-dark)] focus:outline-none focus:border-[var(--lime)] transition-colors"
                      />
                    </div>

                    {/* Profile field */}
                    <div className="space-y-2">
                      <label htmlFor="profileUrl" className="block text-[10px] uppercase tracking-wider font-mono text-white">
                        Website / Social Profile
                      </label>
                      <input
                        type="url"
                        id="profileUrl"
                        name="profileUrl"
                        value={formData.profileUrl}
                        onChange={handleInputChange}
                        placeholder="e.g. youtube.com/channel"
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-lg text-xs font-mono text-white placeholder-[var(--muted-dark)] focus:outline-none focus:border-[var(--lime)] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* GROUP 2: WHAT ARE WE BUILDING */}
                <div className="form-group-section">
                  <h4 className="form-group-title">02 — What Are We Building?</h4>
                  <div className="space-y-3 relative" ref={dropdownRef}>
                    <span className="block text-[10px] uppercase tracking-wider font-mono text-white">
                      Select required services *
                    </span>
                    
                    {/* Dropdown Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-xs md:text-sm font-sans text-white text-left flex items-center justify-between transition-colors ${
                        errors.needs ? 'border-[#ff3b30]' : 'border-white/5 hover:border-white/10'
                      }`}
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      aria-controls="contact-service-options"
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setIsDropdownOpen(false);
                      }}
                    >
                      <span className="truncate pr-4 text-white/70">
                        {selectedNeeds.length === 0 
                          ? 'Select services...' 
                          : selectedNeeds.join(', ')}
                      </span>
                      <ChevronDown 
                        size={14} 
                        className={`text-white/50 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    {/* Dropdown Menu Overlay */}
                    {isDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 w-full mt-1 bg-[#0b0d0a] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        <div id="contact-service-options" className="p-1.5 space-y-0.5" role="listbox" aria-label="Services list">
                          {needsOptions.map((opt) => {
                            const isSelected = selectedNeeds.includes(opt.label);
                            return (
                              <div
                                key={opt.id}
                                onClick={() => toggleNeed(opt.label)}
                                role="option"
                                aria-selected={isSelected}
                                tabIndex={0}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    toggleNeed(opt.label);
                                  } else if (event.key === 'Escape') {
                                    setIsDropdownOpen(false);
                                  }
                                }}
                                className={`w-full px-4 py-3 rounded text-left text-xs md:text-sm font-sans transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[var(--lime)]/10 text-white font-medium' 
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span>{opt.label}</span>
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-[var(--lime)] border-[var(--lime)] scale-110' : 'border-white/20 bg-transparent'
                                }`}>
                                  {isSelected && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-[var(--ink)]">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {errors.needs && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.needs}</span>}
                  </div>
                </div>

                {/* GROUP 3: SCOPE */}
                <div className="form-group-section">
                  <h4 className="form-group-title">03 — Scope</h4>
                  {/* Project Details */}
                  <div className="space-y-2">
                    <label htmlFor="details" className="block text-[10px] uppercase tracking-wider font-mono text-white">
                      Project Details *
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about your audience, current schedule, channels, and visual goals..."
                      data-lenis-prevent
                      className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-xs font-mono text-white placeholder-[var(--muted-dark)] focus:outline-none focus:border-[var(--lime)] transition-colors ${
                        errors.details ? 'border-[#ff3b30]' : 'border-white/5'
                      }`}
                    />
                    {errors.details && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.details}</span>}
                  </div>
                </div>

                {/* Honeypot field - visually hidden and untabbable */}
                <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden', opacity: 0 }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Submit button & Privacy protection banner */}
                <div className="space-y-3 pt-2">
                  {submitError && (
                    <div className="text-[10px] text-[#ff3b30] font-mono text-center pb-1">
                      {submitError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Sending inquiry…</span>
                    ) : (
                      <>
                        <span>Submit project inquiry</span>
                        <Lock className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--muted)] font-mono">
                    <Lock className="w-3 h-3 text-[var(--cine-gold)] opacity-70" />
                    <span>Your project details stay private. No mailing lists or spam.</span>
                  </div>
                </div>

              </form>
            ) : (
              // Success State Card
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                <CheckCircle2 className="w-16 h-16 text-[var(--lime)]" />
                <div className="space-y-2">
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--bone)', letterSpacing: '-0.03em' }}>
                    Inquiry Received
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', maxWidth: '24rem', margin: '0 auto', lineHeight: 1.6 }}>
                    Thank you — we'll review your project and get back to you within 48 hours.
                  </p>
                </div>

                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase rounded transition-colors cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
