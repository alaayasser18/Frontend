import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiCalendar,
  FiShield,
  FiMapPin,
  FiSmartphone,
  FiActivity,
  FiDownload,
  FiChevronDown,
  FiSearch,
  FiMoreHorizontal,
  FiUsers,
  FiArrowUpRight,
  FiX,
  FiSave,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const attendanceData = [
  {
    employeeKey: "hrAttendance.emp1Name",
    employeeDefault: "Youssef Lotfy",
    id: "WW-00142",
    branchKey: "hrAttendance.branchCairo",
    branchDefault: "Cairo HQ",
    shiftKey: "hrAttendance.shiftMorning",
    shiftDefault: "Morning 9–5",
    checkIn: "09:02",
    checkOut: "17:04",
    duration: "8h 02m",
    delay: "—",
    mode: "gps",
    status: "present",
  },
  {
    employeeKey: "hrAttendance.emp2Name",
    employeeDefault: "Mariam Hassan",
    id: "WW-00118",
    branchKey: "hrAttendance.branchCairo",
    branchDefault: "Cairo HQ",
    shiftKey: "hrAttendance.shiftMorning",
    shiftDefault: "Morning 9–5",
    checkIn: "09:27",
    checkOut: "17:10",
    duration: "8h 02m",
    delay: "27 min",
    mode: "biometric",
    status: "late",
  },
  {
    employeeKey: "hrAttendance.emp3Name",
    employeeDefault: "Ahmed Samir",
    id: "WW-00153",
    branchKey: "hrAttendance.branchAlex",
    branchDefault: "Alexandria",
    shiftKey: "hrAttendance.shiftMorning",
    shiftDefault: "Morning 9–5",
    checkIn: "08:58",
    checkOut: "17:01",
    duration: "8h 03m",
    delay: "—",
    mode: "gps",
    status: "present",
  },
  {
    employeeKey: "hrAttendance.emp4Name",
    employeeDefault: "Nour Adel",
    id: "WW-00174",
    branchKey: "hrAttendance.branchCairo",
    branchDefault: "Cairo HQ",
    shiftKey: "hrAttendance.shiftMorning",
    shiftDefault: "Morning 9–5",
    checkIn: "—",
    checkOut: "—",
    duration: "—",
    delay: "—",
    mode: "none",
    status: "absent",
  },
];

