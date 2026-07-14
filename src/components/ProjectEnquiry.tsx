import React, { useState } from 'react';
import { Send, CheckCircle2, Lock } from 'lucide-react';

import { BUDGET_TIERS, SERVICE_NAMES } from '../../shared/lead-constants';

const budgetOptions = BUDGET_TIERS;
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

export default function ProjectEnquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    profileUrl: '',
    budget: '',
    details: '',
    website: '', // honeypot
  });

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleNeed = (label: string) => {
    if (selectedNeeds.includes(label)) {
      setSelectedNeeds(selectedNeeds.filter(n => n !== label));
    } else {
      setSelectedNeeds([...selectedNeeds, label]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.budget) newErrors.budget = 'Please select an estimated budget';
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
          budget: formData.budget,
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
        budget: '',
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

  // High performance, direct style updates for mouse pointer tilt
  const handleDockMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, idx: number) => {
    if ('ontouchstart' in window) return; // Disable on touch devices
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxTilt = 4; // Subtle 2-4 degree tilt
    const tiltX = -((y / (rect.height / 2)) * maxTilt);
    const tiltY = (x / (rect.width / 2)) * maxTilt;
    
    e.currentTarget.style.setProperty('--tilt-x', `${tiltX}deg`);
    e.currentTarget.style.setProperty('--tilt-y', `${tiltY}deg`);
    setHoveredIdx(idx);
  };

  const handleDockMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
    setHoveredIdx(null);
  };

  return (
    <section id="contact" className="py-24 bg-[var(--ink)] scroll-mt-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto relative z-10">
          
          {/* 1. LEFT TOP COLUMN: Introduction & Availability (Order 1 on mobile) */}
          <div className="contact-intro-block">
            <div>
              <h2>
                Have an idea <br />
                worth <br />
                shaping?
              </h2>
              
              <p className="font-editorial max-w-md">
                Let's turn your vision into high-impact, cinematic content built to hold attention and move your brand forward.
              </p>
            </div>
            
            <div className="contact-meta-grid">
              <div className="contact-meta-block">
                <span className="contact-meta-label">Email Address</span>
                <a href="mailto:hello@contentdost.agency" className="contact-meta-link">
                  hello@contentdost.agency
                </a>
              </div>
              <div className="contact-meta-block contact-meta-divider">
                <span className="contact-meta-label">Onboarding Speed</span>
                <span className="contact-meta-value">Typically within 48 hrs</span>
                <span className="text-[var(--muted-dark)] text-[11px] block mt-0.5">of initial review</span>
              </div>
            </div>
          </div>

          {/* 2. RIGHT COLUMN: Form Card (Order 2 on mobile, spans 2 rows on desktop) */}
          <div className="lg:col-span-7 bg-[var(--ink-soft)] border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden contact-form-block">
            
            {!submitSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                
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
                  <div className="space-y-3">
                    <span className="block text-[10px] uppercase tracking-wider font-mono text-white">
                      Select required services *
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="Services checklist">
                      {needsOptions.map((opt) => {
                        const isSelected = selectedNeeds.includes(opt.label);
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => toggleNeed(opt.label)}
                            role="checkbox"
                            aria-checked={isSelected}
                            className={`p-3 border rounded-lg text-left text-[11px] font-mono transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[var(--lime)]/10 border-[var(--lime)]/30 text-white shadow-[0_0_10px_rgba(244,185,66,0.05)]' 
                                : 'bg-black/20 border-white/5 text-[var(--muted)] hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                                isSelected ? 'bg-[var(--lime)] border-[var(--lime)] scale-110' : 'border-white/20 bg-transparent'
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 bg-[var(--ink)] rounded-full" />}
                              </div>
                              {opt.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.needs && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.needs}</span>}
                  </div>
                </div>

                {/* GROUP 3: SCOPE */}
                <div className="form-group-section">
                  <h4 className="form-group-title">03 — Scope</h4>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Estimated Budget (Select) */}
                    <div className="space-y-2">
                      <label htmlFor="budget" className="block text-[10px] uppercase tracking-wider font-mono text-white">
                        Estimated Monthly Budget *
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[var(--ink-soft)] border rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[var(--lime)] transition-colors appearance-none cursor-pointer ${
                          errors.budget ? 'border-[#ff3b30]' : 'border-white/5'
                        }`}
                      >
                        <option value="" disabled>Select budget tier...</option>
                        {budgetOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.budget && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.budget}</span>}
                    </div>

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
                        rows={3}
                        placeholder="Tell us about your audience, current schedule, channels, and visual goals..."
                        data-lenis-prevent
                        className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-xs font-mono text-white placeholder-[var(--muted-dark)] focus:outline-none focus:border-[var(--lime)] transition-colors ${
                          errors.details ? 'border-[#ff3b30]' : 'border-white/5'
                        }`}
                      />
                      {errors.details && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.details}</span>}
                    </div>
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
                        <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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

          {/* 3. LEFT BOTTOM COLUMN: Social Presence (Order 3 on mobile) */}
          <div className="lg:col-span-5 contact-details-block pt-6 lg:pt-0">
            {/* Social Presence & 3D Clay Social Dock */}
            <div className="space-y-5">
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--bone)] leading-tight tracking-tight">
                We drive growth <br />
                <span className="font-editorial italic">across platforms.</span>
              </h3>
              
              <div className="relative inline-block w-full max-w-[420px] pt-4 social-dock-wrapper">
                {/* Crescent Moon Rim/Glow Backdrop */}
                <div className="dock-moon-backdrop" />

                <div 
                  className="social-dock-capsule relative z-10"
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {[
                    {
                      name: 'Instagram',
                      href: 'https://instagram.com/contentdost',
                      icon: <InstagramIcon />,
                      class: 'instagram',
                      glow: 'rgba(225, 48, 108, 0.4)'
                    },
                    {
                      name: 'LinkedIn',
                      href: 'https://linkedin.com/company/contentdost',
                      icon: <LinkedInIcon />,
                      class: 'linkedin',
                      glow: 'rgba(0, 119, 181, 0.4)'
                    },
                    {
                      name: 'YouTube',
                      href: 'https://youtube.com/contentdost',
                      icon: <YouTubeIcon />,
                      class: 'youtube',
                      glow: 'rgba(255, 0, 0, 0.4)'
                    },
                    {
                      name: 'Twitter X',
                      href: 'https://twitter.com/contentdost',
                      icon: <XIcon />,
                      class: 'twitter',
                      glow: 'rgba(255, 255, 255, 0.25)'
                    }
                  ].map((item, idx) => {
                    const distance = hoveredIdx !== null ? Math.abs(hoveredIdx - idx) : null;
                    let scale = 1;
                    let translateY = '0px';

                    if (distance === 0) {
                      scale = 1.35;
                      translateY = '-16px';
                    } else if (distance === 1) {
                      scale = 1.15;
                      translateY = '-6px';
                    }

                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`social-dock-item ${item.class}`}
                        style={{
                          transform: `scale(${scale}) translateY(${translateY})`,
                          filter: hoveredIdx === idx ? `drop-shadow(0 10px 25px ${item.glow})` : 'none'
                        }}
                        onMouseMove={(e) => handleDockMouseMove(e, idx)}
                        onMouseLeave={handleDockMouseLeave}
                        aria-label={item.name}
                      >
                        <div className="social-dock-icon-wrapper">
                          {item.icon}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
