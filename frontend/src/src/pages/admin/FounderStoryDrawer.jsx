import React from 'react';
import { FileText, ChevronUp, ChevronDown, Building2, Save, Trash2, ShieldCheck, Mail, Phone, Users, Plus, CheckCircle, RotateCcw, Eye, ImageIcon, Upload, X, MapPin } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const FounderStoryDrawer = (props) => {
  const { 
    showFounderDetailsDrawer, setShowFounderDetailsDrawer,
    ownerProfile, handleOwnerChange, handleBioParagraphChange
  } = props;
  
  return (
    <>
{/* SECTION 3: EXTENDED STORY & PHILOSOPHY (COLLAPSIBLE DRAWER) */}
              <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
                <button
                  type="button"
                  onClick={() => setShowFounderDetailsDrawer(prev => !prev)}
                  className="w-full p-5 flex items-center justify-between bg-brand-card/40 hover:bg-brand-card/70 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-gold" />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Detailed Founder Story & Executive Philosophy Paragraphs
                      </span>
                      <span className="text-xs text-slate-400">
                        Edit the long-form founder philosophy quote and 3-paragraph story if desired.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
                    <span>{showFounderDetailsDrawer ? 'Hide Details' : 'Edit Story'}</span>
                    {showFounderDetailsDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showFounderDetailsDrawer && (
                  <div className="p-6 sm:p-8 space-y-6 border-t border-brand-border/80 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Lead Quote / Management Headline
                      </label>
                      <input
                        type="text"
                        value={ownerProfile.quoteHeadline || ''}
                        onChange={(e) => handleOwnerChange('quoteHeadline', e.target.value)}
                        placeholder="e.g. We Don't Just Supply Shoes. We Protect the Commercial Viability of Footwear Retailers."
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-medium focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-semibold text-slate-300">
                        Detailed Message & Story (3 Paragraphs)
                      </label>
                      
                      <div>
                        <span className="text-[11px] text-brand-gold font-medium block mb-1">Paragraph 1 (The Genesis & Vision):</span>
                        <textarea
                          rows={3}
                          value={ownerProfile.bioParagraphs?.[0] || ''}
                          onChange={(e) => handleBioParagraphChange(0, e.target.value)}
                          className="w-full p-3 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-brand-gold font-medium block mb-1">Paragraph 2 (Commitment to Supply & Logistics):</span>
                        <textarea
                          rows={3}
                          value={ownerProfile.bioParagraphs?.[1] || ''}
                          onChange={(e) => handleBioParagraphChange(1, e.target.value)}
                          className="w-full p-3 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-brand-gold font-medium block mb-1">Paragraph 3 (Retailer Partnership Guarantee):</span>
                        <textarea
                          rows={3}
                          value={ownerProfile.bioParagraphs?.[2] || ''}
                          onChange={(e) => handleBioParagraphChange(2, e.target.value)}
                          className="w-full p-3 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
      </>
  );
};

export default FounderStoryDrawer;
