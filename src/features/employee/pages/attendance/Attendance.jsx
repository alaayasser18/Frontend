import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiMapPin, FiArrowRight, FiChevronDown } from "react-icons/fi";

const ATTENDANCE_HISTORY = [
  {
    id: 1,
    date: "Mon, Jun 08",
    shiftTime: "08:42 AM – 05:37 PM",
    duration: "8h 55m",
    status: "Present",
    statusType: "present",
  },
  {
    id: 2,
    date: "Fri, Jun 05",
    shiftTime: "08:51 AM – 05:28 PM",
    duration: "8h 37m",
    status: "Present",
    statusType: "present",
  },
  {
    id: 3,
    date: "Thu, Jun 04",
    shiftTime: "09:14 AM – 05:30 PM",
    duration: "8h 16m",
    status: "Late",
    statusType: "late",
  },
  {
    id: 4,
    date: "Wed, Jun 03",
    shiftTime: "—",
    duration: "—",
    status: "On Leave",
    statusType: "leave",
  },
];

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

export default function Attendance() {
  const { t } = useTranslation();
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  const handleToggleCheck = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* 1. Page Header */}
      <motion.div variants={itemVariants}>
        <p className="text-[11px] font-bold tracking-wider text-[#5b8c6a] uppercase mb-1">
          {t("employee.attendancePage.label", "ATTENDANCE")}
        </p>
        <h1 className="text-2xl md:text-[28px] font-bold text-[#102a43] tracking-tight">
          {t("employee.attendancePage.title", "My attendance")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "employee.attendancePage.subtitle",
            "Track your workday and attendance history."
          )}
        </p>
      </motion.div>

      {/* 2. Top Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Workday status */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#102a43]">
                  {t("employee.attendancePage.workdayStatus", "Workday status")}
                </h3>
                <p className="text-xs text-[#829ab1] mt-0.5">
                  {t(
                    "employee.attendancePage.locationValidation",
                    "Location validation keeps attendance accurate."
                  )}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[#ecfdf5] border border-[#bbf7d0] px-3 py-1 text-xs font-semibold text-[#16a34a] shrink-0">
                {t("employee.attendancePage.validGps", "Valid GPS ±8m")}
              </span>
            </div>

            {/* Radar Map Graphic with pulsing animation */}
            <div className="relative my-6 flex h-40 items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-36 w-36 rounded-full border border-[#d1fae5] bg-[#f0fdf4]/40"
              />
              <motion.div
                animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute h-28 w-28 rounded-full border border-[#a7f3d0] bg-[#ecfdf5]/60"
              />
              <div className="absolute h-20 w-20 rounded-full border border-[#6ee7b7] bg-[#d1fae5]/70" />

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border-2 border-[#10b981] text-[#059669]"
              >
                <FiMapPin className="h-5 w-5" />
              </motion.div>
            </div>

            <div className="text-center space-y-1 mb-6">
              <strong className="block text-sm font-bold text-[#102a43]">
                {t("employee.attendancePage.insideRadius", "Inside workplace radius")}
              </strong>
              <span className="text-xs text-[#829ab1]">
                {t("employee.attendancePage.location", "Downtown Campus · 42m from office")}
              </span>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleToggleCheck}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1c364f] py-3 px-4 text-xs font-semibold text-white hover:bg-[#24425f] transition shadow-sm"
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

            <button
              type="button"
              className="mt-3 block w-full text-center text-xs font-semibold text-[#16a34a] hover:underline"
            >
              {t("employee.attendancePage.simulate", "Simulate out-of-range location")}
            </button>
          </div>
        </div>

        {/* Right Card: Today's summary */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#102a43]">
                {t("employee.attendancePage.todaySummary", "Today's summary")}
              </h3>
              <p className="text-xs text-[#829ab1] mt-0.5">
                {t("employee.attendancePage.date", "Monday, June 9, 2026")}
              </p>
            </div>

            <div className="divide-y divide-[#f1f5f9]">
              <div className="flex items-center justify-between py-4">
                <span className="text-xs text-[#64748b]">{t("employee.attendancePage.shift", "Shift")}</span>
                <span className="text-xs font-bold text-[#102a43]">{t("employee.attendancePage.shiftTimeDefault", "08:45 AM – 05:30 PM")}</span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-xs text-[#64748b]">{t("employee.attendancePage.checkIn", "Check-in")}</span>
                <span className="text-xs font-bold text-[#102a43]">{t("employee.attendancePage.checkInTimeDefault", "08:45 AM")}</span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-xs text-[#64748b]">{t("employee.attendancePage.breakTime", "Break time")}</span>
                <span className="text-xs font-bold text-[#102a43]">{t("employee.attendancePage.breakTimeDefault", "01:00 hour")}</span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-xs text-[#64748b]">{t("employee.attendancePage.workedToday", "Worked today")}</span>
                <span className="text-xs font-bold text-[#16a34a] font-mono">{isCheckedIn ? "03:20:51" : "00:00:00"}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Attendance History Section */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[#102a43]">
              {t("employee.attendancePage.history", "Attendance history")}
            </h3>
            <p className="text-xs text-[#829ab1] mt-0.5">
              {t("employee.attendancePage.recentRecords", "Your recent attendance records.")}
            </p>
          </div>

          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-[#d9e2ec] bg-white px-3.5 py-2 text-xs font-semibold text-[#102a43] hover:bg-[#f8fafc] transition shadow-sm"
            >
              <span>{t("employee.attendancePage.monthYear", "June 2026")}</span>
              <FiChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-[#f1f5f9] text-[11px] font-bold tracking-wider text-[#94a3b8]">
                <th className="pb-3 px-4">{t("employee.attendancePage.dateColumn", "DATE")}</th>
                <th className="pb-3 px-4">{t("employee.attendancePage.shiftTime", "SHIFT TIME")}</th>
                <th className="pb-3 px-4">{t("employee.attendancePage.duration", "TOTAL DURATION")}</th>
                <th className="pb-3 px-4">{t("employee.attendancePage.status", "STATUS")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {ATTENDANCE_HISTORY.map((row) => (
                <tr key={row.id} className="hover:bg-[#f8fafc]/50 transition">
                  <td className="py-4 px-4 text-xs font-semibold text-[#1e293b]">{row.date}</td>
                  <td className="py-4 px-4 text-xs text-[#64748b]">{row.shiftTime}</td>
                  <td className="py-4 px-4 text-xs font-mono text-[#1e293b]">{row.duration}</td>
                  <td className="py-4 px-4">
                    {row.statusType === "present" && (
                      <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-xs font-semibold text-[#059669]">
                        {row.status}
                      </span>
                    )}
                    {row.statusType === "late" && (
                      <span className="inline-flex items-center rounded-full bg-[#fefce8] px-2.5 py-0.5 text-xs font-semibold text-[#d97706]">
                        {row.status}
                      </span>
                    )}
                    {row.statusType === "leave" && (
                      <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-xs font-semibold text-[#3b82f6]">
                        {row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}