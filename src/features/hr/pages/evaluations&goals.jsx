import { useState } from "react";
import {
  FiPlus,
  FiX,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const EvaluationsGoals = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith("ar");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments = [
    {
      departmentKey: "engineering",
      managerKey: "mariamHassan",
      completed: 18,
      total: 24,
      overdue: 2,
    },
    {
      departmentKey: "peopleCulture",
      managerKey: "sarahAhmed",
      completed: 11,
      total: 14,
      overdue: 0,
    },
    {
      departmentKey: "sales",
      managerKey: "omarKhaled",
      completed: 15,
      total: 22,
      overdue: 4,
    },
    {
      departmentKey: "logistics",
      managerKey: "karimAshraf",
      completed: 13,
      total: 18,
      overdue: 1,
    },
  ];

  const handleSendReminder = (managerName) => {
    toast.success(
      t("hrEvaluationsGoals.reminderSent", {
        manager: managerName,
      }),
    );
  };

  return (
    <motion.div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-w-0 space-y-6 overflow-x-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
            {t("hrEvaluationsGoals.eyebrow")}
          </p>

          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
            {t("hrEvaluationsGoals.title")}
          </h1>

          <p className="mt-1 text-sm font-normal text-[#64748b]">
            {t("hrEvaluationsGoals.subtitle")}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => setIsModalOpen(true)}
          whileHover={{
            y: -2,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.97,
          }}
          transition={{ duration: 0.2 }}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
        >
          <FiPlus className="h-4 w-4" />

          {t("hrEvaluationsGoals.launchReviewCycle")}
        </motion.button>
      </motion.div>

      {/* Active Review Cycle */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.08,
        }}
        className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md sm:p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />

              <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                {t("hrEvaluationsGoals.activeCycle")}
              </span>
            </div>

            <h2 className="text-base font-bold text-[#1e293b] sm:text-lg">
              {t("hrEvaluationsGoals.activeCycleTitle")}
            </h2>

            <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
              {t("hrEvaluationsGoals.activeCycleDate")}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
            <FiTrendingUp className="h-[18px] w-[18px]" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[#64748b]">
              {t("hrEvaluationsGoals.completion")}
            </span>

            <span className="text-sm font-bold text-[#1e293b]">68%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
              className="h-full rounded-full bg-[#10b981]"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <motion.div
            whileHover={{
              y: -3,
              transition: { duration: 0.2 },
            }}
            className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-[#10b981]">
              <FiCheckCircle className="h-4 w-4" />

              <span className="text-xs font-semibold">
                {t("hrEvaluationsGoals.completed")}
              </span>
            </div>

            <p className="text-xl font-bold tracking-tight text-[#0f172a]">
              57
            </p>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
              transition: { duration: 0.2 },
            }}
            className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-[#f97316]">
              <FiClock className="h-4 w-4" />

              <span className="text-xs font-semibold">
                {t("hrEvaluationsGoals.pending")}
              </span>
            </div>

            <p className="text-xl font-bold tracking-tight text-[#0f172a]">
              26
            </p>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
              transition: { duration: 0.2 },
            }}
            className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-[#3b82f6]">
              <FiUsers className="h-4 w-4" />

              <span className="text-xs font-semibold">
                {t("hrEvaluationsGoals.employees")}
              </span>
            </div>

            <p className="text-xl font-bold tracking-tight text-[#0f172a]">4</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Department Manager Review Completion */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.16,
        }}
        className="w-full overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-[#1e293b] sm:text-lg">
              {t("hrEvaluationsGoals.departmentManagerReviewCompletion")}
            </h2>

            <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
              {t("hrEvaluationsGoals.departmentManagerReviewSubtitle")}
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
            <FiUsers className="h-[18px] w-[18px]" />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden w-full lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th
                  className={`px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] sm:text-[11px] ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("hrEvaluationsGoals.department")}
                </th>

                <th
                  className={`px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] sm:text-[11px] ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  {t("hrEvaluationsGoals.manager")}
                </th>

                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] sm:text-[11px]">
                  {t("hrEvaluationsGoals.progress")}
                </th>

                <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] sm:text-[11px]">
                  {t("hrEvaluationsGoals.status")}
                </th>

                <th
                  className={`px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] sm:text-[11px] ${
                    isArabic ? "text-left" : "text-right"
                  }`}
                >
                  {t("hrEvaluationsGoals.sendReminder")}
                </th>
              </tr>
            </thead>

            <tbody>
              {departments.map((item, index) => {
                const completion = Math.round(
                  (item.completed / item.total) * 100,
                );

                const departmentName = t(
                  `hrEvaluationsGoals.${item.departmentKey}`,
                );

                const managerName = t(`hrEvaluationsGoals.${item.managerKey}`);

                return (
                  <motion.tr
                    key={item.departmentKey}
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
                    className="border-t border-[#f1f5f9] transition-colors hover:bg-[#fafbfc]"
                  >
                    <td
                      className={`px-5 py-5 text-sm font-bold text-[#1e293b] ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      {departmentName}
                    </td>

                    <td
                      className={`px-4 py-5 text-sm text-[#64748b] ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      {managerName}
                    </td>

                    <td className="px-4 py-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-[#e2e8f0] xl:block">
                          <div
                            className="h-full rounded-full bg-[#3b82f6]"
                            style={{
                              width: `${completion}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm font-bold text-[#1e293b]">
                          {completion}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5 text-center">
                      {item.overdue > 0 ? (
                        <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#fef2f2] px-2.5 py-1.5 text-[10px] font-bold text-[#dc2626] sm:text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                          {item.overdue} {t("hrEvaluationsGoals.overdue")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1.5 text-[10px] font-bold text-[#15803d] sm:text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />

                          {t("hrEvaluationsGoals.onTrack")}
                        </span>
                      )}
                    </td>

                    <td
                      className={`px-4 py-5 ${
                        isArabic ? "text-left" : "text-right"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSendReminder(managerName)}
                        className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#475569] transition hover:border-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#243B53] active:scale-[0.97]"
                      >
                        {t("hrEvaluationsGoals.sendReminder")}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-[#f1f5f9] lg:hidden">
          {departments.map((item, index) => {
            const completion = Math.round((item.completed / item.total) * 100);

            const departmentName = t(
              `hrEvaluationsGoals.${item.departmentKey}`,
            );

            const managerName = t(`hrEvaluationsGoals.${item.managerKey}`);

            return (
              <motion.div
                key={item.departmentKey}
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
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-[#1e293b] sm:text-base">
                      {departmentName}
                    </h3>

                    <p className="mt-1 truncate text-xs text-[#64748b] sm:text-sm">
                      {managerName}
                    </p>
                  </div>

                  {item.overdue > 0 ? (
                    <span className="shrink-0 rounded-full bg-[#fef2f2] px-2.5 py-1.5 text-[10px] font-bold text-[#dc2626]">
                      {item.overdue} {t("hrEvaluationsGoals.overdue")}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-[#ecfdf5] px-2.5 py-1.5 text-[10px] font-bold text-[#15803d]">
                      {t("hrEvaluationsGoals.onTrack")}
                    </span>
                  )}
                </div>

                <div className="mt-5 rounded-xl bg-[#f8fafc] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      {t("hrEvaluationsGoals.progress")}
                    </span>

                    <span className="text-sm font-bold text-[#1e293b]">
                      {completion}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                    <div
                      className="h-full rounded-full bg-[#3b82f6] transition-all duration-700"
                      style={{
                        width: `${completion}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendReminder(managerName)}
                  className="mt-4 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#475569] transition hover:bg-[#f8fafc] active:scale-[0.98]"
                >
                  {t("hrEvaluationsGoals.sendReminder")}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-xl"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between border-b border-[#f1f5f9] px-6 py-5">
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
                    <FiPlus className="h-[18px] w-[18px]" />
                  </div>

                  <h2 className="text-base font-bold text-[#1e293b]">
                    {t("hrEvaluationsGoals.createWorkflowRecord")}
                  </h2>

                  <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                    {t("hrEvaluationsGoals.departmentManagerReviewSubtitle")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
                  aria-label={isArabic ? "إغلاق" : "Close"}
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#475569]">
                      {t("hrEvaluationsGoals.details")}
                    </label>

                    <input
                      type="text"
                      className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#475569]">
                      {t("hrEvaluationsGoals.owner")}
                    </label>

                    <input
                      type="text"
                      className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#64748b] transition hover:bg-[#f8fafc] active:scale-[0.98] sm:text-sm"
                  >
                    {t("hrEvaluationsGoals.cancel")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);

                      toast.success(t("hrEvaluationsGoals.saveChanges"));
                    }}
                    className="flex-1 rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42] active:scale-[0.98] sm:text-sm"
                  >
                    {t("hrEvaluationsGoals.saveChanges")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EvaluationsGoals;
