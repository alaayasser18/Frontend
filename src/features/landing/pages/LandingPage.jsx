import React from 'react';

import { 
  FiArrowRight, 
  FiUsers, 
  FiClock, 
  FiCalendar,
  FiStar,
  FiMail,
  FiCheckCircle,
  FiCheck
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

/* =========================================================
   Navbar (الهيدر المضبوط بالظبط مع السهم والـ 6 لينكات)
   ========================================================= */
const Navbar = () => (
  <nav className="w-full bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-50 text-left">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      
      {/* 1. اللوجو */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex flex-col items-center justify-center p-2 shadow-sm">
          <div className="w-full h-1.5 bg-amber-400 rounded-full mb-1"></div>
          <div className="w-full h-1.5 bg-emerald-500 rounded-full"></div>
        </div>
        <span className="font-bold text-slate-800 text-xl tracking-tight">Smart HR</span>
      </div>
      
      {/* 2. اللينكات السائبة بنفس الصورة */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
        <a href="#home" className="text-slate-800 font-semibold border-b-2 border-emerald-600 pb-1 hover:text-slate-900 transition-colors">Home</a>
        <a href="#about" className="hover:text-slate-800 transition-colors">About</a>
        <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
        <a href="#roles" className="hover:text-slate-800 transition-colors">Roles</a>
        <a href="#plans" className="hover:text-slate-800 transition-colors">Plans</a>
        <a href="#contact" className="hover:text-slate-800 transition-colors">Contact</a>
      </div>

      {/* 3. الأزرار (Sign In + Get Started بالسهم) */}
      <div className="flex items-center gap-5">
        <button className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
          Sign In
        </button>
        <button className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
          <span>Get Started</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  </nav>
);

/* =========================================================
   Hero Section
   ========================================================= */
const HeroSection = () => (
  <section id="home" className="py-20 lg:py-28 bg-white border-b border-gray-100 text-left">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
          <HiSparkles className="w-4 h-4" />
          <span>Next-Gen Workforce Platform</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight m-0">
          Simplify HR management for <span className="text-emerald-800">growing teams.</span>
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-xl m-0">
          Streamline attendance tracking, leave requests, employee records, and team insights all from a single intuitive dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm">
            <span>Start Free Trial</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
          <button className="border border-gray-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm">
            Book a Demo
          </button>
        </div>
      </div>
      <div className="relative">
        <div className="w-full h-80 lg:h-[420px] bg-slate-100 rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex items-center justify-center text-slate-400">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">Dashboard Preview Card</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* =========================================================
   Features Section
   ========================================================= */
const FeaturesSection = () => (
  <section id="features" className="py-24 bg-slate-50/50 border-b border-gray-100 text-left">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase mb-3 block">
          POWERFUL FEATURES
        </span>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight m-0">
          Everything you need to manage your workforce.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <FiUsers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 m-0">Employee Directory</h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Centralize all employee profiles, personal details, roles, and documents in one secure repository.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <FiClock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 m-0">Attendance & Shifts</h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Automate time tracking, shift scheduling, and overtime calculations seamlessly.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <FiCalendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 m-0">Leave Approvals</h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Simplify vacation requests and balance calculations with multi-level approval flows.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* =========================================================
   Landing Page Component Utama
   ========================================================= */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default LandingPage;