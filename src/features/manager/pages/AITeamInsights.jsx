import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LuSparkles } from "react-icons/lu";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const AITeamInsights = () => {
  const { t } = useTranslation();

  const skillGaps = [
    {
      id: 1,
      title: t("managerAI.skillGaps.systemDesign", "System design"),
      badge: t("managerAI.skillGaps.systemDesignBadge", "2 members need coaching"),
      action: t("managerAI.skillGaps.systemDesignAction", "Pair on architecture reviews"),
    },
    {
      id: 2,
      title: t("managerAI.skillGaps.mentorship", "Mentorship"),
      badge: t("managerAI.skillGaps.mentorshipBadge", "Low coverage this cycle"),
      action: t("managerAI.skillGaps.mentorshipAction", "Assign rotating peer mentor"),
    },
    {
      id: 3,
      title: t("managerAI.skillGaps.testStrategy", "Test strategy"),
      badge: t("managerAI.skillGaps.testStrategyBadge", "Opportunity area"),
      action: t("managerAI.skillGaps.testStrategyAction", "Run a focused QA workshop"),
    },
  ];

  const burnoutSignals = [
    {
      id: 1,
      name: "Youssef Lotfy",
      load: 68,
      status: t("managerAI.burnout.high", "High"),
      statusClass: "bg-[#fef2f2] text-[#dc2626]",
      barClass: "bg-[#dc2626]",
    },
    {
      id: 2,
      name: "Karim Ashraf",
      load: 54,
      status: t("managerAI.burnout.watch", "Watch"),
      statusClass: "bg-[#fefce8] text-[#d97706]",
      barClass: "bg-[#d97706]",
    },
    {
      id: 3,
      name: "Salma Nabil",
      load: 31,
      status: t("managerAI.burnout.balanced", "Balanced"),
      statusClass: "bg-[#ecfdf5] text-[#059669]",
      barClass: "bg-[#059669]",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* =====================================================
          1. BREADCRUMB + PAGE HEADER
      ====================================================== */}
      <motion.div variants={fadeUp} transition={{ duration: 0.2, ease: "easeOut" }}>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("managerAI.breadcrumb", "MANAGER PORTAL / AI TEAM INSIGHTS")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("managerAI.title", "AI Team Insights")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerAI.subtitle",
            "Keep your team aligned, supported, and moving forward."
          )}
        </p>
      </motion.div>

      {/* =====================================================
          2. MAIN CARDS GRID
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ---------------------------------------------------
            LEFT CARD: TEAM SKILL-GAP BREAKDOWN
        ---------------------------------------------------- */}
        <motion.section
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
        >
          {/* Subtle left accent bar */}
          <div className="absolute inset-y-0 left-0 w-1 bg-[#334e68] rtl:left-auto rtl:right-0" />

          {/* Header */}
          <div className="flex items-start gap-3.5 mb-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e2e8f0]/60 text-[#486581]">
              <LuSparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#486581]">
                {t("managerAI.skillGapCard.eyebrow", "GROUNDED MANAGER INTELLIGENCE")}
              </p>
              <h2 className="text-lg font-bold text-[#102a43] mt-0.5">
                {t("managerAI.skillGapCard.title", "Team Skill-Gap Breakdown")}
              </h2>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                {t(
                  "managerAI.skillGapCard.description",
                  "Verified delivery and evaluation signals identify coaching opportunities without replacing manager judgment."
                )}
              </p>
            </div>
          </div>

          {/* Skill Items */}
          <div className="space-y-3">
            {skillGaps.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-[#f8fafc] p-4 border border-[#f1f5f9]"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#1e293b]">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-[#fefce8] px-2.5 py-0.5 text-xs font-medium text-[#b45309]">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] mt-1.5">
                  <span className="text-[#94a3b8]">{t("managerAI.suggestedAction", "Suggested action")}:</span>{" "}
                  {item.action}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ---------------------------------------------------
            RIGHT CARD: BURNOUT RISK SIGNALS
        ---------------------------------------------------- */}
        <motion.section
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
          className="relative rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
        >
          {/* Subtle amber left accent bar */}
          <div className="absolute inset-y-0 left-0 w-1 bg-[#d97706] rtl:left-auto rtl:right-0" />

          {/* Header */}
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#d97706]">
              {t("managerAI.burnoutCard.eyebrow", "WORKLOAD BALANCE")}
            </p>
            <h2 className="text-lg font-bold text-[#102a43] mt-0.5">
              {t("managerAI.burnoutCard.title", "Burnout Risk Signals")}
            </h2>
            <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
              {t(
                "managerAI.burnoutCard.description",
                "Review these patterns with your team before taking action. Signals are guidance, not automated decisions."
              )}
            </p>
          </div>

          {/* Burnout Signals List */}
          <div className="space-y-5">
            {burnoutSignals.map((member, index) => (
              <div key={member.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#1e293b]">
                    {member.name}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${member.statusClass}`}
                  >
                    {member.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${member.load}%` }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.2 + index * 0.05,
                    }}
                    className={`h-full rounded-full ${member.barClass}`}
                  />
                </div>

                <p className="text-xs text-[#64748b]">
                  {member.load}% {t("managerAI.burnout.sprintLoad", "sprint load")} ·{" "}
                  {t("managerAI.burnout.suggestedCheckIn", "Suggested check-in")}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AITeamInsights;