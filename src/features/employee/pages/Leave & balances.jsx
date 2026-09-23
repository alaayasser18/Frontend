import { useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiPaperclip,
  FiArrowRight,
  FiArrowLeft,
  FiX,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiFileText,
} from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function LeaveBalances() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  // ==========================================
  // Leave Balances State
  // ==========================================
  const [balances, setBalances] = useState({
    annual: { remaining: 13, total: 21 },
    casual: { remaining: 4, total: 7 },
    sick: { remaining: 8, total: 10 },
  });

  // ==========================================
  // Recent Requests State
  // ==========================================
  const [recentRequests, setRecentRequests] = useState([
    {
      id: "req-1",
      type: "casual",
      typeLabelKey: "casual",
      day: 14,
      monthEn: "MAY",
      monthAr: "مايو",
      fullDateEn: "May 14 · 1 day",
      fullDateAr: "14 مايو · يوم واحد",
      status: "Approved",
    },
  ]);

  // ==========================================
  // Form State
  // ==========================================
  const [leaveType, setLeaveType] = useState("annual");
  const [duration, setDuration] = useState("fullDay");
  const [startDate, setStartDate] = useState("2026-06-22");
  const [endDate, setEndDate] = useState("2026-06-24");
  const [reason, setReason] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // ==========================================
  // Calendar Modal State
  // ==========================================
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 4, 1)); // May 2026

  // ==========================================
  // File Attachment Handlers
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // Form Submission Handler
  // ==========================================
  const handleSubmitRequest = (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason.trim()) {
      toast.error(t("leaveBalances.toastFillRequired", "Please fill in all required fields"));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toast.error(t("leaveBalances.toastInvalidDates", "End date must be after start date"));
      return;
    }

    let daysCount = 1;
    if (duration === "halfDayMorning" || duration === "halfDayEvening") {
      daysCount = 0.5;
    } else {
      const diffTime = Math.abs(end - start);
      daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    if (balances[leaveType] && balances[leaveType].remaining < daysCount) {
      toast.error(t("leaveBalances.toastInsufficientBalance", "Insufficient leave balance"));
      return;
    }

    // Deduct balance
    if (balances[leaveType]) {
      setBalances((prev) => ({
        ...prev,
        [leaveType]: {
          ...prev[leaveType],
          remaining: Math.max(0, prev[leaveType].remaining - daysCount),
        },
      }));
    }

    const monthNamesEn = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthNamesAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const startDay = start.getDate();
    const monthIndex = start.getMonth();

    const newRequest = {
      id: `req-${Date.now()}`,
      type: leaveType,
      typeLabelKey: leaveType,
      day: startDay,
      monthEn: monthNamesEn[monthIndex],
      monthAr: monthNamesAr[monthIndex],
      fullDateEn: `Jun 22 – Jun 24 · ${daysCount} days`,
      fullDateAr: `22 يونيو – 24 يونيو · ${daysCount} أيام`,
      status: "Pending",
      reason: reason.trim(),
    };

    setRecentRequests((prev) => [newRequest, ...prev]);

    // Toast العادي المحفوظ + حالة تحول الزر في الـ UI
    toast.success(t("leaveBalances.toastSubmitted", "Leave request submitted successfully!"));
    setIsSubmittedSuccess(true);

    setTimeout(() => {
      setIsSubmittedSuccess(false);
    }, 3500);

    // Reset fields
    setReason("");
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Calendar Days
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push({ day: d, isCurrentMonth: true });
    }
    return days;
  }, [calendarMonth]);

  const monthNamesLongEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthNamesLongAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* 1. Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#5b8c6a] uppercase mb-1 block">
            {t("leaveBalances.timeOffTag", "TIME OFF")}
          </span>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#102a43] tracking-tight">
            {t("leaveBalances.title", "Leave & balances")}
          </h1>
          <p className="text-sm text-[#829ab1] mt-1 font-normal">
            {t("leaveBalances.subtitle", "Plan time away and keep track of your remaining allowance.")}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setIsCalendarOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#d9e2ec] bg-white px-4 py-2.5 text-xs font-semibold text-[#102a43] hover:bg-[#f8fafc] transition shadow-sm shrink-0 self-start sm:self-auto"
        >
          <FiCalendar className="w-4 h-4 text-[#64748b]" />
          <span>{t("leaveBalances.viewCalendar", "View calendar")}</span>
        </motion.button>
      </motion.div>

      {/* 2. Balance Cards Grid (3 Columns) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Annual Leave */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">
              {t("leaveBalances.annualLeave", "ANNUAL LEAVE")}
            </span>
            <FiCalendar className="w-4 h-4 text-[#cbd5e1]" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold text-[#102a43] leading-none">
                {balances.annual.remaining}
              </span>
              <span className="text-xs text-[#829ab1]">
                / {balances.annual.total} {t("leaveBalances.days", "days")}
              </span>
            </div>

            <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (balances.annual.remaining / balances.annual.total) * 100)}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-[#486581] h-full rounded-full"
              />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase mt-3 block">
            {balances.annual.remaining} {t("leaveBalances.daysRemainingText", "DAYS REMAINING")}
          </span>
        </motion.div>

        {/* Card 2: Casual Leave */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">
              {t("leaveBalances.casualLeave", "CASUAL LEAVE")}
            </span>
            <FiCalendar className="w-4 h-4 text-[#cbd5e1]" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold text-[#102a43] leading-none">
                {balances.casual.remaining}
              </span>
              <span className="text-xs text-[#829ab1]">
                / {balances.casual.total} {t("leaveBalances.days", "days")}
              </span>
            </div>

            <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (balances.casual.remaining / balances.casual.total) * 100)}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                className="bg-[#d97706] h-full rounded-full"
              />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase mt-3 block">
            {balances.casual.remaining} {t("leaveBalances.daysRemainingText", "DAYS REMAINING")}
          </span>
        </motion.div>

        {/* Card 3: Sick Leave */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">
              {t("leaveBalances.sickLeave", "SICK LEAVE")}
            </span>
            <FiCalendar className="w-4 h-4 text-[#cbd5e1]" />
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold text-[#102a43] leading-none">
                {balances.sick.remaining}
              </span>
              <span className="text-xs text-[#829ab1]">
                / {balances.sick.total} {t("leaveBalances.days", "days")}
              </span>
            </div>

            <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (balances.sick.remaining / balances.sick.total) * 100)}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="bg-[#059669] h-full rounded-full"
              />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase mt-3 block">
            {balances.sick.remaining} {t("leaveBalances.daysRemainingText", "DAYS REMAINING")}
          </span>
        </motion.div>
      </motion.div>

      {/* 3. Main Section: Request Leave Form + Recent Requests */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Request Leave Form (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#e2e8f0] bg-white p-6 md:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#102a43]">
                {t("leaveBalances.requestLeave", "Request leave")}
              </h2>
              <p className="text-xs text-[#829ab1] mt-0.5">
                {t("leaveBalances.requestSubtitle", "Submit a request for manager approval.")}
              </p>
            </div>
            <FiCalendar className="w-4 h-4 text-[#cbd5e1]" />
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Leave Type */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1.5 block">
                  {t("leaveBalances.leaveType", "Leave type")}
                </label>
                <div className="relative">
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full h-10 px-3.5 bg-white border border-[#d9e2ec] rounded-xl text-xs text-[#102a43] font-medium appearance-none focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition cursor-pointer"
                  >
                    <option value="annual">{t("leaveBalances.annual", "Annual leave")}</option>
                    <option value="casual">{t("leaveBalances.casual", "Casual leave")}</option>
                    <option value="sick">{t("leaveBalances.sick", "Sick leave")}</option>
                    <option value="unpaid">{t("leaveBalances.unpaid", "Unpaid leave")}</option>
                  </select>
                  <FiChevronDown
                    className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none w-4 h-4`}
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1.5 block">
                  {t("leaveBalances.duration", "Duration")}
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-10 px-3.5 bg-white border border-[#d9e2ec] rounded-xl text-xs text-[#102a43] font-medium appearance-none focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition cursor-pointer"
                  >
                    <option value="fullDay">{t("leaveBalances.fullDay", "Full day")}</option>
                    <option value="halfDayMorning">{t("leaveBalances.halfDayMorning", "Half day (Morning)")}</option>
                    <option value="halfDayEvening">{t("leaveBalances.halfDayEvening", "Half day (Evening)")}</option>
                  </select>
                  <FiChevronDown
                    className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none w-4 h-4`}
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1.5 block">
                  {t("leaveBalances.startDate", "Start date")}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white border border-[#d9e2ec] rounded-xl text-xs text-[#102a43] font-medium focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1.5 block">
                  {t("leaveBalances.endDate", "End date")}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white border border-[#d9e2ec] rounded-xl text-xs text-[#102a43] font-medium focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-semibold text-[#64748b] mb-1.5 block">
                {t("leaveBalances.reason", "Reason")}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("leaveBalances.reasonPlaceholder", "Add a reason for your request...")}
                rows={3}
                className="w-full p-3.5 bg-white border border-[#d9e2ec] rounded-xl text-xs text-[#102a43] placeholder-[#94a3b8] focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition resize-none"
              />
            </div>

            {/* Attach Document (Dashed Box) */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-[#cbd5e1] hover:border-[#64748b] rounded-xl p-3 bg-[#fbfcfd] hover:bg-[#f8fafc] transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FiPaperclip className="text-[#64748b] w-4 h-4" />
                  {attachedFile ? (
                    <div className="flex items-center gap-2">
                      <FiFileText className="text-[#059669] w-4 h-4" />
                      <span className="text-xs font-medium text-[#102a43]">
                        {attachedFile.name}
                      </span>
                      <span className="text-[10px] text-[#94a3b8]">
                        ({(attachedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-[#64748b]">
                      {t("leaveBalances.attachDocument", "Attach supporting document")}
                    </span>
                  )}
                </div>

                {attachedFile && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-[#94a3b8] hover:text-[#dc2626] p-1 transition"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button (Animated State transition) */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-5 py-2.5 bg-[#102a43] hover:bg-[#1a3857] text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2 transition cursor-pointer"
              >
                {isSubmittedSuccess ? (
                  <>
                    <FiCheck className="w-4 h-4 text-[#4ade80]" />
                    <span>{t("leaveBalances.requestSubmitted", "Request submitted")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("leaveBalances.submitRequest", "Submit request")}</span>
                    {isRtl ? <FiArrowLeft className="w-3.5 h-3.5" /> : <FiArrowRight className="w-3.5 h-3.5" />}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Right Column: Recent Requests (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#102a43]">
              {t("leaveBalances.recentRequests", "Recent requests")}
            </h2>
            <p className="text-xs text-[#829ab1] mt-0.5">
              {t("leaveBalances.recentSubtitle", "Your latest time-off activity.")}
            </p>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {recentRequests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#f1f5f9] hover:bg-[#f8fafc] transition gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#ecfdf5] text-[#059669] flex flex-col items-center justify-center font-bold shrink-0">
                      <span className="text-sm leading-none">{req.day}</span>
                      <span className="text-[9px] tracking-wide uppercase leading-tight mt-0.5">
                        {isRtl ? req.monthAr : req.monthEn}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#102a43] capitalize">
                        {req.type} leave
                      </h3>
                      <p className="text-[11px] text-[#64748b] mt-0.5">
                        {isRtl ? req.fullDateAr : req.fullDateEn}
                      </p>
                    </div>
                  </div>

                  <div>
                    {req.status === "Approved" && (
                      <span className="inline-block bg-[#ecfdf5] text-[#059669] text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {t("leaveBalances.statusApproved", "Approved")}
                      </span>
                    )}
                    {req.status === "Pending" && (
                      <span className="inline-block bg-[#fefce8] text-[#d97706] text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {t("leaveBalances.statusPending", "Pending")}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 4. Calendar Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCalendarOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#e2e8f0] overflow-hidden p-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
                <div>
                  <h3 className="text-base font-bold text-[#102a43]">
                    {t("leaveBalances.calendarModalTitle", "Leave Calendar")}
                  </h3>
                  <p className="text-xs text-[#829ab1] mt-0.5">
                    {t("leaveBalances.calendarModalSubtitle", "Overview of your scheduled time off.")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#102a43] transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Month Controls */}
              <div className="flex items-center justify-between py-4">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                  }
                  className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] transition"
                >
                  {isRtl ? <FiChevronRight /> : <FiChevronLeft />}
                </button>

                <h4 className="text-sm font-bold text-[#102a43]">
                  {isRtl
                    ? `${monthNamesLongAr[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`
                    : `${monthNamesLongEn[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`}
                </h4>

                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                  }
                  className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] transition"
                >
                  {isRtl ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">
                <span>{isRtl ? "أحد" : "Sun"}</span>
                <span>{isRtl ? "إثن" : "Mon"}</span>
                <span>{isRtl ? "ثلا" : "Tue"}</span>
                <span>{isRtl ? "أرب" : "Wed"}</span>
                <span>{isRtl ? "خمي" : "Thu"}</span>
                <span>{isRtl ? "جمع" : "Fri"}</span>
                <span>{isRtl ? "سبت" : "Sat"}</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, idx) => {
                  if (!item.isCurrentMonth) {
                    return <div key={`empty-${idx}`} className="h-9 rounded-lg" />;
                  }

                  const isCasualLeaveDay = calendarMonth.getMonth() === 4 && item.day === 14;
                  const isScheduledAnnual = calendarMonth.getMonth() === 5 && item.day >= 22 && item.day <= 24;

                  return (
                    <div
                      key={`day-${item.day}`}
                      className={`h-9 rounded-lg flex flex-col items-center justify-center text-xs font-semibold relative transition ${
                        isCasualLeaveDay
                          ? "bg-[#ecfdf5] text-[#059669] font-bold border border-[#a7f3d0]"
                          : isScheduledAnnual
                          ? "bg-[#eff6ff] text-[#2563eb] font-bold border border-[#bfdbfe]"
                          : "text-[#334155] hover:bg-[#f8fafc]"
                      }`}
                    >
                      <span>{item.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f1f5f9]">
                <div className="flex items-center gap-3 text-xs text-[#64748b]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0]" />
                    <span>Casual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#eff6ff] border border-[#bfdbfe]" />
                    <span>Annual</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="px-4 py-2 bg-[#102a43] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3857] transition"
                >
                  {t("leaveBalances.close", "Close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}