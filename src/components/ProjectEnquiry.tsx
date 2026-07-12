import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const budgetOptions = [
  { label: 'Less than $1,500 / mo', value: '<1500' },
  { label: '$1,500 - $3,000 / mo', value: '1500-3000' },
  { label: '$3,000 - $5,000 / mo', value: '3000-5000' },
  { label: 'More than $5,000 / mo', value: '>5000' },
];

const needsOptions = [
  { label: 'Content Strategy', id: 'need-strategy' },
  { label: 'Scriptwriting', id: 'need-scripts' },
  { label: 'Long-Form Editing', id: 'need-long' },
  { label: 'Shorts & Reels', id: 'need-shorts' },
  { label: 'Podcast Production', id: 'need-podcast' },
  { label: 'Visual Packaging (Thumbnails)', id: 'need-thumb' },
];

export default function ProjectEnquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    profileUrl: '',
    budget: '',
    details: '',
  });

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate safe local submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('debug')) {
        console.info('Enquiry payload', { ...formData, needs: selectedNeeds });
      }
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-[var(--ink)] scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left panel: Info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="section-eyebrow">Get Started</span>
            
            <h2 className="text-3xl md:text-5xl font-semibold text-[var(--bone)] leading-[1.05] tracking-tight">
              Have an idea <br />worth shaping?
            </h2>
            <p className="text-lg text-[var(--muted)] font-editorial max-w-sm">
              Let's turn it into something people watch.
            </p>
            
            <div className="space-y-4 pt-6 border-t border-white/5 text-sm text-[var(--muted)]">
              <div>
                <span className="text-[var(--muted-dark)] block mb-1">Email Address</span>
                <a href="mailto:hello@contentdost.agency" className="text-[var(--bone)] hover:text-[var(--lime)] transition-colors font-bold text-sm">
                  hello@contentdost.agency
                </a>
              </div>
              <div className="pt-2">
                <span className="text-[var(--muted-dark)] block mb-1">Onboarding Speed</span>
                <span>Typically scheduled within 48 hours of initial review.</span>
              </div>
            </div>
          </div>

          {/* Right panel: Dynamic Form / Success Card */}
          <div className="lg:col-span-7 bg-[var(--ink-soft)] border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            
            {!submitSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div style={{ borderBottom: '1px solid var(--border-neutral)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Tell us what you are making. We will be in touch within 48 hours.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* What do you need? (Checkboxes) */}
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-wider font-mono text-white">
                    What do you need? *
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {needsOptions.map((opt) => {
                      const isSelected = selectedNeeds.includes(opt.label);
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => toggleNeed(opt.label)}
                          className={`p-3 border rounded-lg text-left text-[11px] font-mono transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[var(--lime)]/10 border-[var(--lime)]/30 text-white' 
                              : 'bg-black/20 border-white/5 text-[var(--muted)] hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-[var(--lime)] border-[var(--lime)]' : 'border-white/20 bg-transparent'
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
                    rows={4}
                    placeholder="Tell us about your audience, current schedule, channels, and visual goals..."
                    data-lenis-prevent
                    className={`w-full px-4 py-3 bg-black/40 border rounded-lg text-xs font-mono text-white placeholder-[var(--muted-dark)] focus:outline-none focus:border-[var(--lime)] transition-colors ${
                      errors.details ? 'border-[#ff3b30]' : 'border-white/5'
                    }`}
                  />
                  {errors.details && <span className="block text-[10px] text-[#ff3b30] font-mono">{errors.details}</span>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[var(--lime)] hover:bg-[var(--lime-bright)] text-[var(--ink)] font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending inquiry…</span>
                  ) : (
                    <>
                      <span>Submit project inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

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
