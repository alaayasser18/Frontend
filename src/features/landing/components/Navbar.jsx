import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const Navbar = () => (
  <nav className="w-full bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-50 text-left">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      
      {/* 1. اللوجو (أيقونة الكروت + اسم Smart HR) */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex flex-col items-center justify-center p-2 shadow-sm">
          <div className="w-full h-1.5 bg-amber-400 rounded-full mb-1"></div>
          <div className="w-full h-1.5 bg-emerald-500 rounded-full"></div>
        </div>
        <span className="font-bold text-slate-800 text-xl tracking-tight">Smart HR</span>
      </div>
      
      {/* 2. قائمة القوائم كاملة (Home, About, Features, Roles, Plans, Contact) */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
        <a 
          href="#home" 
          className="text-slate-800 font-semibold border-b-2 border-emerald-600 pb-1 hover:text-slate-900 transition-colors"
        >
          Home
        </a>
        <a href="#about" className="hover:text-slate-800 transition-colors">About</a>
        <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
        <a href="#roles" className="hover:text-slate-800 transition-colors">Roles</a>
        <a href="#plans" className="hover:text-slate-800 transition-colors">Plans</a>
        <a href="#contact" className="hover:text-slate-800 transition-colors">Contact</a>
      </div>

      {/* 3. الأزرار (Sign In + Get Started مع السهم) */}
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

export default Navbar;