import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const GOALS = [
  {
    id: "crashFree",
    status: "onTrack",
    progress: 78,
    titleKey: "goalCrashFreeTitle",
    defaultTitle: "Achieve 98% Crash-free Sessions",
    leadKey: "karimAshraf",
    defaultLead: "Karim Ashraf",
    items: [
      { id: "android", labelKey: "itemAndroidCrash", defaultLabel: "Android crash rate below 1.5%", done: true },
      { id: "ios", labelKey: "itemIosCrash", defaultLabel: "iOS crash rate below 1.5%", done: true },
    ],
  },
  {
    id: "apiLatency",
    status: "atRisk",
    progress: 54,
    titleKey: "goalApiLatencyTitle",
    defaultTitle: "Reduce API p95 latency to 200ms",
    leadKey: "youssefLotfy",
    defaultLead: "Youssef Lotfy",
    items: [
      { id: "profile", labelKey: "itemProfileEndpoints", defaultLabel: "Profile top 20 endpoints", done: true },
      { id: "caching", labelKey: "itemShipCaching", defaultLabel: "Ship caching layer", done: false },
    ],
  },
];

// ألوان مطابقة للتصميم بدقة
const STATUS_CONFIG = {
  onTrack: {
    labelKey: "managerGoals.statusOnTrack",
    defaultLabel: "On track",
    badge: "bg-[#ecfdf5] text-[#059669]",
    percent: "text-[#059669]",
    bar: "bg-[#10b981]",
  },
  atRisk: {
    labelKey: "managerGoals.statusAtRisk",
    defaultLabel: "At risk",
    badge: "bg-[#fefce8] text-[#d97706]",
    percent: "text-[#d97706]",
    bar: "bg-[#d97706]",
  },
};

const TeamGoals = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* 1. Breadcrumb + Page Header */}
      <motion.div variants={fadeUp} transition={{ duration: 0.2, ease: "easeOut" }}>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase mb-1.5">
          {t("portal.managerPortal", "MANAGER PORTAL")} / {t("portal.teamGoalsOkrs", "TEAM GOALS & OKRS")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("portal.teamGoalsOkrs", "Team Goals & OKRs")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerDashboard.subtitle",
            "Keep your team aligned, supported, and moving forward."
          )}
        </p>
      </motion.div>

      {/* 2. Goal Cards Grid */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {GOALS.map((goal, index) => {
          const config = STATUS_CONFIG[goal.status];
          const title = t(`managerGoals.${goal.titleKey}`, goal.defaultTitle);
          const leadName = t(`managerTasks.${goal.leadKey}`, goal.defaultLead);

          return (
            <motion.article
              key={goal.id}
              variants={fadeUp}
              transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
              className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div>
                {/* Header: Status Pill + Percentage */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
                  >
                    {t(config.labelKey, config.defaultLabel)}
                  </span>
                  <span dir="ltr" className={`text-sm font-bold ${config.percent}`}>
                    {goal.progress}%
                  </span>
                </div>

                {/* Title + Lead */}
                <h2 className="mt-4 text-base md:text-lg font-bold text-[#102a43]">
                  {title}
                </h2>
                <p className="mt-1 text-xs text-[#64748b]">
                  {t("managerGoals.lead", { name: leadName, defaultValue: `Lead: ${leadName}` })}
                </p>

                {/* Progress Bar */}
                <div
                  role="progressbar"
                  aria-label={title}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={goal.progress}
                  className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]"
                >
                  <motion.div
                    className={`h-full rounded-full ${config.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 + index * 0.05 }}
                  />
                </div>
              </div>

              {/* Key Results Checklist */}
              <ul className="mt-6 space-y-2.5">
                {goal.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs md:text-sm text-[#475569]"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {item.done ? (
                        <FiCheck className="h-4 w-4 text-[#10b981]" aria-hidden="true" />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 rounded-full border-2 border-[#d97706]"
                        />
                      )}
                    </span>
                    <span>{t(`managerGoals.${item.labelKey}`, item.defaultLabel)}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default TeamGoals;