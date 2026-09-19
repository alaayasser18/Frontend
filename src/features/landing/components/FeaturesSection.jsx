import React from 'react';
import { FiUsers, FiClock, FiCalendar, FiArrowRight } from 'react-icons/fi';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <FiUsers className="w-5 h-5 text-slate-700" />,
      title: "Employee Management",
      desc: "Keep employee profiles, documents, and team information organized in one secure place.",
    },
    {
      icon: <FiClock className="w-5 h-5 text-slate-700" />,
      title: "Attendance",
      desc: "Track attendance and working hours with clear, reliable visibility for every team.",
    },
    {
      icon: <FiCalendar className="w-5 h-5 text-slate-700" />,
      title: "Leave Management",
      desc: "Make requests, approvals, and leave balances simple for everyone.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase mb-3 block">
              THE SMART HR ADVANTAGE
            </span>
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              Everything your HR team <br /> needs.
            </h2>
          </div>
          <p className="text-slate-600 max-w-md">
            Powerful tools, thoughtfully connected, so your team can spend less time managing processes and more time supporting people.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{item.desc}</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};