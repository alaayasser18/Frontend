import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiSearch, FiPlus, FiMoreHorizontal, FiX } from "react-icons/fi";

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

const tableStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const TEAM_MEMBERS = [
  { id: "youssefLotfy", nameKey: "youssefLotfy" },
  { id: "karimAshraf", nameKey: "karimAshraf" },
  { id: "salmaNabil", nameKey: "salmaNabil" },
  { id: "omarFathy", nameKey: "omarFathy" },
];

const TASKS_SEED = [
  {
    id: 1,
    nameKey: "taskOauth2FlowName",
    assigneeKey: "youssefLotfy",
    dueDateKey: "dueDateSep18",
    priority: "urgent",
    progress: 72,
    status: "inProgress",
  },
  {
    id: 2,
    nameKey: "taskBillingHooksName",
    assigneeKey: "karimAshraf",
    dueDateKey: "dueDateSep20",
    priority: "high",
    progress: 48,
    status: "inProgress",
  },
  {
    id: 3,
    nameKey: "taskQaMobileReleaseName",
    assigneeKey: "salmaNabil",
    dueDateKey: "dueDateSep22",
    priority: "normal",
    progress: 91,
    status: "reviewPending",
  },
  {
    id: 4,
    nameKey: "taskUpdateApiDocsName",
    assigneeKey: "omarFathy",
    dueDateKey: "dueDateSep25",
    priority: "normal",
    progress: 35,
    status: "inProgress",
  },
];

// ألوان متطابقة مع درجات الـ UI بالصورة الأولى
const PRIORITY_STYLES = {
  urgent: "bg-[#fef2f2] text-[#ef4444]",
  high: "bg-[#fefce8] text-[#eab308]",
  normal: "bg-[#eff6ff] text-[#3b82f6]",
};

const PRIORITY_LABEL_KEYS = {
  urgent: "priorityUrgent",
  high: "priorityHigh",
  normal: "priorityNormal",
};

const FILTERS = [
  { id: "all", labelKey: "filterAll" },
  { id: "inProgress", labelKey: "filterInProgress" },
  { id: "reviewPending", labelKey: "filterReviewPending" },
  { id: "completed", labelKey: "filterCompleted" },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const MENU_WIDTH_CLASS = "w-56";
const MENU_ITEM_HEIGHT = 40;
const MENU_HEADER_HEIGHT = 44;

const TaskManagement = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(TASKS_SEED);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [assigneeFilter, setAssigneeFilter] = useState(
    () => location.state?.assigneeFilter ?? null,
  );

  const [reassignMenu, setReassignMenu] = useState(null);
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [assignTo, setAssignTo] = useState(TEAM_MEMBERS[0].id);
  const [taskDetails, setTaskDetails] = useState("");

  useEffect(() => {
    if (location.state?.assigneeFilter) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  useEffect(() => {
    if (!reassignMenu) return undefined;
    const close = () => setReassignMenu(null);
    const onMouseDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest?.("[data-reassign-trigger]")) return;
      close();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [reassignMenu]);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = activeFilter === "all" || task.status === activeFilter;
    const matchesAssignee = !assigneeFilter || assigneeFilter.includes(task.assigneeKey);
    const name = t(`managerTasks.${task.nameKey}`, task.nameKey);
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesAssignee && matchesSearch;
  });

  const assigneeFilterLabel = (() => {
    if (!assigneeFilter) return "";
    const names = assigneeFilter.map((key) => t(`managerTasks.${key}`));
    try {
      return new Intl.ListFormat(i18n.language, { style: "long", type: "conjunction" }).format(names);
    } catch {
      return names.join(", ");
    }
  })();

  const resetForm = () => {
    setTaskName("");
    setAssignTo(TEAM_MEMBERS[0].id);
    setTaskDetails("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleCreateTask = () => {
    const assigneeMember = TEAM_MEMBERS.find((m) => m.id === assignTo);
    const newTask = {
      id: tasks.length + 1,
      customName: taskName,
      assigneeKey: assigneeMember?.nameKey,
      dueDateKey: null,
      priority: "normal",
      progress: 0,
      status: "inProgress",
    };
    setTasks((prev) => [...prev, newTask]);
    handleCloseModal();
  };

  const showToast = (message) => {
    toast.custom(
      (toastItem) => (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={
            toastItem.visible
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 12, scale: 0.96 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-[#102a43] text-white text-sm font-semibold px-4 py-3 rounded-lg shadow-lg"
        >
          {message}
        </motion.div>
      ),
      { position: "bottom-right" },
    );
  };

  const openReassignMenu = (e, task) => {
    if (reassignMenu?.taskId === task.id) {
      setReassignMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const isRtl = i18n.dir() === "rtl";
    const menuHeight = MENU_HEADER_HEIGHT + (TEAM_MEMBERS.length - 1) * MENU_ITEM_HEIGHT;
    const opensDown = rect.bottom + 6 + menuHeight <= window.innerHeight;
    const top = opensDown ? rect.bottom + 6 : Math.max(8, rect.top - 6 - menuHeight);
    setReassignMenu({
      taskId: task.id,
      top,
      ...(isRtl
        ? { left: Math.max(8, rect.left) }
        : { right: Math.max(8, window.innerWidth - rect.right) }),
    });
  };

  const handleReassign = (taskId, memberId) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, assigneeKey: memberId } : task)),
    );
    setReassignMenu(null);
    showToast(
      t("managerTasks.toastReassigned", { name: t(`managerTasks.${memberId}`) }),
    );
  };

  const menuTask = reassignMenu ? tasks.find((task) => task.id === reassignMenu.taskId) : null;

  return (
    <div className="w-full space-y-6 pb-12 font-sans">
      {/* 1. Breadcrumb + Header */}
      <div>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("managerTasks.breadcrumb", "MANAGER PORTAL / TASK MANAGEMENT")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("managerTasks.title", "Task Management")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerTasks.subtitle",
            "Keep your team aligned, supported, and moving forward.",
          )}
        </p>
      </div>

      {/* 2. Search + Assign Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-3.5 rtl:left-auto rtl:right-3.5 flex items-center pointer-events-none text-[#9fb3c8]">
            <FiSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("managerTasks.searchPlaceholder", "Search tasks...")}
            className="w-full rounded-xl border border-[#d9e2ec] bg-white py-2.5 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm text-[#102a43] placeholder:text-[#9fb3c8] focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#102a43] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f3a56] transition shrink-0 shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          {t("managerTasks.assignNewTask", "Assign New Task")}
        </button>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {FILTERS.map((filter) => (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeFilter === filter.id
                ? "bg-[#102a43] text-white"
                : "bg-white border border-[#d9e2ec] text-[#627d98] hover:bg-[#f8fafc]"
            }`}
          >
            {t(`managerTasks.${filter.labelKey}`)}
          </motion.button>
        ))}

        {assigneeFilter && (
          <motion.button
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setAssigneeFilter(null)}
            className="inline-flex items-center gap-2 rounded-full border border-[#102a43] bg-white px-4 py-2 text-sm font-semibold text-[#102a43] transition hover:bg-[#f8fafc]"
          >
            {t("managerTasks.filteredBy", { names: assigneeFilterLabel })}
            <FiX className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* 4. Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#f8fafc]/60 border-b border-[#f1f5f9] text-[11px] font-bold tracking-wider text-[#94a3b8]">
                <th className="py-4 px-6">{t("managerTasks.colTaskName", "TASK NAME")}</th>
                <th className="py-4 px-6">{t("managerTasks.colAssignee", "ASSIGNEE")}</th>
                <th className="py-4 px-6">{t("managerTasks.colDueDate", "DUE DATE")}</th>
                <th className="py-4 px-6">{t("managerTasks.colPriority", "PRIORITY")}</th>
                <th className="py-4 px-6">{t("managerTasks.colProgress", "PROGRESS")}</th>
                <th className="py-4 px-6 w-12 text-center"></th>
              </tr>
            </thead>
            <motion.tbody
              key={activeFilter + searchQuery + (assigneeFilter ? assigneeFilter.join(",") : "")}
              initial="hidden"
              animate="visible"
              variants={tableStagger}
              className="divide-y divide-[#f1f5f9]"
            >
              {filteredTasks.map((task) => {
                const taskDisplayName = task.customName || t(`managerTasks.${task.nameKey}`);
                const assigneeName = task.assigneeKey
                  ? t(`managerTasks.${task.assigneeKey}`)
                  : "";
                const dueDate = task.dueDateKey
                  ? t(`managerTasks.${task.dueDateKey}`)
                  : t("managerTasks.noDueDate", "-");

                return (
                  <motion.tr
                    key={task.id}
                    variants={rowVariants}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="hover:bg-[#f8fafc]/40 transition"
                  >
                    {/* Task Name */}
                    <td className="py-5 px-6">
                      <p className="text-sm font-semibold text-[#1e293b]">{taskDisplayName}</p>
                    </td>

                    {/* Assignee */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex size-7 items-center justify-center rounded-full bg-[#e0e7ff] text-[11px] font-bold text-[#4338ca]">
                          {getInitials(assigneeName)}
                        </div>
                        <span className="text-sm font-medium text-[#334155]">{assigneeName}</span>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-5 px-6 text-sm text-[#64748b]">{dueDate}</td>

                    {/* Priority */}
                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_STYLES[task.priority]}`}
                      >
                        {t(`managerTasks.${PRIORITY_LABEL_KEYS[task.priority]}`)}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#10b981]"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#475569] w-8 shrink-0">
                          {task.progress}%
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-5 px-6 text-center">
                      <button
                        type="button"
                        data-reassign-trigger
                        onClick={(e) => openReassignMenu(e, task)}
                        aria-haspopup="menu"
                        aria-expanded={reassignMenu?.taskId === task.id}
                        className="text-[#94a3b8] hover:text-[#1e293b] transition p-1"
                        aria-label={t("managerTasks.reassignTask")}
                      >
                        <FiMoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Reassign Menu Portal */}
      {createPortal(
        <AnimatePresence>
          {reassignMenu && menuTask && (
            <motion.div
              key={reassignMenu.taskId}
              ref={menuRef}
              role="menu"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: reassignMenu.top,
                left: reassignMenu.left,
                right: reassignMenu.right,
              }}
              className={`z-[60] ${MENU_WIDTH_CLASS} rounded-xl border border-[#e2e8f0] bg-white py-1.5 shadow-lg`}
            >
              <p className="px-3.5 pb-1.5 pt-1 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                {t("managerTasks.reassignTo")}
              </p>
              {TEAM_MEMBERS.filter((member) => member.id !== menuTask.assigneeKey).map((member) => (
                <button
                  key={member.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleReassign(menuTask.id, member.id)}
                  className="block w-full px-3.5 py-2.5 text-left rtl:text-right text-sm text-[#334155] transition hover:bg-[#f8fafc]"
                >
                  {t(`managerTasks.${member.nameKey}`)}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Assign New Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#102a43]">
                  {t("managerTasks.assignNewTask", "Assign New Task")}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-[#94a3b8] hover:text-[#102a43] transition"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder={t("managerTasks.taskNamePlaceholder", "Task name")}
                    className="w-full rounded-xl border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#102a43] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  />
                </div>

                <div>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full rounded-xl border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#102a43] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  >
                    {TEAM_MEMBERS.map((member) => (
                      <option key={member.id} value={member.id}>
                        {t("managerTasks.assignToOption", {
                          name: t(`managerTasks.${member.nameKey}`),
                          defaultValue: `Assign to ${t(`managerTasks.${member.nameKey}`)}`,
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <textarea
                    value={taskDetails}
                    onChange={(e) => setTaskDetails(e.target.value)}
                    placeholder={t("managerTasks.taskDetailsPlaceholder", "Task details")}
                    rows={3}
                    className="w-full rounded-xl border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#102a43] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#486581]/30 resize-none"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCreateTask}
                className="mt-6 w-full rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1f3a56] transition shadow-sm"
              >
                {t("managerTasks.createTask", "Create Task")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManagement;