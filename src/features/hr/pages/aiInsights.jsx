import { useTranslation } from "react-i18next";
import { Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

// =====================================================
// MOTION
// =====================================================

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
// LEVEL STYLES
// =====================================================

const levelStyles = {
  high: "border border-[#fecaca] bg-[#fef2f2] text-[#dc2626]",
  medium: "border border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]",
  low: "border border-[#bbf7d0] bg-[#ecfdf5] text-[#16a34a]",
};

// =====================================================
// ATTENTION CARD
// =====================================================

function AttentionCard({ item, isLast }) {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${
        !isLast ? "border-b border-[#f1f5f9]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-bold text-[#1e293b]">{item.name}</h3>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
            levelStyles[item.level]
          }`}
        >
          {item.levelLabel}
        </span>
      </div>

      <p className="mt-1 text-xs font-normal leading-5 text-[#64748b] sm:text-sm">
        {item.note}
      </p>

      <button
        type="button"
        className="
          mt-3
          rounded-lg
          border
          border-[#e2e8f0]
          bg-white
          px-3
          py-2
          text-xs
          font-semibold
          text-[#475569]
          transition
          hover:bg-[#f8fafc]
        "
      >
        {item.checkInLabel}
      </button>
    </div>
  );
}

// =====================================================
// SKILL GAP ROW
// =====================================================

function SkillGapRow({ item, isLast }) {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${
        !isLast ? "border-b border-[#f1f5f9]" : ""
      }`}
    >
      <h3 className="text-sm font-bold text-[#1e293b]">{item.title}</h3>

      <p className="mt-1 text-xs font-normal leading-5 text-[#64748b] sm:text-sm">
        {item.count} · {item.suggested} {item.suggestion}
      </p>
    </div>
  );
}

// =====================================================
// AI INSIGHTS PAGE
// =====================================================

export default function AIInsights() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  // ===================================================
  // DATA — TRANSLATED
  // ===================================================

  const attentionSignals = [
    {
      name: t("aiInsights.youssefLotfy"),
      note: t("aiInsights.youssefNote"),
      level: "high",
      levelLabel: t("aiInsights.highAttention"),
      checkInLabel: t("aiInsights.scheduleHrCheckIn"),
    },
    {
      name: t("aiInsights.karimAshraf"),
      note: t("aiInsights.karimNote"),
      level: "medium",
      levelLabel: t("aiInsights.mediumAttention"),
      checkInLabel: t("aiInsights.scheduleHrCheckIn"),
    },
    {
      name: t("aiInsights.nourAdel"),
      note: t("aiInsights.nourNote"),
      level: "low",
      levelLabel: t("aiInsights.lowAttention"),
      checkInLabel: t("aiInsights.scheduleHrCheckIn"),
    },
  ];

  const skillGaps = [
    {
      title: t("aiInsights.frontendArchitecture"),
      count: t("aiInsights.frontendArchitectureCount"),
      suggestion: t("aiInsights.frontendArchitectureSuggestion"),
    },
    {
      title: t("aiInsights.leadership"),
      count: t("aiInsights.leadershipCount"),
      suggestion: t("aiInsights.leadershipSuggestion"),
    },
    {
      title: t("aiInsights.dataLiteracy"),
      count: t("aiInsights.dataLiteracyCount"),
      suggestion: t("aiInsights.dataLiteracySuggestion"),
    },
  ];

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <motion.div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <motion.header
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
            HR / AI INSIGHTS
          </p>

          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
            {t("aiInsights.title")}
          </h1>

          <p className="mt-1 text-sm font-normal text-[#64748b]">
            {t("aiInsights.subtitle")}
          </p>
        </div>

        <button
          type="button"
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-[#243B53]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#1c2f42]
          "
        >
          <Sparkles
            className="
              h-4
              w-4
              transition
              duration-300
              group-hover:rotate-12
            "
          />

          <span>{t("aiInsights.refreshAnalysis")}</span>
        </button>
      </motion.header>

      {/* =================================================
          GROUNDED AI BANNER
      ================================================= */}

      <motion.div
        variants={itemVariants}
        className="
          flex
          items-start
          gap-3
          rounded-2xl
          border
          border-[#e2e8f0]/80
          bg-white
          p-5
          shadow-[0_1px_3px_rgba(0,0,0,0.03)]
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#ecfdf5]
            text-[#10b981]
          "
        >
          <ShieldCheck className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1e293b]">
            {t("aiInsights.groundedAiPanel")}
          </p>

          <p className="mt-1 text-xs font-normal leading-5 text-[#64748b] sm:text-sm">
            {t("aiInsights.groundedAiDescription")}
          </p>
        </div>
      </motion.div>

      {/* =================================================
          TWO COLUMN PANELS
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* =================================================
            EMPLOYEE ATTENTION SIGNALS
        ================================================= */}

        <motion.div
          variants={itemVariants}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#e2e8f0]/80
            bg-white
            shadow-[0_1px_3px_rgba(0,0,0,0.03)]
          "
        >
          <div className="border-b border-[#f1f5f9] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  HR MONITORING
                </p>

                <h2 className="mt-1 text-base font-bold text-[#1e293b]">
                  {t("aiInsights.employeeAttentionSignals")}
                </h2>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#fff7ed]
                  text-[#f97316]
                "
              >
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            {attentionSignals.map((item, index) => (
              <AttentionCard
                key={item.name}
                item={item}
                isLast={index === attentionSignals.length - 1}
              />
            ))}
          </div>
        </motion.div>

        {/* =================================================
            WORKFORCE SKILL GAPS
        ================================================= */}

        <motion.div
          variants={itemVariants}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#e2e8f0]/80
            bg-white
            shadow-[0_1px_3px_rgba(0,0,0,0.03)]
          "
        >
          <div className="border-b border-[#f1f5f9] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  DEVELOPMENT
                </p>

                <h2 className="mt-1 text-base font-bold text-[#1e293b]">
                  {t("aiInsights.workforceSkillGaps")}
                </h2>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#f5f3ff]
                  text-[#8b5cf6]
                "
              >
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            {skillGaps.map((item, index) => (
              <SkillGapRow
                key={item.title}
                item={item}
                isLast={index === skillGaps.length - 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
