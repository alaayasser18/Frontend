import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiArrowRight,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiCheckSquare,
  FiClock,
  FiUploadCloud,
  FiCpu,
  FiBell,
  FiCheck,
} from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function HomeDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [secondsWorked, setSecondsWorked] = useState(12051);
  const [checkInTimeStr] = useState("08:45 AM");

  useEffect(() => {
    let timer;
    if (isCheckedIn) {
      timer = setInterval(() => {
        setSecondsWorked((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleToggleCheck = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setSecondsWorked(0);
    } else {
      setIsCheckedIn(false);
      setSecondsWorked(0);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* 1. Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold tracking-wider text-[#5b8c6a] uppercase mb-1">
            {t("employee.home.date", "MONDAY, JUNE 9, 2026")}
          </p>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#102a43] tracking-tight">
            {t("employee.home.welcome", "Good morning, Omar")}
          </h1>
          <p className="text-sm text-[#829ab1] mt-1 font-normal">
            {t("employee.home.subtitle", "Here's your workday at a glance.")}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setShowCalendarModal(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#d9e2ec] bg-white px-4 py-2.5 text-xs font-semibold text-[#102a43] hover:bg-[#f8fafc] transition shadow-sm shrink-0 self-start sm:self-auto"
        >
          <FiCalendar className="w-4 h-4 text-[#64748b]" />
          {t("employee.home.viewCalendar", "View calendar")}
        </motion.button>
      </motion.div>

      {/* 2. Check-in / Check-out Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-[#1b344d] p-7 md:p-8 text-white shadow-sm"
      >
        <div className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full border border-white/[0.08]" />
        <div className="pointer-events-none absolute right-16 -top-16 h-[320px] w-[320px] rounded-full border border-white/[0.05]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3.5">
            {isCheckedIn ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#163f30] px-3 py-1 text-xs font-medium text-[#4ade80]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
                  </span>
                  <span>{t("employee.home.onShift", "On Shift")}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80">{t("employee.home.location", "Downtown Campus · Tower B")}</span>
                </div>

                <div>
                  <h2 className="text-2xl md:text-[26px] font-bold text-white tracking-tight">
                    {t("employee.home.checkedIn", "You're checked in")}
                  </h2>
                  <p className="text-xs text-white/70 mt-1">
                    {t("employee.home.checkedInAt", "Checked in at")} {checkInTimeStr}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs text-white/80">
                  <FiMapPin className="w-3.5 h-3.5 text-[#4ade80]" />
                  <span>{t("employee.home.insideRadius", "Inside workplace radius · 42m from office")}</span>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{t("employee.home.offShift", "Off Shift")}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80">{t("employee.home.location", "Downtown Campus · Tower B")}</span>
                </div>

                <div>
                  <h2 className="text-2xl md:text-[26px] font-bold text-white tracking-tight">
                    {t("employee.home.checkedOut", "You're checked out")}
                  </h2>
                  <p className="text-xs text-white/70 mt-1">
                    {t("employee.home.shiftEnded", "Shift has ended for today")}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs text-white/80">
                  <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t("employee.home.checkInFromWorkplace", "Check in from your designated workplace")}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <span className="text-[11px] font-bold tracking-widest text-white/50 uppercase">
              {t("employee.home.workedToday", "WORKED TODAY")}
            </span>
            <div className="font-mono text-3xl md:text-[34px] font-bold tracking-tight text-white">
              {isCheckedIn ? formatTime(secondsWorked) : "00:00:00"}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleToggleCheck}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-[#102a43] hover:bg-slate-50 transition shadow-sm"
            >
              {isCheckedIn ? (
                <>
                  {t("employee.home.checkOut", "Check out")} <FiArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  {t("employee.home.checkIn", "Check in")} <FiArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 3. Summary Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-[#3b82f6]">
              <FiCheckSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
              {t("employee.home.pendingTasks", "PENDING TASKS")}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#102a43]">{t("employee.home.tasksCount", "3 tasks")}</h3>
          <p className="text-xs text-[#64748b] mt-1">{t("employee.home.highPriority", "1 high priority")}</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fefce8] text-[#d97706]">
              <FiClock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
              {t("employee.home.nextDeadline", "NEXT DEADLINE")}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#102a43]">{t("employee.home.deadlineDate", "Jun 12")}</h3>
          <p className="text-xs text-[#64748b] mt-1">{t("employee.home.operationsReport", "Q2 Operations efficiency report")}</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#059669]">
              <FiCalendar className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
              {t("employee.home.leaveBalance", "LEAVE BALANCE")}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#102a43]">{t("employee.home.daysCount", "13 days")}</h3>
          <p className="text-xs text-[#64748b] mt-1">{t("employee.home.annualCasual", "Annual + Casual")}</p>
        </motion.div>
      </motion.div>

      {/* 4. Quick Actions */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-[#102a43]">{t("employee.home.quickActions", "Quick actions")}</h3>
          <p className="text-xs text-[#829ab1] mt-0.5">{t("employee.home.shortcuts", "Shortcuts for your most common tasks.")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] hover:shadow-sm transition cursor-pointer"
            onClick={() => navigate("/employee/leaves")}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#059669]">
                <FiCalendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#102a43]">{t("employee.home.requestLeave", "Request leave")}</span>
            </div>
            <FiArrowRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#102a43] transition-transform group-hover:translate-x-0.5" />
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] hover:shadow-sm transition cursor-pointer"
            onClick={() => navigate("/employee/tasks")}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
                <FiUploadCloud className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#102a43]">{t("employee.home.submitTask", "Submit task")}</span>
            </div>
            <FiArrowRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#102a43] transition-transform group-hover:translate-x-0.5" />
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCalendarModal(true)}
            className="group flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] hover:shadow-sm transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#059669]">
                <FiCalendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#102a43]">{t("employee.home.viewCalendar", "View calendar")}</span>
            </div>
            <FiArrowRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#102a43] transition-transform group-hover:translate-x-0.5" />
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] hover:shadow-sm transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#059669]">
                <FiCpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#102a43]">{t("employee.home.aiAssistant", "AI HR Assistant")}</span>
            </div>
            <FiArrowRight className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#102a43] transition-transform group-hover:translate-x-0.5" />
          </motion.div>
        </div>
      </motion.div>

      {/* 5. Bottom Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#102a43]">{t("employee.home.todaysSchedule", "Today's schedule")}</h3>
              <p className="text-xs text-[#829ab1] mt-0.5">{t("employee.home.upcomingEvents", "Your upcoming calendar events.")}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCalendarModal(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#64748b] hover:text-[#102a43] transition"
            >
              {t("employee.home.viewAll", "View all")} <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-medium text-[#829ab1] w-16 shrink-0">10:30 AM</span>
              <span className="h-2 w-2 rounded-full bg-[#3b82f6] shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-[#102a43]">{t("employee.home.productSync", "Product sync")}</p>
                <p className="text-[#829ab1]">{t("employee.home.meetingRoom", "Meeting room 4B · 45 min")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-medium text-[#829ab1] w-16 shrink-0">02:00 PM</span>
              <span className="h-2 w-2 rounded-full bg-[#10b981] shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-[#102a43]">{t("employee.home.focusTime", "Focus time")}</p>
                <p className="text-[#829ab1]">{t("employee.home.operationsReportShort", "Q2 Operations report")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#102a43]">{t("employee.home.recentActivity", "Recent activity")}</h3>
              <p className="text-xs text-[#829ab1] mt-0.5">{t("employee.home.latestUpdates", "Latest updates from your workspace.")}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#64748b] hover:text-[#102a43] transition"
            >
              {t("employee.home.seeAll", "See all")} <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff6ff] text-[#3b82f6] shrink-0">
                  <FiActivity className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#102a43] truncate">{t("employee.home.vendorChecklist", "Vendor checklist submitted")}</p>
                  <p className="text-[#829ab1]">{t("employee.home.yesterdayAt432", "Yesterday at 4:32 PM")}</p>
                </div>
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 text-slate-400 shrink-0">
                <FiCheck className="w-2.5 h-2.5" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff6ff] text-[#3b82f6] shrink-0">
                  <FiBell className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#102a43] truncate">{t("employee.home.leaveUpdated", "Leave balance updated")}</p>
                  <p className="text-[#829ab1]">{t("employee.home.yesterdayAt910", "Yesterday at 9:10 AM")}</p>
                </div>
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 text-slate-400 shrink-0">
                <FiCheck className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6. Calendar Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCalendarModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] transition">
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-bold text-[#102a43]">{t("employee.home.monthName", "June 2026")}</h3>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] transition">
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#94a3b8] py-2 border-b border-[#f1f5f9]">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              <div className="grid grid-cols-7 text-center gap-1 py-3 text-xs font-medium text-[#1e293b]">
                <span className="py-2 text-[#cbd5e1]">31</span>
                <span className="py-2">1</span><span className="py-2">2</span><span className="py-2">3</span><span className="py-2">4</span><span className="py-2">5</span><span className="py-2">6</span><span className="py-2">7</span><span className="py-2">8</span>
                <span className="py-2 font-bold text-[#059669] bg-[#ecfdf5] rounded-lg">9</span>
                <span className="py-2">10</span><span className="py-2">11</span><span className="py-2">12</span><span className="py-2">13</span><span className="py-2">14</span><span className="py-2">15</span><span className="py-2">16</span><span className="py-2">17</span><span className="py-2">18</span><span className="py-2">19</span><span className="py-2">20</span><span className="py-2">21</span><span className="py-2">22</span><span className="py-2">23</span><span className="py-2">24</span><span className="py-2">25</span><span className="py-2">26</span><span className="py-2">27</span><span className="py-2">28</span><span className="py-2">29</span><span className="py-2">30</span>
              </div>

              <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4 mt-2">
                <div className="flex items-center gap-3 text-xs text-[#64748b]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                    <span>{t("employee.home.today", "Today")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                    <span>{t("employee.home.event", "Events")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCalendarModal(false)}
                  className="rounded-xl bg-[#102a43] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1c364f] transition"
                >
                  {t("employee.home.close", "Close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}