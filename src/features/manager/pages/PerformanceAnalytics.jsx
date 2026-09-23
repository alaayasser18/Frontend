import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const PerformanceAnalytics = () => {
  const { t } = useTranslation();

  // =====================================================
  // 1. DEPARTMENT COMPETENCIES (القيم والألوان من الـ UI بدقة)
  // =====================================================
  const competencies = [
    {
      id: 1,
      nameKey: "technicalExecution",
      defaultName: "Technical execution",
      value: 82,
    },
    {
      id: 2,
      nameKey: "communication",
      defaultName: "Communication",
      value: 74,
    },
    {
      id: 3,
      nameKey: "ownership",
      defaultName: "Ownership",
      value: 68,
    },
    {
      id: 4,
      nameKey: "mentorship",
      defaultName: "Mentorship",
      value: 56,
    },
  ];

  // =====================================================
  // 2. TEAM PERFORMANCE (مطابقة للـ UI: نص velocity وتقييم أخضر)
  // =====================================================
  const teamPerformance = [
    {
      id: 1,
      nameKey: "youssefLotfy",
      defaultName: "Youssef Lotfy",
      velocity: 88,
      rating: 4.6,
    },
    {
      id: 2,
      nameKey: "karimAshraf",
      defaultName: "Karim Ashraf",
      velocity: 83,
      rating: 4.4,
    },
    {
      id: 3,
      nameKey: "salmaNabil",
      defaultName: "Salma Nabil",
      velocity: 78,
      rating: 4.2,
    },
    {
      id: 4,
      nameKey: "omarFathy",
      defaultName: "Omar Fathy",
      velocity: 73,
      rating: 4.0,
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
          PAGE HEADER
      ====================================================== */}
      <motion.div variants={fadeUp} transition={{ duration: 0.2, ease: "easeOut" }}>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("portal.managerPortal", "MANAGER PORTAL")} / {t("portal.performanceAnalytics", "PERFORMANCE ANALYTICS")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("portal.performanceAnalytics", "Performance Analytics")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerDashboard.subtitle",
            "Keep your team aligned, supported, and moving forward."
          )}
        </p>
      </motion.div>

      {/* =====================================================
          ANALYTICS CARDS GRID
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ---------------------------------------------------
            LEFT CARD: DEPARTMENT COMPETENCY DISTRIBUTION
        ---------------------------------------------------- */}
        <motion.section
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        >
          <h2 className="text-base font-bold text-[#102a43] mb-6">
            {t(
              "managerPerformanceAnalytics.departmentCompetencyDistribution",
              "Department competency distribution"
            )}
          </h2>

          <div className="space-y-5">
            {competencies.map((competency, index) => {
              const label = t(
                `managerPerformanceAnalytics.competencies.${competency.nameKey}`,
                competency.defaultName
              );

              return (
                <div key={competency.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="font-medium text-[#334155]">{label}</span>
                    <span className="font-bold text-[#102a43]">{competency.value}%</span>
                  </div>

                  {/* Progress Bar matching UI Navy */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${competency.value}%` }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.15 + index * 0.05,
                      }}
                      className="h-full rounded-full bg-[#334e68]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ---------------------------------------------------
            RIGHT CARD: TEAM PERFORMANCE INDEX (Exact UI match)
        ---------------------------------------------------- */}
        <motion.section
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        >
          <h2 className="text-base font-bold text-[#102a43] mb-6">
            {t(
              "managerPerformanceAnalytics.teamPerformanceIndex",
              "Team Performance Index"
            )}
          </h2>

          {/* Simple, clean rows matching design */}
          <div className="divide-y divide-[#f8fafc]">
            {teamPerformance.map((member) => {
              const memberName = t(`managerTasks.${member.nameKey}`, member.defaultName);

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  {/* Name */}
                  <div className="w-1/3">
                    <p className="text-xs md:text-sm font-semibold text-[#1e293b]">
                      {memberName}
                    </p>
                  </div>

                  {/* Velocity text */}
                  <div className="w-1/3 text-center">
                    <span className="text-xs md:text-sm text-[#64748b]">
                      {member.velocity}% {t("managerPerformanceAnalytics.velocity", "velocity")}
                    </span>
                  </div>

                  {/* Rating text in Green */}
                  <div className="w-1/3 text-right rtl:text-left">
                    <span className="text-xs md:text-sm font-bold text-[#059669]">
                      {member.rating.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default PerformanceAnalytics;
