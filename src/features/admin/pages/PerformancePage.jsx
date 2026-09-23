import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
  FiArrowUpRight,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiCheckCircle,
} from "react-icons/fi";

import DepartmentTable from "../../../components/DepartmentTable";

import { motion, AnimatePresence } from "framer-motion";

/* ─── Animation presets ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 14 },

  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: i * 0.07,
      ease: "easeOut",
    },
  }),
};

const modalBackdrop = {
  hidden: { opacity: 0 },

  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },

  exit: {
    opacity: 0,
    transition: { duration: 0.18 },
  },
};

const modalPanel = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 18,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.26,
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

const toastVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    y: -15,
    scale: 0.96,
    transition: {
      duration: 0.2,
    },
  },
};

/* ─── Animated progress bar ─── */

const ProgressBar = ({
  pct,
  color = "bg-[#5b8c6a]",
  bg = "bg-[#d9e2ec]",
}) => (
  <div className={`h-2 rounded-full ${bg} overflow-hidden`}>
    <motion.div
      className={`h-full rounded-full ${color}`}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      }}
    />
  </div>
);

/* ─── Weightage bar ─── */

const WeightBar = ({ pct }) => (
  <div className="h-2 rounded-full bg-[#eef1f4] overflow-hidden">
    <motion.div
      className="h-full rounded-full bg-[#486581]"
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
        delay: 0.15,
      }}
    />
  </div>
);

/* ─── Criteria ─── */

const CRITERIA = [
  {
    key: "technical",
    label: "performance.technicalCompetency",
    fallback: "Technical competency",
    color: "bg-[#486581]",
  },
  {
    key: "goals",
    label: "performance.goalsDelivery",
    fallback: "Goals delivery",
    color: "bg-[#486581]",
  },
  {
    key: "leadership",
    label: "performance.leadershipCulture",
    fallback: "Leadership & culture",
    color: "bg-[#486581]",
  },
  {
    key: "attendance",
    label: "performance.attendanceReliability",
    fallback: "Attendance & reliability",
    color: "bg-[#486581]",
  },
];

