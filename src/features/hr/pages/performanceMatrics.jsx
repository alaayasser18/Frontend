import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiInfo,
  FiUsers,
} from "react-icons/fi";

import { LuSparkles } from "react-icons/lu";

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

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

// =====================================================
// PERFORMANCE METRICS
// =====================================================

const PerformanceMetrics = () => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");

  // =====================================================
  // STATE
  // =====================================================

  const [progressStarted, setProgressStarted] = useState(false);

  // =====================================================
  // PROGRESS ANIMATION
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressStarted(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // =====================================================
  // DATA
  // =====================================================

  const attentionSignals = [
    {
      name: t("hrCommandCenter.youssefLotfy"),
      description: t("hrCommandCenter.youssefDescription"),
      level: "high",
    },
    {
      name: t("hrCommandCenter.karimAshraf"),
      description: t("hrCommandCenter.karimDescription"),
      level: "medium",
    },
    {
      name: t("hrCommandCenter.alexandriaHub"),
      description: t("hrCommandCenter.alexandriaDescription"),
      level: "low",
    },
  ];

  const readinessItems = [
    {
      label: t("hrCommandCenter.attendanceVerification"),
      value: 90,
      type: "green",
    },
    {
      label: t("hrCommandCenter.leaveApprovals"),
      value: 76,
      type: "orange",
    },
    {
      label: t("hrCommandCenter.q3Evaluations"),
      value: 68,
      type: "blue",
    },
    {
      label: t("hrCommandCenter.payrollReconciliation"),
      value: 94,
      type: "green",
    },
  ];

  // =====================================================
  // HELPERS
  // =====================================================

  const getLevelStyles = (level) => {
    switch (level) {
      case "high":
        return {
          dot: "bg-[#ef4444]",
          badge: "bg-[#fef2f2] text-[#dc2626]",
        };

      case "medium":
        return {
          dot: "bg-[#f97316]",
          badge: "bg-[#fff7ed] text-[#c2410c]",
        };

      default:
        return {
          dot: "bg-[#10b981]",
          badge: "bg-[#ecfdf5] text-[#15803d]",
        };
    }
  };

  const getProgressColor = (type) => {
    switch (type) {
      case "orange":
        return "bg-[#f97316]";

      case "blue":
        return "bg-[#3b82f6]";

      default:
        return "bg-[#10b981]";
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <motion.div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-w-0 space-y-6 overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
            {isArabic
              ? "الموارد البشرية / مركز التحكم"
              : "HR Portal / Command Center"}
          </p>

          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
            {t("hrCommandCenter.title")}
          </h1>

          <p className="mt-1 text-sm font-normal text-[#64748b]">
            {t("hrCommandCenter.subtitle")}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => navigate("/hr/ai-insights")}
          whileHover={{
            y: -2,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.97,
          }}
          transition={{
            duration: 0.2,
          }}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
        >
          <LuSparkles className="h-4 w-4" />

          <span>{t("hrCommandCenter.explainToday")}</span>
        </motion.button>
      </motion.div>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Employees */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t("hrCommandCenter.totalEmployees")}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
              <FiUsers className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              142
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              +6% {t("hrCommandCenter.monthOverMonth")}
            </p>
          </div>
        </motion.div>

        {/* Present Today */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t("hrCommandCenter.presentToday")}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981]">
              <FiCheckCircle className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              128
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              90.1% {t("hrCommandCenter.workforcePresent")}
            </p>
          </div>
        </motion.div>

        {/* Pending Reviews */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t("hrCommandCenter.pendingReviews")}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#f97316]">
              <FiClock className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              7
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              4 {t("hrCommandCenter.leaves")} · 3{" "}
              {t("hrCommandCenter.advances")}
            </p>
          </div>
        </motion.div>

        {/* Projected Payroll */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t("hrCommandCenter.projectedPayroll")}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ff] text-[#8b5cf6]">
              <FiDollarSign className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              $184,500
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {t("hrCommandCenter.septemberExecution")}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* =================================================
          LOWER SECTION
      ================================================= */}

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]"
      >
        {/* Employee Attention Signals */}
        <motion.section
          variants={itemVariants}
          className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="text-base font-bold text-[#1e293b] sm:text-lg">
                {t("hrCommandCenter.employeeAttentionSignals")}
              </h2>

              <span className="hidden rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[9px] font-bold text-[#15803d] sm:inline-flex">
                {t("hrCommandCenter.groundedMetrics")}
              </span>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#f97316]">
              <FiInfo className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {attentionSignals.map((item, index) => {
              const styles = getLevelStyles(item.level);

              return (
                <motion.div
                  key={`${item.name}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.07,
                  }}
                  className="flex min-h-[82px] items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fafbfc] sm:px-6"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8fafc] text-[#94a3b8]">
                    <FiAlertTriangle className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-bold text-[#1e293b]">
                        {item.name}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${styles.badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                        />

                        {t(`hrCommandCenter.${item.level}`)}
                      </span>
                    </div>

                    <p className="text-xs leading-5 text-[#64748b]">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#475569] transition hover:bg-[#f8fafc] hover:text-[#243B53] sm:flex"
                  >
                    {t("hrCommandCenter.review")}

                    <FiArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Operational Readiness */}
        <motion.section
          variants={itemVariants}
          className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-5 sm:px-6">
            <h2 className="text-base font-bold text-[#1e293b] sm:text-lg">
              {t("hrCommandCenter.operationalReadiness")}
            </h2>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
              <FiInfo className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="space-y-6 px-5 py-6 sm:px-6">
            {readinessItems.map((item, index) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#64748b]">
                    {item.label}
                  </span>

                  <span className="text-xs font-bold text-[#1e293b]">
                    {item.value}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                  <div
                    className={`h-full rounded-full transition-all duration-[1200ms] ease-out ${getProgressColor(
                      item.type,
                    )}`}
                    style={{
                      width: progressStarted ? `${item.value}%` : "0%",
                      transitionDelay: `${index * 120}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceMetrics;
