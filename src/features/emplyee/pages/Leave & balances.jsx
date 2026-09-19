import { useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  LuCalendar,
  LuPaperclip,
  LuArrowRight,
  LuArrowLeft,
  LuX,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCheck,
  LuFileText,
} from "react-icons/lu";

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
      fullDateEn: "May 14",
      fullDateAr: "14 مايو",
      daysCount: 1,
      duration: "fullDay",
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
      toast.error(t("leaveBalances.toastFillRequired"));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toast.error(t("leaveBalances.toastInvalidDates"));
      return;
    }

    // Calculate requested days
    let daysCount = 1;
    if (duration === "halfDayMorning" || duration === "halfDayEvening") {
      daysCount = 0.5;
    } else {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      daysCount = diffDays;
    }

    // Check balance if applicable
    if (balances[leaveType]) {
      if (balances[leaveType].remaining < daysCount) {
        toast.error(t("leaveBalances.toastInsufficientBalance"));
        return;
      }

      // Deduct balance
      setBalances((prev) => ({
        ...prev,
        [leaveType]: {
          ...prev[leaveType],
          remaining: Math.max(0, prev[leaveType].remaining - daysCount),
        },
      }));
    }

    // Month & Day formatting for recent requests badge
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
      fullDateEn: `${monthNamesEn[monthIndex]} ${startDay}${daysCount > 1 ? ` - ${end.getDate()}` : ""}`,
      fullDateAr: `${startDay} ${monthNamesAr[monthIndex]}${daysCount > 1 ? ` - ${end.getDate()}` : ""}`,
      daysCount: daysCount,
      duration: duration,
      status: "Pending",
      reason: reason.trim(),
    };

    setRecentRequests((prev) => [newRequest, ...prev]);
    toast.success(t("leaveBalances.toastSubmitted"));

    // Reset Form
    setReason("");
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // Calendar Days Calculation
  // ==========================================
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
    <div className="w-full max-w-[1400px] mx-auto box-border font-sans p-2 sm:p-4 md:p-6 text-[#102a43]">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7 gap-4">
        <div>
          {/* Time Off Category Badge */}
          <span className="text-[11px] font-bold tracking-[0.08em] text-[#0f766e] uppercase block mb-1">
            {t("leaveBalances.timeOffTag")}
          </span>

          {/* Title */}
          <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[#102a43] tracking-tight leading-tight">
            {t("leaveBalances.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] sm:text-[14px] text-[#627d98] mt-1">
            {t("leaveBalances.subtitle")}
          </p>
        </div>

        {/* View Calendar Button */}
        <button
          type="button"
          onClick={() => setIsCalendarOpen(true)}
          className="bg-white border border-[#d9e2ec] hover:border-[#9fb3c8] hover:bg-[#f8fafc] text-[#334e68] text-[13px] font-semibold px-4 py-2.5 rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <LuCalendar className="text-[#627d98] text-[16px]" />
          <span>{t("leaveBalances.viewCalendar")}</span>
        </button>
      </div>

      {/* =====================================================
          BALANCE CARDS (3 COLUMNS)
      ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {/* Card 1: Annual Leave */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs flex flex-col justify-between hover:border-[#cbd5e1] transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold text-[#829ab1] tracking-wider uppercase">
              {t("leaveBalances.annualLeave")}
            </span>
            <LuCalendar className="text-[#9fb3c8] text-[17px]" />
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[30px] font-bold text-[#102a43] leading-none">
                {balances.annual.remaining}
              </span>
              <span className="text-[14px] font-normal text-[#627d98]">
                / {balances.annual.total} {t("leaveBalances.days")}
              </span>
            </div>

            {/* Blue Progress Bar */}
            <div className="w-full bg-[#edf2f7] h-[5px] rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#486581] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (balances.annual.remaining / balances.annual.total) * 100)}%`,
                }}
              />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-wider text-[#829ab1] uppercase mt-2">
            {t("leaveBalances.daysRemaining", { count: balances.annual.remaining })}
          </span>
        </div>

        {/* Card 2: Casual Leave */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs flex flex-col justify-between hover:border-[#cbd5e1] transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold text-[#829ab1] tracking-wider uppercase">
              {t("leaveBalances.casualLeave")}
            </span>
            <LuCalendar className="text-[#9fb3c8] text-[17px]" />
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[30px] font-bold text-[#102a43] leading-none">
                {balances.casual.remaining}
              </span>
              <span className="text-[14px] font-normal text-[#627d98]">
                / {balances.casual.total} {t("leaveBalances.days")}
              </span>
            </div>

            {/* Amber/Mustard Progress Bar */}
            <div className="w-full bg-[#edf2f7] h-[5px] rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#b7791f] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (balances.casual.remaining / balances.casual.total) * 100)}%`,
                }}
              />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-wider text-[#829ab1] uppercase mt-2">
            {t("leaveBalances.daysRemaining", { count: balances.casual.remaining })}
          </span>
        </div>

        {/* Card 3: Sick Leave */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs flex flex-col justify-between hover:border-[#cbd5e1] transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold text-[#829ab1] tracking-wider uppercase">
              {t("leaveBalances.sickLeave")}
            </span>
            <LuCalendar className="text-[#9fb3c8] text-[17px]" />
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[30px] font-bold text-[#102a43] leading-none">
                {balances.sick.remaining}
              </span>
              <span className="text-[14px] font-normal text-[#627d98]">
                / {balances.sick.total} {t("leaveBalances.days")}
              </span>
            </div>

            {/* Forest Green Progress Bar */}
            <div className="w-full bg-[#edf2f7] h-[5px] rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#2f6a4f] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (balances.sick.remaining / balances.sick.total) * 100)}%`,
                }}
              />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-wider text-[#829ab1] uppercase mt-2">
            {t("leaveBalances.daysRemaining", { count: balances.sick.remaining })}
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN SECTION (REQUEST LEAVE FORM & RECENT REQUESTS)
      ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==========================================
            LEFT COLUMN: REQUEST LEAVE FORM (8 COLS)
        ========================================== */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs">
          {/* Card Title & Icon */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[19px] font-bold text-[#102a43] leading-tight">
                {t("leaveBalances.requestLeave")}
              </h2>
              <p className="text-[13px] text-[#627d98] mt-1">
                {t("leaveBalances.requestSubtitle")}
              </p>
            </div>
            <LuCalendar className="text-[#9fb3c8] text-[18px]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitRequest}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
              {/* Field 1: Leave Type */}
              <div>
                <label className="text-[12px] font-semibold text-[#334e68] mb-1.5 block">
                  {t("leaveBalances.leaveType")}
                </label>
                <div className="relative">
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full h-[42px] px-3.5 bg-white border border-[#d9e2ec] rounded-lg text-[13px] text-[#102a43] font-medium appearance-none focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition-all cursor-pointer"
                  >
                    <option value="annual">{t("leaveBalances.annual")}</option>
                    <option value="casual">{t("leaveBalances.casual")}</option>
                    <option value="sick">{t("leaveBalances.sick")}</option>
                    <option value="unpaid">{t("leaveBalances.unpaid")}</option>
                  </select>
                  <LuChevronDown
                    className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-[#627d98] pointer-events-none text-[15px]`}
                  />
                </div>
              </div>

              {/* Field 2: Duration */}
              <div>
                <label className="text-[12px] font-semibold text-[#334e68] mb-1.5 block">
                  {t("leaveBalances.duration")}
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-[42px] px-3.5 bg-white border border-[#d9e2ec] rounded-lg text-[13px] text-[#102a43] font-medium appearance-none focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition-all cursor-pointer"
                  >
                    <option value="fullDay">{t("leaveBalances.fullDay")}</option>
                    <option value="halfDayMorning">{t("leaveBalances.halfDayMorning")}</option>
                    <option value="halfDayEvening">{t("leaveBalances.halfDayEvening")}</option>
                  </select>
                  <LuChevronDown
                    className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-[#627d98] pointer-events-none text-[15px]`}
                  />
                </div>
              </div>

              {/* Field 3: Start Date */}
              <div>
                <label className="text-[12px] font-semibold text-[#334e68] mb-1.5 block">
                  {t("leaveBalances.startDate")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-[42px] px-3.5 bg-white border border-[#d9e2ec] rounded-lg text-[13px] text-[#102a43] font-medium focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition-all"
                  />
                </div>
              </div>

              {/* Field 4: End Date */}
              <div>
                <label className="text-[12px] font-semibold text-[#334e68] mb-1.5 block">
                  {t("leaveBalances.endDate")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-[42px] px-3.5 bg-white border border-[#d9e2ec] rounded-lg text-[13px] text-[#102a43] font-medium focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Field 5: Reason */}
            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#334e68] mb-1.5 block">
                {t("leaveBalances.reason")}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("leaveBalances.reasonPlaceholder")}
                rows={4}
                className="w-full p-3.5 bg-white border border-[#d9e2ec] rounded-lg text-[13px] text-[#102a43] placeholder-[#9fb3c8] focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition-all resize-y min-h-[110px]"
              />
            </div>

            {/* Field 6: Attach Supporting Document (Dashed Box) */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-[#bcccdc] hover:border-[#627d98] rounded-lg p-3.5 bg-[#fbfcfd] hover:bg-[#f8fafc] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <LuPaperclip className="text-[#627d98] text-[16px] rotate-45" />
                  {attachedFile ? (
                    <div className="flex items-center gap-2">
                      <LuFileText className="text-[#0f766e] text-[15px]" />
                      <span className="text-[13px] font-medium text-[#102a43]">
                        {attachedFile.name}
                      </span>
                      <span className="text-[11px] text-[#829ab1]">
                        ({(attachedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ) : (
                    <span className="text-[13px] font-medium text-[#334e68]">
                      {t("leaveBalances.attachDocument")}
                    </span>
                  )}
                </div>

                {attachedFile && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-[#9fb3c8] hover:text-[#e12d39] p-1 transition-colors"
                    title={t("leaveBalances.removeDocument")}
                  >
                    <LuX className="text-[16px]" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#102a43] hover:bg-[#243b53] active:scale-[0.98] text-white text-[13px] font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>{t("leaveBalances.submitRequest")}</span>
                {isRtl ? (
                  <LuArrowLeft className="text-[15px]" />
                ) : (
                  <LuArrowRight className="text-[15px]" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ==========================================
            RIGHT COLUMN: RECENT REQUESTS (4 COLS)
        ========================================== */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs">
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-[18px] font-bold text-[#102a43] leading-tight">
              {t("leaveBalances.recentRequests")}
            </h2>
            <p className="text-[13px] text-[#627d98] mt-1">
              {t("leaveBalances.recentSubtitle")}
            </p>
          </div>

          {/* Requests List */}
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-[#829ab1]">
                {t("leaveBalances.noRecentRequests")}
              </div>
            ) : (
              recentRequests.map((req) => {
                const isApproved = req.status === "Approved";
                const isPending = req.status === "Pending";

                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#f0f4f8] hover:bg-[#f8fafc] transition-colors gap-3"
                  >
                    {/* Left side: Date Badge + Info */}
                    <div className="flex items-center gap-3">
                      {/* Date Badge */}
                      <div className="w-[46px] h-[46px] rounded-lg bg-[#e6f4ea] text-[#137333] flex flex-col items-center justify-center font-bold flex-shrink-0">
                        <span className="text-[15px] leading-none">{req.day}</span>
                        <span className="text-[9px] tracking-wide uppercase leading-tight mt-0.5">
                          {isRtl ? req.monthAr : req.monthEn}
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-[13px] font-bold text-[#102a43] leading-tight">
                          {t(`leaveBalances.${req.typeLabelKey}`, req.type)}
                        </h3>
                        <p className="text-[11.5px] text-[#627d98] mt-0.5">
                          {isRtl ? req.fullDateAr : req.fullDateEn} ·{" "}
                          {req.daysCount}{" "}
                          {req.daysCount === 1
                            ? t("leaveBalances.day")
                            : t("leaveBalances.daysPlural")}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Status Pill */}
                    <div>
                      {isApproved && (
                        <span className="inline-block bg-[#e6f4ea] text-[#137333] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                          {t("leaveBalances.statusApproved")}
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-block bg-[#fef3c7] text-[#92400e] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                          {t("leaveBalances.statusPending")}
                        </span>
                      )}
                      {!isApproved && !isPending && (
                        <span className="inline-block bg-[#fee2e2] text-[#991b1b] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                          {t("leaveBalances.statusRejected")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          CALENDAR MODAL
      ===================================================== */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102a43]/50 backdrop-blur-xs transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[620px] border border-[#e2e8f0] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#edf2f7]">
              <div>
                <h3 className="text-[18px] font-bold text-[#102a43]">
                  {t("leaveBalances.calendarModalTitle")}
                </h3>
                <p className="text-[12px] text-[#627d98] mt-0.5">
                  {t("leaveBalances.calendarModalSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#627d98] hover:text-[#102a43] hover:bg-[#f0f4f8] transition-colors"
              >
                <LuX className="text-[18px]" />
              </button>
            </div>

            {/* Calendar Controls */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() - 1,
                        1
                      )
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-[#d9e2ec] flex items-center justify-center hover:bg-[#f8fafc] text-[#334e68]"
                >
                  {isRtl ? <LuChevronRight /> : <LuChevronLeft />}
                </button>

                <h4 className="text-[15px] font-bold text-[#102a43]">
                  {isRtl
                    ? `${monthNamesLongAr[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`
                    : `${monthNamesLongEn[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`}
                </h4>

                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() + 1,
                        1
                      )
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-[#d9e2ec] flex items-center justify-center hover:bg-[#f8fafc] text-[#334e68]"
                >
                  {isRtl ? <LuChevronLeft /> : <LuChevronRight />}
                </button>
              </div>

              {/* Day names header */}
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#829ab1] uppercase tracking-wider mb-2">
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
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="h-10 rounded-md bg-[#f8fafc]/50"
                      />
                    );
                  }

                  const isCasualLeaveDay =
                    calendarMonth.getMonth() === 4 && item.day === 14;
                  const isScheduledAnnual =
                    calendarMonth.getMonth() === 5 &&
                    item.day >= 22 &&
                    item.day <= 24;

                  return (
                    <div
                      key={`day-${item.day}`}
                      className={`h-10 rounded-lg flex flex-col items-center justify-center text-[13px] font-semibold relative transition-colors ${
                        isCasualLeaveDay
                          ? "bg-[#e6f4ea] text-[#137333] font-bold border border-[#b7eb8f]"
                          : isScheduledAnnual
                          ? "bg-[#e8f1fa] text-[#1d4ed8] font-bold border border-[#bfdbfe]"
                          : "text-[#334e68] hover:bg-[#f0f4f8]"
                      }`}
                    >
                      <span>{item.day}</span>
                      {isCasualLeaveDay && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#137333] absolute bottom-1" />
                      )}
                      {isScheduledAnnual && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] absolute bottom-1" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-[#edf2f7] text-[12px] text-[#627d98]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#e6f4ea] border border-[#b7eb8f]" />
                  <span>{t("leaveBalances.casualLeave")} (14 May)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#e8f1fa] border border-[#bfdbfe]" />
                  <span>{t("leaveBalances.calendarLegendUpcoming")}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 bg-[#f8fafc] border-t border-[#edf2f7]">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="px-4 py-2 bg-[#102a43] text-white text-[13px] font-semibold rounded-lg hover:bg-[#243b53] transition-colors"
              >
                {t("leaveBalances.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
