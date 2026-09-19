import React from 'react';
import { 
  FiArrowRight, 
  FiChevronRight, 
  FiUsers, 
  FiClock, 
  FiTrendingUp, 
  FiShield, 
  FiZap 
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const HeroSection = () => {
  return (
    <section className="relative w-full bg-[#fcfdfd] py-16 lg:py-24 text-left overflow-hidden">
      
      {/* خطوط الخلفية العمودية (Grid Background Lines) */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-40 max-w-7xl mx-auto px-6">
        <div className="border-r border-slate-200/60 h-full"></div>
        <div className="border-r border-slate-200/60 h-full"></div>
        <div className="border-r border-slate-200/60 h-full"></div>
        <div className="h-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* الجانب الأيسر: النصوص والأزرار */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* الشارة العلوية */}
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              MODERN HR, MADE SIMPLE
            </span>
          </div>

          {/* العنوان الرئيسي */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#1a2b3c] tracking-tight leading-[1.08] m-0">
            Smarter HR.<br />
            <span className="text-[#2d6a4f]">Better people</span><br />
            management.
          </h1>

          {/* النص الوصفي */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl m-0">
            A modern HR management platform that helps organizations manage employees, attendance, leave, performance, and workforce insights — all in one place.
          </p>

          {/* الأزرار */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="bg-[#1e293b] hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm">
              <span>Get Started</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm bg-white flex items-center gap-2">
              <span>Explore Features</span>
              <FiChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* صور المستخدمين والعبارة السفلية */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700">AM</div>
              <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700">LR</div>
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700">SK</div>
              <div className="w-8 h-8 rounded-full bg-[#1e293b] border-2 border-white flex items-center justify-center text-xs font-bold text-white">+</div>
            </div>
            <p className="text-xs text-slate-500 m-0 leading-tight">
              Built for teams that put <br />
              <strong className="text-slate-900 font-bold">people first.</strong>
            </p>
          </div>

        </div>

        {/* الجانب الأيمن: كارت الـ Dashboard والبطاقات العائمة */}
        <div className="lg:col-span-6 relative flex justify-center">
          
          {/* 1. الكارت العائم العلوي الأيسر (Secure by design) */}
          <div className="absolute -top-6 -left-4 sm:left-2 z-20 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-100 shadow-xl flex items-start gap-3 max-w-[220px]">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
              <FiShield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 m-0">Secure by design</h4>
              <p className="text-[11px] text-slate-500 m-0 leading-snug">Your data stays protected</p>
            </div>
          </div>

          {/* 2. اللوحة الرئيسية (People Overview Dashboard) */}
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 relative z-10 transform rotate-1">
            
            {/* الهيدر الداخلي للوحة */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Good morning, Sarah</span>
                <h3 className="text-xl font-bold text-slate-900 m-0">People overview</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Live overview</span>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                  SC
                </div>
              </div>
            </div>

            {/* بطاقات الإحصائيات الـ 3 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <FiUsers className="w-4 h-4 text-slate-500 mb-1" />
                <div className="text-lg font-bold text-slate-900">248</div>
                <div className="text-[11px] text-slate-400">Employees</div>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <FiClock className="w-4 h-4 text-slate-500 mb-1" />
                <div className="text-lg font-bold text-slate-900">94%</div>
                <div className="text-[11px] text-slate-400">Attendance</div>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <FiTrendingUp className="w-4 h-4 text-slate-500 mb-1" />
                <div className="text-lg font-bold text-slate-900">86%</div>
                <div className="text-[11px] text-slate-400">Engagement</div>
              </div>
            </div>

            {/* الجزء السفلي: الرسم البياني + كارت الـ AI */}
            <div className="grid grid-cols-12 gap-3 items-stretch">
              
              {/* الرسم البياني (Workforce activity) */}
              <div className="col-span-7 p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] mb-4">
                  <span className="font-semibold text-slate-700">Workforce activity</span>
                  <span className="text-slate-400">This month</span>
                </div>
                
                {/* أعمدة الرسم البياني */}
                <div className="flex items-end justify-between gap-1.5 h-20 pt-2">
                  <div className="w-full bg-[#2d6a4f] rounded-t-md h-[40%]"></div>
                  <div className="w-full bg-[#1e293b] rounded-t-md h-[65%]"></div>
                  <div className="w-full bg-[#2d6a4f] rounded-t-md h-[50%]"></div>
                  <div className="w-full bg-[#1e293b] rounded-t-md h-[85%]"></div>
                  <div className="w-full bg-[#2d6a4f] rounded-t-md h-[70%]"></div>
                  <div className="w-full bg-[#1e293b] rounded-t-md h-[100%]"></div>
                  <div className="w-full bg-[#2d6a4f] rounded-t-md h-[90%]"></div>
                </div>
              </div>

              {/* كارت الـ AI Insight الجانبي */}
              <div className="col-span-5 p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-200/60 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
                  <HiSparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>AI insight</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed m-0 mt-2">
                  Team engagement is trending up this month.
                </p>
              </div>

            </div>

          </div>

          {/* 3. الكارت العائم السفلي الأيمن (Actionable insights) */}
          <div className="absolute -bottom-6 -right-2 sm:right-2 z-20 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3 max-w-[240px]">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <HiSparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 m-0">Actionable insights</h4>
              <p className="text-[11px] text-slate-500 m-0 leading-snug">Make better decisions, faster</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;