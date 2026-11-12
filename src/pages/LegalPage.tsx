// JEY VID VISION - Legal, Privacy, Copyright & Content Removal Center

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, FileText, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'terms';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    videoUrl: '',
    reason: 'Copyright Infringement (DMCA)',
    details: ''
  });

  const handleRemovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.videoUrl) return;
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#F00018] font-bold">Policy & Compliance</span>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1">
            Legal & Intellectual Property
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSearchParams({ tab: 'terms' })}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'terms'
                ? 'bg-[#F00018] text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Terms of Use
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'privacy' })}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'privacy'
                ? 'bg-[#F00018] text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'copyright' })}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'copyright'
                ? 'bg-[#F00018] text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Copyright Policy
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'removal' })}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'removal'
                ? 'bg-[#F00018] text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Content Removal Request
          </button>
        </div>

        {/* Tab 1: Terms of Use */}
        {currentTab === 'terms' && (
          <div className="space-y-6 text-sm text-neutral-300 leading-relaxed bg-[#111111] p-6 sm:p-8 rounded-2xl border border-neutral-900">
            <h2 className="text-xl font-bold text-white mb-4">Terms of Use</h2>
            <p>
              Welcome to <strong>JEY VID VISION</strong> ("Your Entertainment. Your Vision."). By accessing or using our website, services, or streaming content, you agree to comply with and be bound by the following terms.
            </p>
            <h3 className="text-base font-semibold text-white pt-2">1. Permitted Use</h3>
            <p>
              JEY VID VISION is an online entertainment index and streaming platform for personal, non-commercial entertainment. You may not attempt to download, rip, redistribute, or reverse-engineer streaming streams or content hosted on external providers.
            </p>
            <h3 className="text-base font-semibold text-white pt-2">2. External Video Hosting</h3>
            <p>
              JEY VID VISION utilizes authorized embeds and supported cloud previews (including YouTube, Google Drive, MEGA, and direct MP4/WebM hosting). We strictly respect access controls, terms of service, and platform policies of each respective provider.
            </p>
            <h3 className="text-base font-semibold text-white pt-2">3. User Conduct</h3>
            <p>
              Users agree not to disrupt platform operations, probe system vulnerabilities, or attempt unauthorized access to the owner administration dashboard.
            </p>
          </div>
        )}

        {/* Tab 2: Privacy Policy */}
        {currentTab === 'privacy' && (
          <div className="space-y-6 text-sm text-neutral-300 leading-relaxed bg-[#111111] p-6 sm:p-8 rounded-2xl border border-neutral-900">
            <h2 className="text-xl font-bold text-white mb-4">Privacy Policy</h2>
            <p>
              At JEY VID VISION, user privacy is paramount. This policy clarifies what information is processed when you visit our video streaming platform.
            </p>
            <h3 className="text-base font-semibold text-white pt-2">1. Data Collection</h3>
            <p>
              We do not require public visitors to register or provide personal credentials to browse or stream videos. Basic anonymous usage metrics (views count) may be collected to generate trending lists.
            </p>
            <h3 className="text-base font-semibold text-white pt-2">2. Advertising & Third-Party Cookies</h3>
            <p>
              To support free video streaming, our platform may display advertisements via authorized partners like Adsterra. These providers may use anonymous identifiers and standard cookies in accordance with international advertising standards.
            </p>
            <h3 className="text-base font-semibold text-white pt-2">3. Security</h3>
            <p>
              Administrative records, secure owner PIN hashes, and database endpoints are protected using enterprise Row Level Security (RLS) and cryptographic hashing.
            </p>
          </div>
        )}

        {/* Tab 3: Copyright Policy */}
        {currentTab === 'copyright' && (
          <div className="space-y-6 text-sm text-neutral-300 leading-relaxed bg-[#111111] p-6 sm:p-8 rounded-2xl border border-neutral-900">
            <h2 className="text-xl font-bold text-white mb-4">Copyright & DMCA Policy</h2>
            <p>
              JEY VID VISION respects the intellectual property rights of drama producers, television networks, musicians, and artists. Only content that has been produced, licensed, or embedded with permissions from legitimate public sources is displayed.
            </p>
            <h3 className="text-base font-semibold text-white pt-2">DMCA Compliance Notice</h3>
            <p>
              If you are a copyright owner or an authorized agent representing a copyright owner and believe any video index or link on this platform infringes upon your copyright, you may submit a formal Content Removal Request.
            </p>
            <p className="text-xs text-neutral-400">
              Upon receipt of a valid notice, we promptly investigate and remove the corresponding metadata entry from our database within 24 to 48 hours.
            </p>
          </div>
        )}

        {/* Tab 4: Content Removal Request Form */}
        {currentTab === 'removal' && (
          <div className="bg-[#111111] p-6 sm:p-8 rounded-2xl border border-neutral-900">
            <h2 className="text-xl font-bold text-white mb-2">Content Removal Request (DMCA)</h2>
            <p className="text-xs text-neutral-400 mb-6">
              Please submit this form if you represent a copyright holder or believe content violates intellectual property rights.
            </p>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-800 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Notice Received Successfully</h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your removal request for <em>{formData.videoUrl}</em> has been submitted to the JEY VID VISION administration team. We will review and action this within 24 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-lg bg-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white"
                >
                  Submit Another Notice
                </button>
              </div>
            ) : (
              <form onSubmit={handleRemovalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Your Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe / Studio Legal Rep"
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#F00018]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. legal@productioncompany.com"
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#F00018]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Video Page URL on JEY VID VISION *</label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://.../watch/video-slug"
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#F00018]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Reason for Removal</label>
                  <select
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#F00018]"
                  >
                    <option value="Copyright Infringement (DMCA)">Copyright Infringement (DMCA)</option>
                    <option value="Trademark Violation">Trademark Violation</option>
                    <option value="Defamation or Personal Privacy">Defamation or Personal Privacy</option>
                    <option value="Broken / Inappropriate Stream">Broken / Inappropriate Stream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Statement of Ownership & Details</label>
                  <textarea
                    rows={4}
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Provide proof of ownership, registration, or detailed description of the violation..."
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#F00018]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#F00018] text-white text-xs font-bold hover:bg-[#d00015] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit DMCA Notice</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