const PerformancePage = () => {
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language?.startsWith("ar");

  /* ── Modal state ── */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);

  /* ── New cycle form ── */

  const [cycleTitle, setCycleTitle] = useState("Q4 2026 Review");

  const [startDate, setStartDate] = useState("2026-10-01");

  const [endDate, setEndDate] = useState("2026-12-31");

  const [targetAudience, setTargetAudience] = useState("All Company");

  const [weightage, setWeightage] = useState({
    technical: 30,
    goals: 35,
    leadership: 20,
    attendance: 15,
  });

  /* ── Saved active cycle ── */

  const [savedCycle, setSavedCycle] = useState({
    title: "Q3 2026 Review",
    start: "2026-07-01",
    end: "2026-09-30",
    audience: "All Company",
    weightage: {
      technical: 30,
      goals: 35,
      leadership: 20,
      attendance: 15,
    },
  });

  /* ── Edit cycle form ── */

  const [editTitle, setEditTitle] = useState("Q3 2026 Review");

  const [editStart, setEditStart] = useState("2026-07-01");

  const [editEnd, setEditEnd] = useState("2026-09-30");

  /* ── Total weightage ── */

  const totalWeightage = Object.values(weightage).reduce(
    (s, v) => s + Number(v || 0),
    0
  );

  /* ── Weightage change ── */

  const handleWeightageChange = (key, value) => {
    setWeightage((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ── Create / Save cycle ── */

  const handleSaveCycle = () => {
    if (!cycleTitle.trim()) {
      alert(
        t(
          "performance.enterCycleTitle",
          "Please enter a cycle title."
        )
      );
      return;
    }

    if (!startDate || !endDate) {
      alert(
        t(
          "performance.selectDates",
          "Please select start and end dates."
        )
      );
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert(
        t(
          "performance.invalidDates",
          "Start date must be before end date."
        )
      );
      return;
    }

    if (totalWeightage !== 100) {
      alert(
        t(
          "performance.weightageMustBe100",
          "Total weightage must equal 100%."
        )
      );
      return;
    }

    const newCycle = {
      title: cycleTitle,
      start: startDate,
      end: endDate,
      audience: targetAudience,
      weightage: {
        technical: Number(weightage.technical),
        goals: Number(weightage.goals),
        leadership: Number(weightage.leadership),
        attendance: Number(weightage.attendance),
      },
    };

    setSavedCycle(newCycle);

    /* Sync edit form with newly created cycle */
    setEditTitle(cycleTitle);
    setEditStart(startDate);
    setEditEnd(endDate);

    setIsModalOpen(false);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  /* ── Edit active cycle ── */

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      alert(
        t(
          "performance.enterCycleTitle",
          "Please enter a cycle title."
        )
      );
      return;
    }

    if (!editStart || !editEnd) {
      alert(
        t(
          "performance.selectDates",
          "Please select start and end dates."
        )
      );
      return;
    }

    if (new Date(editStart) > new Date(editEnd)) {
      alert(
        t(
          "performance.invalidDates",
          "Start date must be before end date."
        )
      );
      return;
    }

    setSavedCycle((prev) => ({
      ...prev,
      title: editTitle,
      start: editStart,
      end: editEnd,
    }));

    setIsEditModalOpen(false);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  /* ── Open edit modal with current saved data ── */

  const handleOpenEdit = () => {
    setEditTitle(savedCycle.title);
    setEditStart(savedCycle.start);
    setEditEnd(savedCycle.end);

    setIsEditModalOpen(true);
  };

  /* ── Format date ── */

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString(
      isRtl ? "ar-EG" : "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  /* ── Export configuration ── */

  const handleExportConfiguration = () => {
    const configuration = {
      exportedAt: new Date().toISOString(),

      activeCycle: {
        title: savedCycle.title,
        startDate: savedCycle.start,
        endDate: savedCycle.end,
        targetAudience: savedCycle.audience,
        weightage: {
          technical: Number(savedCycle.weightage.technical),
          goals: Number(savedCycle.weightage.goals),
          leadership: Number(savedCycle.weightage.leadership),
          attendance: Number(savedCycle.weightage.attendance),
        },
      },

      criteria: CRITERIA.map((criterion) => ({
        key: criterion.key,
        name: t(criterion.label, criterion.fallback),
        weightage: Number(
          savedCycle.weightage[criterion.key] || 0
        ),
      })),

      totalWeightage: Object.values(savedCycle.weightage).reduce(
        (sum, value) => sum + Number(value || 0),
        0
      ),
    };

    const blob = new Blob(
      [JSON.stringify(configuration, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "performance-configuration.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full space-y-6"
    >
      {/* ── Breadcrumb ── */}

      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#829ab1]"
      >
        <span>
          {t(
            "performance.breadcrumbAdmin",
            "Administration"
          )}
        </span>

        <FiChevronRight
          className={`w-3.5 h-3.5 text-[#9fb3c8] ${
            isRtl ? "rotate-180" : ""
          }`}
        />

        <span className="text-[#486581]">
          {t(
            "performance.title",
            "Performance & Goals"
          )}
        </span>
      </motion.div>

      {/* ── Page Header ── */}

      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#243B53]">
            {t(
              "performance.title",
              "Performance & Goals"
            )}
          </h1>

          <p className="mt-1.5 text-[14px] leading-[1.4] text-[#627d98]">
            {t(
              "performance.subtitle",
              "Configure and manage your WiseWork performance & goals."
            )}
          </p>
        </div>

        {/* Export Configuration */}

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleExportConfiguration}
          className="self-start sm:self-auto inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#bcccdc] rounded-lg text-[#486581] text-[14px] font-semibold shadow-[0_1px_2px_rgba(16,42,67,0.04)] hover:bg-[#f0f4f7] hover:border-[#9fb3c8] transition-all duration-150 whitespace-nowrap"
        >
          <FiArrowUpRight size={17} />

          {t(
            "performance.exportConfiguration",
            "Export configuration"
          )}
        </motion.button>
      </motion.div>

      {/* ── Main Content ── */}

      <div className="flex flex-col gap-6">
        {/* ── Top Row: Governance + Criteria ── */}

        <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          {/* Goals & Evaluation Governance */}

          <motion.section
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-[#d9e2ec] bg-white p-5 sm:p-6"
          >
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#243B53] leading-[1.3]">
                  {t(
                    "performance.governanceTitle",
                    "Goals & evaluation governance"
                  )}
                </h2>

                <p className="mt-1 text-[14px] text-[#829ab1]">
                  {t(
                    "performance.governanceSubtitle",
                    "System-wide criteria and review cycle controls."
                  )}
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 h-10 px-[18px] bg-[#243B53] rounded-lg text-white text-[14px] font-semibold shadow-[0_1px_3px_rgba(16,42,67,0.12)] hover:bg-[#334e68] transition-colors whitespace-nowrap"
              >
                <FiPlus size={16} />

                {t(
                  "performance.createEvaluation",
                  "Create Evaluation Cycle"
                )}
              </motion.button>
            </div>

            {/* Active Cycle Card */}

            <div className="rounded-xl border border-[#d9e2ec] bg-[#f7fafb] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3eb] px-2.5 py-1 text-xs font-semibold text-[#3f7d5a]">
                    <span className="size-1.5 rounded-full bg-current" />

                    {t(
                      "performance.activeCycle",
                      "Active cycle"
                    )}
                  </span>

                  <h3 className="mt-3 text-[18px] font-bold text-[#243B53]">
                    {savedCycle.title}
                  </h3>

                  <p className="mt-1 text-[14px] text-[#627d98]">
                    {formatDate(savedCycle.start)}
                    {" – "}
                    {formatDate(savedCycle.end)}
                    {" · 1,248 employees"}
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenEdit}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#bcccdc] rounded-lg text-[#486581] text-[14px] font-semibold hover:bg-[#f0f4f7] hover:border-[#9fb3c8] transition-colors"
                >
                  {t(
                    "performance.editCycle",
                    "Edit cycle"
                  )}
                </motion.button>
              </div>

              {/* Completion progress */}

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs font-semibold text-[#627d98]">
                  <span>
                    {t(
                      "performance.reviewCompletion",
                      "Review completion"
                    )}
                  </span>

                  <span>64%</span>
                </div>

                <ProgressBar
                  pct={64}
                  color="bg-[#5b8c6a]"
                  bg="bg-[#d9e2ec]"
                />
              </div>
            </div>
          </motion.section>

          {/* Criteria Weightage */}

          <motion.section
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-[#d9e2ec] bg-white p-5 sm:p-6"
          >
            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-[#243B53] leading-[1.3]">
                {t(
                  "performance.criteriaWeightage",
                  "Criteria weightage"
                )}
              </h2>

              <p className="mt-1 text-[14px] text-[#829ab1]">
                {t(
                  "performance.criteriaSubtitle",
                  "The score composition for the active cycle."
                )}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {CRITERIA.map((c) => (
                <div key={c.key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-[#486581]">
                      {t(c.label, c.fallback)}
                    </span>

                    <span className="font-bold text-[#243B53]">
                      {savedCycle.weightage[c.key]}%
                    </span>
                  </div>

                  <WeightBar
                    pct={Number(
                      savedCycle.weightage[c.key]
                    )}
                  />
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* ── Department Table ── */}

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <DepartmentTable />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          CREATE EVALUATION CYCLE MODAL
      ══════════════════════════════════════════ */}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="create-backdrop"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/40 p-4"
            onClick={(e) =>
              e.target === e.currentTarget &&
              setIsModalOpen(false)
            }
          >
            <motion.div
              key="create-panel"
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              dir={isRtl ? "rtl" : "ltr"}
              className="relative max-h-[90vh] w-full max-w-[604px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
            >
              {/* Header */}

              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-bold text-[#243B53]">
                  {t(
                    "performance.createCycleTitle",
                    "Create Evaluation Cycle"
                  )}
                </h2>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#627d98] hover:bg-[#f0f4f7] hover:text-[#243B53] transition"
                  aria-label={t(
                    "performance.close",
                    "Close"
                  )}
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Cycle Title */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#486581]">
                  {t(
                    "performance.cycleTitle",
                    "Cycle Title"
                  )}
                </label>

                <input
                  type="text"
                  value={cycleTitle}
                  onChange={(e) =>
                    setCycleTitle(e.target.value)
                  }
                  placeholder={t(
                    "performance.cycleTitlePlaceholder",
                    "Q4 2026 Review"
                  )}
                  className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3.5 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                />
              </div>

              {/* Dates */}

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#486581]">
                    {t(
                      "performance.startDate",
                      "Start Date"
                    )}
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#486581]">
                    {t(
                      "performance.endDate",
                      "End Date"
                    )}
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                  />
                </div>
              </div>

              {/* Target Audience */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-[#486581]">
                  {t(
                    "performance.targetAudience",
                    "Target Audience"
                  )}
                </label>

                <div className="relative">
                  <select
                    value={targetAudience}
                    onChange={(e) =>
                      setTargetAudience(e.target.value)
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-[#bcccdc] bg-white px-3.5 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                  >
                    <option value="All Company">
                      {t(
                        "performance.allCompany",
                        "All Company"
                      )}
                    </option>

                    <option value="Engineering">
                      {t(
                        "performance.engineering",
                        "Engineering"
                      )}
                    </option>

                    <option value="HR">
                      {t(
                        "performance.hr",
                        "HR"
                      )}
                    </option>

                    <option value="Finance">
                      {t(
                        "performance.finance",
                        "Finance"
                      )}
                    </option>

                    <option value="Sales">
                      {t(
                        "performance.sales",
                        "Sales"
                      )}
                    </option>
                  </select>

                  <FiChevronDown
                    size={16}
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#486581] ${
                      isRtl
                        ? "left-3.5"
                        : "right-3.5"
                    }`}
                  />
                </div>
              </div>

              {/* Dynamic Weightage */}

              <div className="mb-7">
                <h3 className="mb-5 text-base font-semibold text-[#486581]">
                  {t(
                    "performance.dynamicWeightage",
                    "Dynamic weightage"
                  )}
                </h3>

                <div className="flex flex-col gap-4">
                  {CRITERIA.map((c) => (
                    <div
                      key={c.key}
                      className="flex items-center justify-between gap-4"
                    >
                      <label className="text-sm font-medium text-[#627d98]">
                        {t(
                          c.label,
                          c.fallback
                        )}
                      </label>

                      <div className="relative w-[94px] shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={weightage[c.key]}
                          onChange={(e) =>
                            handleWeightageChange(
                              c.key,
                              e.target.value
                            )
                          }
                          className="h-11 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                        />

                        <span
                          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs text-[#829ab1] ${
                            isRtl
                              ? "left-3"
                              : "right-3"
                          }`}
                        >
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}

                <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f7fafb] border border-[#eef1f4] px-4 py-3 text-sm">
                  <span className="font-semibold text-[#486581]">
                    {t(
                      "performance.totalWeightage",
                      "Total weightage"
                    )}
                  </span>

                  <motion.span
                    key={totalWeightage}
                    initial={{
                      scale: 0.85,
                      opacity: 0.4,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    className={`font-bold ${
                      totalWeightage === 100
                        ? "text-[#3f7d5a]"
                        : "text-[#d97706]"
                    }`}
                  >
                    {totalWeightage}%
                  </motion.span>
                </div>
              </div>

              {/* Footer */}

              <div
                className={`flex flex-col-reverse gap-3 sm:flex-row ${
                  isRtl
                    ? "sm:justify-start"
                    : "sm:justify-end"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[#bcccdc] bg-white px-5 text-sm font-semibold text-[#486581] hover:bg-[#f0f4f7] transition-colors"
                >
                  {t(
                    "performance.cancel",
                    "Cancel"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveCycle}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#243B53] px-5 text-sm font-semibold text-white hover:bg-[#334e68] transition-colors"
                >
                  {t(
                    "performance.saveCycle",
                    "Save cycle"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          EDIT ACTIVE CYCLE MODAL
      ══════════════════════════════════════════ */}

      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            key="edit-backdrop"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/40 p-4"
            onClick={(e) =>
              e.target === e.currentTarget &&
              setIsEditModalOpen(false)
            }
          >
            <motion.div
              key="edit-panel"
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              dir={isRtl ? "rtl" : "ltr"}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              {/* Header */}

              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-[18px] font-bold text-[#243B53]">
                  {t(
                    "performance.editCycleTitle",
                    "Edit Active Cycle"
                  )}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setIsEditModalOpen(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#627d98] hover:bg-[#f0f4f7] hover:text-[#243B53] transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#486581]">
                    {t(
                      "performance.cycleTitle",
                      "Cycle Title"
                    )}
                  </label>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3.5 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#486581]">
                      {t(
                        "performance.startDate",
                        "Start Date"
                      )}
                    </label>

                    <input
                      type="date"
                      value={editStart}
                      onChange={(e) =>
                        setEditStart(e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#486581]">
                      {t(
                        "performance.endDate",
                        "End Date"
                      )}
                    </label>

                    <input
                      type="date"
                      value={editEnd}
                      onChange={(e) =>
                        setEditEnd(e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`mt-6 flex gap-3 ${
                  isRtl
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsEditModalOpen(false)
                  }
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#bcccdc] bg-white px-5 text-sm font-semibold text-[#486581] hover:bg-[#f0f4f7] transition-colors"
                >
                  {t(
                    "performance.cancel",
                    "Cancel"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#243B53] px-5 text-sm font-semibold text-white hover:bg-[#334e68] transition-colors"
                >
                  {t(
                    "performance.saveCycle",
                    "Save"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          SUCCESS TOAST
      ══════════════════════════════════════════ */}

      <AnimatePresence>
        {showToast && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-5 ${
              isRtl ? "left-5" : "right-5"
            } z-[100] flex items-center gap-3 rounded-xl border border-[#d9e2ec] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(16,42,67,0.12)]`}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[#e8f3eb] text-[#3f7d5a]">
              <FiCheckCircle size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#243B53]">
                {t(
                  "performance.exportSuccessTitle",
                  "Success"
                )}
              </p>

              <p className="mt-0.5 text-xs text-[#829ab1]">
                {t(
                  "performance.exportSuccessMessage",
                  "Performance configuration saved/exported successfully."
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerformancePage;