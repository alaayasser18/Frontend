import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiCalendar,
  FiUploadCloud,
  FiClock,
  FiMoreHorizontal,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

const INITIAL_TASKS = [
  {
    id: "task-1",
    titleKey: "tasks.employeeTasks.t1Title",
    defaultTitle: "Q2 Operations efficiency report",
    priority: "high",
    dueDateKey: "tasks.employeeTasks.t1Date",
    defaultDueDate: "Due Jun 12, 2026",
    status: "in-progress",
    progress: 70,
    progressColor: "bg-[#2f855a]",
    stripeColor: "bg-[#e05252]",
    priorityBadge: "bg-[#fff5f5] text-[#e05252]",
  },
  {
    id: "task-2",
    titleKey: "tasks.employeeTasks.t2Title",
    defaultTitle: "Vendor onboarding checklist revamp",
    priority: "medium",
    dueDateKey: "tasks.employeeTasks.t2Date",
    defaultDueDate: "Due Jun 15, 2026",
    status: "under-review",
    progress: 100,
    progressColor: "bg-[#3182ce]",
    stripeColor: "bg-[#d97706]",
    priorityBadge: "bg-[#fffaf0] text-[#d97706]",
  },
  {
    id: "task-3",
    titleKey: "tasks.employeeTasks.t3Title",
    defaultTitle: "Customer insights synthesis",
    priority: "low",
    dueDateKey: "tasks.employeeTasks.t3Date",
    defaultDueDate: "Due Jun 18, 2026",
    status: "in-progress",
    progress: 35,
    progressColor: "bg-[#2f855a]",
    stripeColor: "bg-[#38b2ac]",
    priorityBadge: "bg-[#f0fdfa] text-[#0d9488]",
  },
];

const FILTERS = [
  { id: "all", labelKey: "tasks.filters.all", defaultLabel: "All" },
  { id: "in-progress", labelKey: "tasks.filters.inProgress", defaultLabel: "In Progress" },
  { id: "under-review", labelKey: "tasks.filters.underReview", defaultLabel: "Under Review" },
  { id: "completed", labelKey: "tasks.filters.completed", defaultLabel: "Completed" },
];

const Tasks = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState("all");

  // Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskUpdate, setShowTaskUpdate] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [progressVal, setProgressVal] = useState(70);

  // Status counts
  const stats = useMemo(() => {
    return {
      all: tasks.length,
      "in-progress": tasks.filter((t) => t.status === "in-progress").length,
      "under-review": tasks.filter((t) => t.status === "under-review").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter((t) => t.status === activeFilter);
  }, [tasks, activeFilter]);

  const handleOpenTaskUpdate = (task) => {
    setSelectedTask(task);
    setProgressVal(task.progress);
    setUploadedFile(null);
    setNotes("");
    setShowTaskUpdate(true);
  };

  const handleCloseTaskUpdate = () => {
    setShowTaskUpdate(false);
    setSelectedTask(null);
    setUploadedFile(null);
    setNotes("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleSubmitForReview = () => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              status: "under-review",
              progress: 100,
              progressColor: "bg-[#3182ce]",
            }
          : t
      )
    );
    handleCloseTaskUpdate();
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return t("tasks.priority.high", "High priority");
      case "medium":
        return t("tasks.priority.medium", "Medium priority");
      case "low":
      default:
        return t("tasks.priority.low", "Low priority");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in-progress":
        return t("tasks.status.inProgress", "In Progress");
      case "under-review":
        return t("tasks.status.underReview", "Under Review");
      case "completed":
        return t("tasks.status.completed", "Completed");
      default:
        return status;
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="w-full space-y-6 pb-16 font-sans text-[#102a43]">
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold tracking-wider text-[#2f855a] uppercase mb-1">
            {t("tasks.workManagement", "WORK MANAGEMENT")}
          </p>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#102a43] tracking-tight">
            {t("tasks.myTasks", "My tasks")}
          </h1>
          <p className="text-sm text-[#829ab1] mt-1 font-normal">
            {t(
              "tasks.subtitle",
              "Stay on top of your priorities and deliverables."
            )}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => handleOpenTaskUpdate(tasks[0])}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1c364f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#284761] shadow-sm shrink-0 self-start sm:self-auto"
        >
          <FiPlus className="h-4 w-4" />
          <span>{t("tasks.employeeTasks.newTaskUpdate", "New task update")}</span>
        </motion.button>
      </motion.div>

      {/* 2. Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-2.5 overflow-x-auto pb-1"
      >
        {FILTERS.map((f) => {
          const count = stats[f.id] || 0;
          const isActive = activeFilter === f.id;

          return (
            <motion.button
              key={f.id}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                isActive
                  ? "bg-[#1c364f] text-white"
                  : "bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"
              }`}
            >
              <span>{t(f.labelKey, f.defaultLabel)}</span>
              <span
                className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-[#f1f5f9] text-[#64748b]"
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* 3. Task Cards List */}
      <AnimatePresence mode="popLayout">
        {filteredTasks.length > 0 ? (
          <motion.div layout className="space-y-4">
            {filteredTasks.map((task, index) => {
              const taskTitle = t(task.titleKey, task.defaultTitle);
              const taskDueDate = t(task.dueDateKey, task.defaultDueDate);

              return (
                <motion.article
                  layout
                  key={task.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  className="relative flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 pl-10 pr-6 rtl:pr-10 rtl:pl-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] hover:shadow-md transition-shadow"
                >
                  {/* الشريط الجانبي المطابق لليو اي */}
                  <div
                    className={`absolute left-5 rtl:left-auto rtl:right-5 top-6 bottom-6 w-[3.5px] rounded-full ${task.stripeColor}`}
                  />

                  <div>
                    {/* Header row: Priority Badge + Actions */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${task.priorityBadge}`}
                      >
                        {getPriorityLabel(task.priority)}
                      </span>

                      <button
                        type="button"
                        className="text-[#94a3b8] hover:text-[#1e293b] p-1 transition"
                        aria-label="More options"
                      >
                        <FiMoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Title & Date */}
                    <div className="mt-3">
                      <h3 className="text-base font-bold text-[#102a43] tracking-tight">
                        {taskTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#829ab1] mt-1.5">
                        <FiCalendar className="h-3.5 w-3.5" />
                        <span>{taskDueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Status/Progress Bar & Action Button */}
                  <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    {/* Progress info */}
                    <div className="w-full md:max-w-md space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#829ab1]">{getStatusLabel(task.status)}</span>
                        <span className="font-bold text-[#102a43]">{task.progress}%</span>
                      </div>

                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 + index * 0.05 }}
                          className={`h-full rounded-full ${task.progressColor}`}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="shrink-0 self-end md:self-auto">
                      {task.status === "in-progress" ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => handleOpenTaskUpdate(task)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#d9e2ec] bg-white px-4 py-2 text-xs font-semibold text-[#102a43] hover:bg-[#f8fafc] transition shadow-sm"
                        >
                          <FiUploadCloud className="h-4 w-4 text-[#64748b]" />
                          <span>{t("tasks.submitDeliverable", "Submit deliverable")}</span>
                        </motion.button>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-[#fffaf0] border border-[#feebc8] px-4 py-2 text-xs font-medium text-[#c05621]">
                          <FiClock className="h-3.5 w-3.5" />
                          <span>{t("tasks.awaitingReview", "Awaiting review")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-12 text-center"
          >
            <FiCheckCircle className="h-8 w-8 text-[#94a3b8] mb-2" />
            <p className="text-sm font-semibold text-[#102a43]">
              {t("tasks.noTasks", "No tasks found")}
            </p>
            <p className="text-xs text-[#829ab1] mt-1">
              {t("tasks.allCaughtUp", "All tasks in this category are caught up.")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Task Update Modal */}
      <AnimatePresence>
        {showTaskUpdate && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseTaskUpdate}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[500px] rounded-2xl bg-white p-7 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                    {t("tasks.taskUpdate", "TASK UPDATE")}
                  </p>
                  <h2 className="text-lg font-bold text-[#102a43] mt-0.5">
                    {t("tasks.submitDeliverable", "Submit deliverable")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCloseTaskUpdate}
                  className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#102a43] transition"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Task Title Box */}
              <div className="rounded-xl bg-[#f8fafc] px-4 py-3 border border-[#f1f5f9] mb-5">
                <p className="text-xs font-semibold text-[#102a43]">
                  {t(selectedTask.titleKey, selectedTask.defaultTitle)}
                </p>
              </div>

              {/* Progress Slider */}
              <div className="mb-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#64748b]">
                    {t("tasks.form.progress", "Progress")}
                  </span>
                  <span className="font-bold text-[#102a43]">{progressVal}%</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  style={{
                    background: isRtl
                      ? `linear-gradient(to left, #2f855a 0%, #2f855a ${progressVal}%, #e2e8f0 ${progressVal}%, #e2e8f0 100%)`
                      : `linear-gradient(to right, #2f855a 0%, #2f855a ${progressVal}%, #e2e8f0 ${progressVal}%, #e2e8f0 100%)`,
                  }}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#2f855a] focus:outline-none 
                    [&::-webkit-slider-thumb]:h-3.5 
                    [&::-webkit-slider-thumb]:w-3.5 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-[#2f855a] 
                    [&::-webkit-slider-thumb]:shadow-sm
                    [&::-moz-range-thumb]:h-3.5 
                    [&::-moz-range-thumb]:w-3.5 
                    [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:border-0 
                    [&::-moz-range-thumb]:bg-[#2f855a]"
                />
              </div>

              {/* Notes */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                  {t("tasks.form.notes", "Notes")}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t(
                    "tasks.form.notesPlaceholder",
                    "Add notes about this deliverable..."
                  )}
                  className="w-full resize-none rounded-xl border border-[#d9e2ec] px-3.5 py-2.5 text-xs text-[#102a43] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581] transition"
                />
              </div>

              {/* Upload Dropzone */}
              <div className="mb-6">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e2e8f0] bg-[#fafcfd] py-6 px-4 hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition text-center">
                  <input
                    type="file"
                    accept=".pdf,.docx,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f9] text-[#64748b]">
                    <FiUploadCloud className="h-5 w-5" />
                  </div>
                  {uploadedFile ? (
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#102a43] truncate max-w-xs">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[10px] text-[#94a3b8]">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#102a43]">
                        {t("tasks.form.uploadFile", "Tap to upload a file")}
                      </p>
                      <p className="text-[10px] text-[#94a3b8]">
                        {t("tasks.form.uploadHint", "PDF, DOCX, PNG up to 10MB")}
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmitForReview}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1c364f] py-3 px-4 text-xs font-semibold text-white hover:bg-[#254360] transition shadow-sm"
              >
                <span>{t("tasks.form.submitForReview", "Submit for review")}</span>
                <span className="text-sm">{isRtl ? "←" : "→"}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;