const Attendance = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.toLowerCase().startsWith("ar");

  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [search, setSearch] = useState("");

  const [adjustmentModal, setAdjustmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [adjustment, setAdjustment] = useState({
    type: "checkIn",
    time: "",
    reason: "",
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.94,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 10,
      transition: {
        duration: 0.18,
      },
    },
  };

  const stats = [
    {
      id: "present",
      title: t("hrAttendance.presentToday"),
      value: "128",
      description: t("hrAttendance.acrossAllBranches"),
      icon: FiCheckCircle,
      iconWrapper: "bg-[#ecfdf5]",
      iconColor: "text-[#10b981]",
    },
    {
      id: "late",
      title: t("hrAttendance.lateArrivals"),
      value: "8",
      description: t("hrAttendance.gracePeriod"),
      icon: FiClock,
      iconWrapper: "bg-[#fff7ed]",
      iconColor: "text-[#f97316]",
    },
    {
      id: "absent",
      title: t("hrAttendance.unexcusedAbsences"),
      value: "6",
      description: t("hrAttendance.requiresFollowUp"),
      icon: FiAlertTriangle,
      iconWrapper: "bg-[#fef2f2]",
      iconColor: "text-[#ef4444]",
    },
    {
      id: "leave",
      title: t("hrAttendance.approvedLeave"),
      value: "4",
      description: t("hrAttendance.today"),
      icon: FiCalendar,
      iconWrapper: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]",
    },
  ];

  const filteredData = useMemo(() => {
    return attendanceData.filter((row) => {
      const searchValue = search.trim().toLowerCase();

      const employeeName = t(
        row.employeeKey,
        row.employeeDefault,
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        employeeName.includes(searchValue) ||
        row.id.toLowerCase().includes(searchValue);

      const branch =
        row.branchDefault === "Cairo HQ"
          ? "cairo"
          : row.branchDefault === "Alexandria"
            ? "alexandria"
            : "giza";

      const shift = row.shiftDefault === "Morning 9–5" ? "morning" : "evening";

      return (
        matchesSearch &&
        (selectedBranch === "all" || selectedBranch === branch) &&
        (selectedShift === "all" || selectedShift === shift)
      );
    });
  }, [search, selectedBranch, selectedShift, t]);

  const statusStyles = {
    present: {
      wrapper: "bg-[#ecfdf5] text-[#047857] ring-1 ring-inset ring-[#d1fae5]",
      dot: "bg-[#10b981]",
      label: t("hrAttendance.statusPresent"),
    },

    late: {
      wrapper: "bg-[#fff7ed] text-[#c2410c] ring-1 ring-inset ring-[#fed7aa]",
      dot: "bg-[#f97316]",
      label: t("hrAttendance.statusLate"),
    },

    absent: {
      wrapper: "bg-[#fef2f2] text-[#b91c1c] ring-1 ring-inset ring-[#fecaca]",
      dot: "bg-[#ef4444]",
      label: t("hrAttendance.statusAbsent"),
    },
  };

  const modeConfig = {
    gps: {
      icon: FiMapPin,
      title: t("hrAttendance.modeGPS"),
      subtitle: t("hrAttendance.modeGeofenced"),
    },

    biometric: {
      icon: FiSmartphone,
      title: t("hrAttendance.modeBiometric"),
      subtitle: t("hrAttendance.modeDevice"),
    },

    none: {
      icon: FiActivity,
      title: "—",
      subtitle: "",
    },
  };

  const openAdjustmentModal = (employee) => {
    setSelectedEmployee(employee);

    setAdjustment({
      type: "checkIn",
      time: employee.checkIn !== "—" ? employee.checkIn : "",
      reason: "",
    });

    setAdjustmentModal(true);
  };

  const closeAdjustmentModal = () => {
    setAdjustmentModal(false);
    setSelectedEmployee(null);

    setAdjustment({
      type: "checkIn",
      time: "",
      reason: "",
    });
  };

  const handleAdjustmentChange = (field, value) => {
    setAdjustment((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveAdjustment = (event) => {
    event.preventDefault();

    if (!adjustment.time || !adjustment.reason.trim()) {
      return;
    }

    setSavedMessage(true);

    window.setTimeout(() => {
      setSavedMessage(false);
    }, 2500);

    closeAdjustmentModal();
  };

  return (
    <>
      <motion.div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* ==================== SUCCESS MESSAGE ==================== */}

        <AnimatePresence>
          {savedMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -15,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -15,
                scale: 0.96,
              }}
              className={`fixed top-5 z-[200] flex items-center gap-3 rounded-xl border border-[#d1fae5] bg-white px-4 py-3 shadow-xl ${
                isArabic ? "left-5" : "right-5"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#10b981]">
                <FiCheckCircle className="h-4 w-4" />
              </div>

              <span className="text-sm font-semibold text-[#334155]">
                {t(
                  "hrAttendance.adjustmentSaved",
                  "Attendance adjustment saved successfully",
                )}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== HEADER ==================== */}

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
              {t("hrAttendance.breadcrumbHome")} / {t("hrAttendance.title")}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
                {t("hrAttendance.title")}
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-bold text-[#047857] ring-1 ring-inset ring-[#d1fae5]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                </span>

                {t("hrAttendance.live")}
              </span>
            </div>

            <p className="mt-1 text-sm font-normal text-[#64748b]">
              {t("hrAttendance.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
            >
              <FiDownload className="h-4 w-4" />
              {t("hrAttendance.export")}
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
            >
              <FiActivity className="h-4 w-4" />
              {t("hrAttendance.viewLive")}
            </motion.button>
          </div>
        </motion.div>

        {/* ==================== FILTERS ==================== */}

        <motion.section
          variants={itemVariants}
          className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
              <FiSearch className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#1e293b]">
                {isArabic ? "تصفية الحضور" : "Attendance Filters"}
              </h2>

              <p className="mt-0.5 text-xs font-normal text-[#64748b]">
                {isArabic
                  ? "ابحث وحدد الفرع والوردية لعرض السجلات المطلوبة"
                  : "Search and filter attendance records by branch and shift"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {/* Search */}

            <div className="relative lg:col-span-2">
              <FiSearch
                className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] ${
                  isArabic ? "right-3.5" : "left-3.5"
                }`}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("hrAttendance.searchPlaceholder")}
                className={`h-10 w-full rounded-lg border border-[#e2e8f0] bg-white text-xs text-[#475569] outline-none transition placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] ${
                  isArabic ? "pr-10 pl-3" : "pl-10 pr-3"
                }`}
              />
            </div>

            {/* Date */}

            <button
              type="button"
              className="flex h-10 items-center justify-between gap-4 rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-xs font-medium text-[#475569] transition hover:bg-[#f8fafc]"
            >
              <span className="flex items-center gap-2">
                <FiCalendar className="h-4 w-4 text-[#94a3b8]" />
                09/15/2026
              </span>

              <FiChevronDown className="h-4 w-4 text-[#94a3b8]" />
            </button>

            {/* Branch */}

            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={`h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white text-xs font-medium text-[#475569] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] ${
                  isArabic ? "pr-3 pl-9" : "pl-3 pr-9"
                }`}
              >
                <option value="all">{t("hrAttendance.allBranches")}</option>

                <option value="cairo">{t("hrAttendance.branchCairo")}</option>

                <option value="alexandria">
                  {t("hrAttendance.branchAlex")}
                </option>

                <option value="giza">{t("hrAttendance.branchGiza")}</option>
              </select>

              <FiChevronDown
                className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] ${
                  isArabic ? "left-3" : "right-3"
                }`}
              />
            </div>

            {/* Shift */}

            <div className="relative">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className={`h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white text-xs font-medium text-[#475569] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] ${
                  isArabic ? "pr-3 pl-9" : "pl-3 pr-9"
                }`}
              >
                <option value="all">{t("hrAttendance.allShifts")}</option>

                <option value="morning">
                  {t("hrAttendance.shiftMorning")}
                </option>

                <option value="evening">
                  {t("hrAttendance.shiftEvening")}
                </option>
              </select>

              <FiChevronDown
                className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] ${
                  isArabic ? "left-3" : "right-3"
                }`}
              />
            </div>
          </div>
        </motion.section>

        {/* ==================== STATS ==================== */}

        <motion.section
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-[27px] font-bold tracking-tight text-[#0f172a]">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs font-normal text-[#64748b]">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconWrapper} ${stat.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* ==================== POLICY ==================== */}

        <motion.section
          variants={itemVariants}
          className="rounded-2xl border border-[#d1fae5] bg-[#ecfdf5] p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#10b981] shadow-sm">
              <FiShield className="h-4 w-4" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-[#065f46]">
                {t("hrAttendance.policyLabel")}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-[#047857]">
                {t("hrAttendance.policyText")}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#047857] transition hover:bg-white/70"
            >
              {t("hrAttendance.viewPolicy")}

              <FiArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.section>

        {/* ==================== TABLE ==================== */}

        <motion.section
          variants={itemVariants}
          className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex flex-col justify-between gap-3 border-b border-[#f1f5f9] px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1e293b]">
                  {t("hrAttendance.tableTitle")}
                </h2>

                <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-bold text-[#64748b]">
                  {filteredData.length}
                </span>
              </div>

              <p className="mt-0.5 text-xs font-normal text-[#64748b]">
                {t("hrAttendance.tableSubtitle")}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 self-start rounded-lg px-2 py-1.5 text-xs font-semibold text-[#64748b] transition hover:bg-[#f8fafc]"
            >
              <FiMoreHorizontal className="h-4 w-4" />

              {t("hrAttendance.more")}
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {[
                    "colEmployee",
                    "colBranch",
                    "colShift",
                    "colCheckIn",
                    "colCheckOut",
                    "colDuration",
                    "colDelay",
                    "colMode",
                    "colStatus",
                    "colAction",
                  ].map((key) => (
                    <th
                      key={key}
                      className="whitespace-nowrap border-b border-[#f1f5f9] px-5 py-3 text-start text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]"
                    >
                      {t(`hrAttendance.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row, index) => {
                  const status = statusStyles[row.status];
                  const mode = modeConfig[row.mode];
                  const ModeIcon = mode.icon;

                  return (
                    <motion.tr
                      key={row.id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="group border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]/70"
                    >
                      {/* Employee */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-xs font-bold text-[#3b82f6]">
                            {t(row.employeeKey, row.employeeDefault)
                              .split(" ")
                              .map((name) => name[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#1e293b]">
                              {t(row.employeeKey, row.employeeDefault)}
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#94a3b8]">
                              {row.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Branch */}

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-normal text-[#64748b]">
                          <FiMapPin className="h-3.5 w-3.5 text-[#94a3b8]" />

                          {t(row.branchKey, row.branchDefault)}
                        </span>
                      </td>

                      {/* Shift */}

                      <td className="px-5 py-4 text-sm font-normal text-[#64748b]">
                        {t(row.shiftKey, row.shiftDefault)}
                      </td>

                      {/* Check In */}

                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-medium text-[#475569]">
                          {row.checkIn}
                        </span>
                      </td>

                      {/* Check Out */}

                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-medium text-[#475569]">
                          {row.checkOut}
                        </span>
                      </td>

                      {/* Duration */}

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-[#64748b]">
                          {row.duration}
                        </span>
                      </td>

                      {/* Delay */}

                      <td className="px-5 py-4">
                        {row.delay !== "—" ? (
                          <span className="inline-flex rounded-lg bg-[#fff7ed] px-2 py-1 text-xs font-semibold text-[#c2410c]">
                            +{row.delay}
                          </span>
                        ) : (
                          <span className="text-sm text-[#cbd5e1]">—</span>
                        )}
                      </td>

                      {/* Mode */}

                      <td className="px-5 py-4">
                        {mode.title === "—" ? (
                          <span className="text-sm text-[#cbd5e1]">—</span>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b]">
                              <ModeIcon className="h-4 w-4" />
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-[#475569]">
                                {mode.title}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#94a3b8]">
                                {mode.subtitle}
                              </p>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${status.wrapper}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />

                          {status.label}
                        </span>
                      </td>

                      {/* Manual Adjustment */}

                      <td className="px-5 py-4">
                        <motion.button
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openAdjustmentModal(row)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2 text-xs font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
                        >
                          <FiClock className="h-3.5 w-3.5" />

                          {t("hrAttendance.manualAdjustment")}
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty */}

          {filteredData.length === 0 && (
            <div className="border-t border-[#f1f5f9] px-6 py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8fafc] text-[#94a3b8]">
                <FiUsers className="h-5 w-5" />
              </div>

              <h3 className="text-sm font-bold text-[#334155]">
                {t("hrAttendance.noResults")}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs font-normal text-[#64748b]">
                {t("hrAttendance.noResultsDescription")}
              </p>
            </div>
          )}

          {/* Footer */}

          <div className="flex items-center justify-between border-t border-[#f1f5f9] bg-[#f8fafc]/70 px-5 py-3">
            <p className="text-xs font-normal text-[#64748b]">
              {t("hrAttendance.showingResults", {
                count: filteredData.length,
              })}
            </p>

            <span className="text-xs font-medium text-[#64748b]">
              {t("hrAttendance.updatedJustNow")}
            </span>
          </div>
        </motion.section>
      </motion.div>

      {/* ==================== MANUAL ADJUSTMENT MODAL ==================== */}

      <AnimatePresence>
        {adjustmentModal && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0f172a]/40 px-4 backdrop-blur-[2px]"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeAdjustmentModal();
              }
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-xl"
            >
              {/* Modal Header */}

              <div className="flex items-start justify-between border-b border-[#f1f5f9] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
                    <FiClock className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#1e293b]">
                      {t("hrAttendance.manualAdjustment", "Manual Adjustment")}
                    </h3>

                    <p className="mt-0.5 text-xs text-[#64748b]">
                      {t(
                        selectedEmployee.employeeKey,
                        selectedEmployee.employeeDefault,
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeAdjustmentModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}

              <form onSubmit={handleSaveAdjustment} className="space-y-5 p-6">
                {/* Type */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#475569]">
                    {t("hrAttendance.adjustmentType", "Adjustment type")}
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustmentChange("type", "checkIn")}
                      className={`h-10 rounded-lg border text-xs font-semibold transition ${
                        adjustment.type === "checkIn"
                          ? "border-[#243B53] bg-[#eff6ff] text-[#243B53]"
                          : "border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc]"
                      }`}
                    >
                      {t("hrAttendance.checkIn", "Check-in")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdjustmentChange("type", "checkOut")}
                      className={`h-10 rounded-lg border text-xs font-semibold transition ${
                        adjustment.type === "checkOut"
                          ? "border-[#243B53] bg-[#eff6ff] text-[#243B53]"
                          : "border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc]"
                      }`}
                    >
                      {t("hrAttendance.checkOut", "Check-out")}
                    </button>
                  </div>
                </div>

                {/* Time */}

                <div>
                  <label
                    htmlFor="adjustment-time"
                    className="mb-2 block text-xs font-semibold text-[#475569]"
                  >
                    {t("hrAttendance.adjustmentTime", "New time")}
                  </label>

                  <input
                    id="adjustment-time"
                    type="time"
                    value={adjustment.time}
                    onChange={(e) =>
                      handleAdjustmentChange("time", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-xs text-[#475569] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9]"
                  />
                </div>

                {/* Reason */}

                <div>
                  <label
                    htmlFor="adjustment-reason"
                    className="mb-2 block text-xs font-semibold text-[#475569]"
                  >
                    {t("hrAttendance.adjustmentReason", "Reason")}
                  </label>

                  <textarea
                    id="adjustment-reason"
                    rows={4}
                    value={adjustment.reason}
                    onChange={(e) =>
                      handleAdjustmentChange("reason", e.target.value)
                    }
                    placeholder={t(
                      "hrAttendance.adjustmentReasonPlaceholder",
                      "Enter the reason for this adjustment...",
                    )}
                    className="w-full resize-none rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs leading-5 text-[#475569] outline-none transition placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9]"
                  />
                </div>

                {/* Buttons */}

                <div
                  className={`flex gap-2 border-t border-[#f1f5f9] pt-4 ${
                    isArabic ? "flex-row-reverse justify-start" : "justify-end"
                  }`}
                >
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={closeAdjustmentModal}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
                  >
                    {t("common.cancel", "Cancel")}
                  </motion.button>

                  <motion.button
                    whileHover={
                      adjustment.time && adjustment.reason.trim()
                        ? { y: -1 }
                        : {}
                    }
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!adjustment.time || !adjustment.reason.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <FiSave className="h-4 w-4" />

                    {t("hrAttendance.saveAdjustment", "Save adjustment")}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Attendance;
