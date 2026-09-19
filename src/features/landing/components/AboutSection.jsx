import React from 'react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-slate-50/30 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Sub-Bar */}
        <div className="flex flex-wrap justify-between items-center pb-12 text-xs font-semibold text-slate-400 tracking-wider uppercase border-b border-gray-100 mb-16">
          <span>One platform for every part of your people journey</span>
          <div className="flex gap-6">
            <span className="text-slate-600">PEOPLE-FIRST</span>
            <span>SECURE</span>
            <span>CONNECTED</span>
            <span>INSIGHTFUL</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase mb-3 block">
              ABOUT SMART HR
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Built to simplify the way you <span className="text-emerald-800">manage people.</span>
            </h2>
          </div>

          <div className="space-y-8">
            <p className="text-lg text-slate-600 leading-relaxed">
              Smart HR is an all-in-one HR management platform designed to make workforce management simpler, faster, and more organized.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Centralized</h4>
                <p className="text-xs text-slate-500 mt-1">Everything in one place</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Efficient</h4>
                <p className="text-xs text-slate-500 mt-1">Less admin, more impact</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Insightful</h4>
                <p className="text-xs text-slate-500 mt-1">Decisions backed by data</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};