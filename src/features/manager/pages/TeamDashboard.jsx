import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// TODO: make sure these match the paths registered in your Manager routes.
const MANAGER_ROUTES = {
  taskManagement: "/manager/tasks",
  submissionReviews: "/manager/submissions",
};

// Employees flagged by the AI workload alert (keys match `managerTasks.*` member names)
const OVERLOADED_ASSIGNEES = ["youssefLotfy", "karimAshraf"];

const PENDING_QUEUE = [
  { id: "oauth2Flow", nameKey: "oauth2FlowName", assigneeKey: "youssefLotfy" },
  { id: "releaseNotes", nameKey: "releaseNotesName", assigneeKey: "salmaNabil" },
  { id: "paymentTests", nameKey: "paymentTestsName", assigneeKey: "karimAshraf" },
];

const TeamDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRebalanceTasks = () =>
    navigate(MANAGER_ROUTES.taskManagement, {
      state: { assigneeFilter: OVERLOADED_ASSIGNEES },
    });

  const handleReview = (queueId) =>
    navigate(MANAGER_ROUTES.submissionReviews, {
      state: { submissionQueueId: queueId },
    });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} transition={{ duration: 0.25, ease: "easeOut" }}>
        {/* Breadcrumb — was missing before, matches the UI design */}
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("managerDashboard.breadcrumb", "Manager Portal / Team Dashboard")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("managerDashboard.title", "Team Dashboard")}
        </h1>
        <p className="text-sm text-[#64748b] mt-1 font-normal">
          {t(
            "managerDashboard.subtitle",
            "Keep your team aligned, supported, and moving forward.",
          )}
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <p className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
            {t("managerDashboard.directReports", "Direct Reports")}
          </p>
          <p className="text-[27px] font-bold text-[#0f172a] mt-2 tracking-tight">8</p>
          <p className="text-xs text-[#64748b] mt-1">
            {t("managerDashboard.directReportsNote", "+1 since last month")}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <p className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
            {t("managerDashboard.activeTasks", "Active Tasks")}
          </p>
          <p className="text-[27px] font-bold text-[#0f172a] mt-2 tracking-tight">14</p>
          <p className="text-xs text-[#64748b] mt-1">
            {t("managerDashboard.activeTasksNote", "Across 8 team members")}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <p className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
            {t("managerDashboard.pendingSubmissions", "Pending Submissions")}
          </p>
          <p className="text-[27px] font-bold text-[#0f172a] mt-2 tracking-tight">3</p>
          <p className="text-xs text-[#64748b] mt-1">
            {t("managerDashboard.pendingSubmissionsNote", "Require your review")}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <p className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
            {t("managerDashboard.attendanceToday", "Attendance Today")}
          </p>
          <p className="text-[27px] font-bold text-[#0f172a] mt-2 tracking-tight">7/8</p>
          <p className="text-xs text-[#64748b] mt-1">
            {t("managerDashboard.attendanceTodayNote", "One late check-in")}
          </p>
        </motion.div>
      </motion.div>

      {/* AI Alert + Pending Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Workload Alert */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] border-l-4 rtl:border-l border-l-[#ef4444] rtl:border-r-4 rtl:border-r-[#ef4444] relative"
        >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#dc2626] uppercase">
            {t("managerDashboard.aiWorkloadAlert", "AI Workload Alert")}
          </p>
          <h2 className="text-lg font-bold text-[#1e293b] mt-1.5">
            {t("managerDashboard.sprintOverloadTitle", "Sprint overload detected")}
          </h2>
          <p className="text-sm text-[#64748b] mt-2 leading-relaxed max-w-md">
            {t(
              "managerDashboard.sprintOverloadDesc",
              "Youssef and Karim are carrying 68% of the sprint workload. Rebalancing two tasks will reduce delivery risk.",
            )}
          </p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626]">
          <FiAlertCircle className="w-4 h-4" />
        </div>
      </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleRebalanceTasks}
            className="mt-5 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c2f42] transition"
          >
            {t("managerDashboard.rebalanceTasks", "Rebalance Tasks")}
          </motion.button>
        </motion.div>

        {/* Pending Action Queue */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <h2 className="text-base font-bold text-[#1e293b] mb-2">
            {t("managerDashboard.pendingActionQueue", "Pending action queue")}
          </h2>

          <motion.div variants={staggerContainer} className="divide-y divide-[#f1f5f9]">
            {PENDING_QUEUE.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-between py-3.5 first:pt-3 last:pb-0"
              >
            <div>
              <p className="text-sm font-semibold text-[#1e293b]">
                {t(`managerDashboard.${item.nameKey}`)}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">
                {t(`managerDashboard.${item.assigneeKey}`)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleReview(item.id)}
              className="text-sm font-semibold text-[#2f6f4d] hover:text-[#23583c] transition shrink-0"
            >
              {t("managerDashboard.review", "Review")}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeamDashboard;