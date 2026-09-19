import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiSearch, FiFilter, FiCalendar, FiClock,
  FiCheckCircle, FiCircle, FiAlertCircle, FiChevronRight,
  FiTag, FiX, FiMoreVertical, FiTrendingUp,
  FiList, FiGrid,
} from "react-icons/fi";
import { MdOutlineTask } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

// ── Mock task data ──────────────────────────────────────────
const INITIAL_TASKS = [
  {
    id: "t-1",
    titleKey: "dummyTasks.t1.title", title: "Complete Q3 Self-Evaluation Form",
    descKey: "dummyTasks.t1.desc", desc: "Fill out all sections of the quarterly self-review before the Sep 25 deadline.",
    status: "todo", priority: "high", categoryKey: "dummyTasks.categories.HR", category: "HR", dueDate: "2026-09-25", progress: 0, tags: ["evaluation", "quarterly"],
  },
  {
    id: "t-2",
    titleKey: "dummyTasks.t2.title", title: "Submit Attendance Report for August",
    descKey: "dummyTasks.t2.desc", desc: "Compile and submit the finalized attendance log for last month.",
    status: "in-progress", priority: "medium", categoryKey: "dummyTasks.categories.Admin", category: "Admin", dueDate: "2026-09-20", progress: 60, tags: ["attendance", "report"],
  },
  {
    id: "t-3",
    titleKey: "dummyTasks.t3.title", title: "Review Company Policy Updates",
    descKey: "dummyTasks.t3.desc", desc: "Read and acknowledge the updated workplace conduct and remote-work policies.",
    status: "in-progress", priority: "low", categoryKey: "dummyTasks.categories.Compliance", category: "Compliance", dueDate: "2026-09-22", progress: 35, tags: ["policy", "compliance"],
  },
  {
    id: "t-4",
    titleKey: "dummyTasks.t4.title", title: "Team Sync Meeting Prep Notes",
    descKey: "dummyTasks.t4.desc", desc: "Prepare agenda and talking points for the weekly team sync.",
    status: "done", priority: "medium", categoryKey: "dummyTasks.categories.Meetings", category: "Meetings", dueDate: "2026-09-18", progress: 100, tags: ["meeting", "team"],
  },
  {
    id: "t-5",
    titleKey: "dummyTasks.t5.title", title: "Update Emergency Contact Info",
    descKey: "dummyTasks.t5.desc", desc: "Log in to the HR portal and update personal emergency contact information.",
    status: "todo", priority: "low", categoryKey: "dummyTasks.categories.Personal", category: "Personal", dueDate: "2026-09-30", progress: 0, tags: ["personal", "hr"],
  },
  {
    id: "t-6",
    titleKey: "dummyTasks.t6.title", title: "Complete Cybersecurity Training Module",
    descKey: "dummyTasks.t6.desc", desc: "Finish the mandatory annual cybersecurity awareness course on the learning portal.",
    status: "done", priority: "high", categoryKey: "dummyTasks.categories.Training", category: "Training", dueDate: "2026-09-15", progress: 100, tags: ["training", "security"],
  },
];

const COLUMNS = ["todo", "in-progress", "done"];

function isOverdue(dueDate, status) {
  if (status === "done") return false;
  return new Date(dueDate) < new Date();
}

function formatDate(dateStr, locale) {
  return new Date(dateStr).toLocaleDateString(locale, { month: "short", day: "numeric" });
}

// ── Task Card ───────────────────────────────────────────────
function TaskCard({ task, onStatusChange, onDelete, t, i18n, PRIORITY_META, STATUS_META }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pm = PRIORITY_META[task.priority];
  const sm = STATUS_META[task.status];
  const overdue = isOverdue(task.dueDate, task.status);
  const isRtl = i18n.language?.startsWith("ar");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 cursor-default"
    >
      <span className={`absolute ${isRtl ? "right-0" : "left-0"} top-4 bottom-4 w-0.5 rounded-full ${pm.dot}`} />

      <div className="flex items-start justify-between gap-2 mb-2 px-1.5">
        <h3 className={`text-[13px] font-semibold leading-snug flex-1 ${task.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>
          {task.titleKey ? t(task.titleKey) : task.title}
        </h3>
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
          >
            <FiMoreVertical className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                className={`absolute ${isRtl ? "left-0" : "right-0"} top-6 z-10 bg-white border border-slate-100 rounded-xl shadow-xl py-1 min-w-[140px]`}
              >
                {COLUMNS.filter((c) => c !== task.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(task.id, s); setMenuOpen(false); }}
                    className="w-full text-start px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FiChevronRight className={`w-3 h-3 text-slate-400 ${isRtl ? "rotate-180" : ""}`} />
                    {t("tasks.moveTo")} {STATUS_META[s].label}
                  </button>
                ))}
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                  className="w-full text-start px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiX className="w-3 h-3" /> {t("tasks.delete")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 px-1.5 mb-3">
        {task.descKey ? t(task.descKey) : task.desc}
      </p>

      {task.status === "in-progress" && (
        <div className="px-1.5 mb-3">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>{t("tasks.progress")}</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all ${isRtl ? "float-right" : ""}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 px-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pm.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pm.dot}`} />
            {pm.label}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
            <FiTag className="w-2.5 h-2.5" />
            {task.categoryKey ? t(task.categoryKey) : task.category}
          </span>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-medium ${overdue ? "text-red-400" : "text-slate-400"}`}>
          <FiCalendar className="w-2.5 h-2.5" />
          {overdue ? t("tasks.overdue") : ""} {formatDate(task.dueDate, i18n.language)}
        </span>
      </div>
    </motion.div>
  );
}

// ── Add Task Modal ──────────────────────────────────────────
function AddTaskModal({ onClose, onAdd, t }) {
  const [form, setForm] = useState({
    title: "", desc: "", priority: "medium",
    category: "General", dueDate: "", status: "todo",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({ ...form, id: `t-${Date.now()}`, progress: 0, tags: [] });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800">{t("tasks.addNewTask")}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t("tasks.taskTitle")} *</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#243b53] focus:ring-2 focus:ring-[#243b53]/10 transition"
              placeholder={t("tasks.enterTaskTitle")}
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t("tasks.description")}</label>
            <textarea
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#243b53] focus:ring-2 focus:ring-[#243b53]/10 transition resize-none"
              placeholder={t("tasks.optionalDesc")}
              value={form.desc}
              onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{t("tasks.priority")}</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#243b53] transition bg-white"
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              >
                <option value="high">{t("tasks.high")}</option>
                <option value="medium">{t("tasks.medium")}</option>
                <option value="low">{t("tasks.low")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{t("tasks.category")}</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#243b53] transition bg-white"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                {["General", "HR", "Admin", "Compliance", "Meetings", "Training", "Personal"].map((c) => (
                  <option key={c} value={c}>{t(`dummyTasks.categories.${c}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{t("tasks.dueDate")}</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#243b53] transition"
                value={form.dueDate}
                onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{t("tasks.status")}</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#243b53] transition bg-white"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="todo">{t("tasks.todo")}</option>
                <option value="in-progress">{t("tasks.inProgress")}</option>
                <option value="done">{t("tasks.done")}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              {t("tasks.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#243b53] hover:bg-[#334e68] text-white rounded-xl py-2.5 text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              {t("tasks.addTask")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function Tasks() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const isRtl = i18n.language?.startsWith("ar");

  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("kanban");

  const firstName = currentUser?.name?.split(" ")[0] || "there";

  const PRIORITY_META = {
    high:   { label: t("tasks.high"),   cls: "bg-red-50 text-red-500 border-red-200",       dot: "bg-red-400"    },
    medium: { label: t("tasks.medium"), cls: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-400"  },
    low:    { label: t("tasks.low"),    cls: "bg-green-50 text-green-600 border-green-200",  dot: "bg-green-400"  },
  };
  
  const STATUS_META = {
    "todo":        { label: t("tasks.todo"),       icon: FiCircle,      col: "bg-slate-100 text-slate-500" },
    "in-progress": { label: t("tasks.inProgress"), icon: FiAlertCircle, col: "bg-blue-100 text-blue-600"   },
    "done":        { label: t("tasks.done"),        icon: FiCheckCircle, col: "bg-green-100 text-green-600"  },
  };

  const stats = useMemo(() => ({
    total:      tasks.length,
    todo:       tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done:       tasks.filter((t) => t.status === "done").length,
    overdue:    tasks.filter((t) => isOverdue(t.dueDate, t.status)).length,
    completion: tasks.length ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) : 0,
  }), [tasks]);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = !search.trim() ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.category.toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === "all" || task.priority === filterPriority;
      return matchSearch && matchPriority;
    });
  }, [tasks, search, filterPriority]);

  const tasksByStatus = (status) => filtered.filter((t) => t.status === status);

  const handleStatusChange = (id, newStatus) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus, progress: newStatus === "done" ? 100 : t.progress } : t));
    toast.success(`${t("tasks.taskMoved")} ${STATUS_META[newStatus].label}`);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success(t("tasks.taskDeleted"));
  };

  const handleAdd = (task) => {
    setTasks((prev) => [task, ...prev]);
    toast.success(t("tasks.taskAdded"));
  };

  return (
    <div className="min-h-screen">

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium">
          <span>{t("tasks.employeePortal")}</span>
          <FiChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-[#243b53] font-semibold">{t("tasks.myTasks")}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-slate-800 tracking-tight">
              {t("tasks.myTasks")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("tasks.greeting", { name: firstName }).replace("{{name}}", firstName)}{" "}
              <span className="font-semibold text-[#243b53]">{t("tasks.inProgressCount", { count: stats.inProgress }).replace("{{count}}", stats.inProgress)}</span>{" "}
              {t("tasks.and")} <span className="font-semibold text-amber-500">{t("tasks.todoCount", { count: stats.todo }).replace("{{count}}", stats.todo)}</span>.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-[#243b53] hover:bg-[#334e68] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            {t("tasks.addTask")}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t("tasks.total"),       value: stats.total,      icon: MdOutlineTask, color: "text-slate-600", bg: "bg-slate-100" },
          { label: t("tasks.inProgress"), value: stats.inProgress, icon: FiClock,       color: "text-blue-600",  bg: "bg-blue-50"   },
          { label: t("tasks.completed"),   value: stats.done,       icon: FiCheckCircle, color: "text-green-600", bg: "bg-green-50"  },
          { label: t("tasks.overdue"),     value: stats.overdue,    icon: FiAlertCircle, color: "text-red-500",   bg: "bg-red-50"    },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{value}</p>
              <p className="text-[11px] text-slate-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span className="flex items-center gap-1.5">
              <FiTrendingUp className="w-3.5 h-3.5 text-green-500" /> {t("tasks.overallCompletion")}
            </span>
            <span className="text-[#243b53]">{stats.completion}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r from-[#243b53] to-[#486581] rounded-full ${isRtl ? "float-right" : ""}`}
              initial={{ width: 0 }}
              animate={{ width: `${stats.completion}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="text-end shrink-0">
          <p className="text-xl font-bold text-slate-800">{stats.done}<span className="text-slate-300">/{stats.total}</span></p>
          <p className="text-[11px] text-slate-400">{t("tasks.tasksDone")}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input
            className={`w-full bg-white border border-slate-200 rounded-xl ${isRtl ? "pr-9 pl-4" : "pl-9 pr-4"} py-2.5 text-sm text-slate-700 outline-none focus:border-[#243b53] focus:ring-2 focus:ring-[#243b53]/10 transition placeholder:text-slate-400`}
            placeholder={t("tasks.searchTasks")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 overflow-x-auto whitespace-nowrap">
          <FiFilter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {["all", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition capitalize ${filterPriority === p
                ? "bg-[#243b53] text-white"
                : "text-slate-500 hover:bg-slate-100"
                }`}
            >
              {p === "all" ? t("tasks.all") : PRIORITY_META[p].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setViewMode("kanban")}
            className={`p-1.5 rounded-lg transition ${viewMode === "kanban" ? "bg-[#243b53] text-white" : "text-slate-400 hover:bg-slate-100"}`}
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition ${viewMode === "list" ? "bg-[#243b53] text-white" : "text-slate-400 hover:bg-slate-100"}`}
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((status) => {
            const sm = STATUS_META[status];
            const StatusIcon = sm.icon;
            const colTasks = tasksByStatus(status);
            return (
              <div key={status} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${status === "todo" ? "text-slate-400" : status === "in-progress" ? "text-blue-500" : "text-green-500"}`} />
                    <span className="text-sm font-bold text-slate-700">{sm.label}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${sm.col}`}>
                    {colTasks.length}
                  </span>
                </div>

                <AnimatePresence mode="popLayout">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-300 text-xs border-2 border-dashed border-slate-100 rounded-2xl">
                      {t("tasks.noTasksHere")}
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        t={t}
                        i18n={i18n}
                        PRIORITY_META={PRIORITY_META}
                        STATUS_META={STATUS_META}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-slate-100 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <span>{t("tasks.title")}</span>
            <span>{t("tasks.priority")}</span>
            <span>{t("tasks.category")}</span>
            <span>{t("tasks.dueDate")}</span>
            <span>{t("tasks.status")}</span>
          </div>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">{t("tasks.noTasksFound")}</div>
            ) : (
              filtered.map((task, i) => {
                const pm = PRIORITY_META[task.priority];
                const sm = STATUS_META[task.status];
                const StatusIcon = sm.icon;
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-slate-50 transition`}
                  >
                    <div>
                      <p className={`text-[13px] font-semibold ${task.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>
                        {task.titleKey ? t(task.titleKey) : task.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {task.descKey ? t(task.descKey) : task.desc}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pm.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pm.dot}`} />{pm.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {task.categoryKey ? t(task.categoryKey) : task.category}
                    </span>
                    <span className={`text-[11px] font-medium flex items-center gap-1 ${overdue ? "text-red-400" : "text-slate-400"}`}>
                      <FiCalendar className="w-2.5 h-2.5" />
                      {formatDate(task.dueDate, i18n.language)}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sm.col}`}>
                      <StatusIcon className="w-3 h-3" />{sm.label}
                    </span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddTaskModal onClose={() => setShowModal(false)} onAdd={handleAdd} t={t} />
        )}
      </AnimatePresence>
    </div>
  );
}
