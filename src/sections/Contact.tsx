import { useState } from 'react';
import { Send, CheckCircle2, Loader2, Mail, MapPin } from 'lucide-react';
import { contactInfo } from '../data/content';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    social: '',
    brief: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const servicesOpts = [
    "Full Retainer System",
    "Cinematic Video Editing",
    "Reels / Shorts Editing",
    "Script Writing",
    "Long-to-Short Repurposing",
    "Thumbnail Packaging",
    "Personal Branding"
  ];

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service) 
        : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

    setIsSubmitting(true);
    // Simulate premium pipeline processing
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <section id="contact" className="py-24 bg-[#020202] relative border-b border-zinc-950 scroll-mt-20">
      {/* Drifting Neon Glows */}
      <div 
        className="absolute top-[10%] right-[5%] w-[380px] h-[380px] rounded-full pointer-events-none opacity-45 select-none animate-glow-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      ></div>
      <div 
        className="absolute bottom-[20%] left-[-5%] w-[420px] h-[420px] rounded-full pointer-events-none opacity-30 select-none animate-glow-drift-3"
        style={{
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(125px)'
        }}
      ></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Brief details and Quick Contacts */}
          <div className="lg:col-span-5 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF6A00] text-[10px] font-extrabold uppercase tracking-widest select-none">
                <span>GET STARTED</span>
              </div>
              <h2 className="text-[#FFF7F0] tracking-tight">
                Pitch us <br />
                <span className="font-editorial text-orange-gradient italic text-[1.15em] tracking-normal">your brief.</span>
              </h2>
              <p className="text-[#B9AAA0] text-sm md:text-base leading-relaxed">
                Ready to delegate your content strategy and post-production? Complete this brief, and we'll draft a customized content teardown and format plan for your channel.
              </p>
            </div>

            {/* Quick Contacts */}
            <div className="mt-12 lg:mt-0 space-y-6 border-t border-zinc-900 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#020202] border border-zinc-900 flex items-center justify-center text-[#FF4D00] select-none">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-550 block uppercase font-bold tracking-wider select-none">Direct Enquiries</span>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm font-semibold text-zinc-300 hover:text-[#FF4D00] transition-colors text-decoration-none">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#020202] border border-zinc-900 flex items-center justify-center text-[#FF4D00] select-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-550 block uppercase font-bold tracking-wider select-none">Agency Studio Location</span>
                  <span className="text-sm font-semibold text-zinc-300">
                    {contactInfo.address}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-zinc-600 font-mono select-none">
                Response SLA: Outlines and call invites delivered within 12 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Project Brief Form */}
          <div className="lg:col-span-7">
            <div className="panel-glass rounded-2xl p-8 shadow-2xl relative">
              
              {submitted ? (
                /* Success Message State */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/25 flex items-center justify-center text-[#FF4D00] shadow-[0_0_20px_rgba(255,77,0,0.2)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-white">Brief Successfully Uploaded</h3>
                    <p className="text-[#B9AAA0] text-sm max-w-sm">
                      Our strategy lead is revieweing your channels. We will reach out to you via email in under 12 hours with a custom roadmap proposal.
                    </p>
                  </div>
                  <div className="p-3.5 rounded bg-[#020202] border border-zinc-900 font-mono text-[9px] text-zinc-500">
                    QUEUE_STATE: BRIEF_SAVED // SLA_TIMER_STARTED
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setFormState({ name:'', email:'', social:'', brief:'' }); setSelectedServices([]); }}
                    className="btn-secondary text-xs py-2 px-4 cursor-pointer"
                  >
                    Submit Another Brief
                  </button>
                </div>
              ) : (
                /* Normal Active Form State */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider select-none">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Alex Vance"
                        className="input-premium w-full"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider select-none">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="alex@vance.io"
                        className="input-premium w-full"
                      />
                    </div>
                  </div>

                  {/* Row 2: Social Links / Channels */}
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider select-none">YouTube Channel / Social Link</label>
                    <input
                      type="text"
                      value={formState.social}
                      onChange={e => setFormState(prev => ({ ...prev, social: e.target.value }))}
                      placeholder="youtube.com/@alexvance or @alexvance"
                      className="input-premium w-full"
                    />
                  </div>

                  {/* Services Multi-Select Grid */}
                  <div className="space-y-3 text-left">
                    <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block select-none">Select Services Required</label>
                    <div className="flex flex-wrap gap-2">
                      {servicesOpts.map((service) => {
                        const isSelected = selectedServices.includes(service);
                        return (
                          <button
                            type="button"
                            key={service}
                            onClick={() => handleServiceToggle(service)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FF4D00]/10 border-[#FF4D00]/40 text-[#FF6A00] shadow-[0_0_12px_rgba(255,77,0,0.05)]'
                                : 'bg-[#020202] border-zinc-900 text-zinc-400 hover:border-zinc-800'
                            }`}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>



                  {/* Project Brief TextArea */}
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider select-none">Project Brief & Growth Obstacles</label>
                    <textarea
                      rows={4}
                      value={formState.brief}
                      onChange={e => setFormState(prev => ({ ...prev, brief: e.target.value }))}
                      placeholder="Tell us about your audience, your upload frequency, and where you need editing or scripting support..."
                      className="input-premium w-full resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading Brief to Cloud...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Project Brief</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
