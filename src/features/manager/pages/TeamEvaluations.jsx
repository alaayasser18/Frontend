import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const INITIAL_MEMBERS = [
  { id: "youssef", nameKey: "youssefLotfy", defaultName: "Youssef Lotfy", status: "submitted", rating: 4.2 },
  { id: "karim", nameKey: "karimAshraf", defaultName: "Karim Ashraf", status: "inProgress", rating: null },
  { id: "salma", nameKey: "salmaNabil", defaultName: "Salma Nabil", status: "notStarted", rating: null },
  { id: "omar", nameKey: "omarFathy", defaultName: "Omar Fathy", status: "notStarted", rating: null },
];

// ألوان مطابقة تماماً لتصميم الـ UI
const STATUS_STYLES = {
  submitted: "bg-[#ecfdf5] text-[#059669]",
  inProgress: "bg-[#fefce8] text-[#d97706]",
  notStarted: "bg-[#f1f5f9] text-[#64748b]",
};

const STATUS_KEYS = {
  submitted: "managerEvaluations.statusSubmitted",
  inProgress: "managerEvaluations.statusInProgress",
  notStarted: "managerEvaluations.statusNotStarted",
};

const STATUS_DEFAULTS = {
  submitted: "Submitted",
  inProgress: "In Progress",
  notStarted: "Not Started",
};

const MIN_SCORE = 1;
const MAX_SCORE = 5;
const DEFAULT_SCORE = 3;
const THUMB_SIZE = 16;

const formatRating = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

const generateEvaluationDraft = ({ name, score, t }) =>
  new Promise((resolve) => {
    const band = score >= 4 ? "High" : score === 3 ? "Mid" : "Low";
    setTimeout(() => resolve(t(`managerEvaluations.draft${band}`, { name, defaultValue: `Strong performance across key milestones this quarter.` })), 900);
  });

const SparklesIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Evaluate Employee Modal                                                   */
/* -------------------------------------------------------------------------- */
const EvaluateEmployeeModal = ({ member, onClose, onSave }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const [score, setScore] = useState(DEFAULT_SCORE);
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const firstName = member.name.trim().split(/\s+/)[0];
      const draft = await generateEvaluationDraft({ name: firstName, score, t });
      if (isMounted.current) setFeedback(draft);
    } finally {
      if (isMounted.current) setIsGenerating(false);
    }
  };

  const handleSave = () => onSave({ id: member.id, score, feedback: feedback.trim() });

  const fraction = (score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
  const stop = `calc(${THUMB_SIZE / 2}px + ${fraction} * (100% - ${THUMB_SIZE}px))`;
  const trackBackground = `linear-gradient(${isRtl ? "to left" : "to right"}, #3b82f6 ${stop}, #e2e8f0 ${stop})`;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="evaluate-employee-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            id="evaluate-employee-title"
            className="text-lg font-bold text-[#102a43]"
          >
            {t("managerEvaluations.evaluateEmployee", "Evaluate Employee")}
            <span className="text-sm font-normal text-[#64748b] block mt-0.5">{member.name}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", "Close")}
            className="text-[#94a3b8] hover:text-[#102a43] transition p-1"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <label
          htmlFor="overall-score"
          className="block text-sm font-semibold text-[#102a43] mb-2"
        >
          {t("managerEvaluations.overallScore", { score, defaultValue: `Overall score: ${score} / 5` })}
        </label>

        <div className="relative my-4 h-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
            style={{ background: trackBackground }}
          />
          <input
            id="overall-score"
            type="range"
            min={MIN_SCORE}
            max={MAX_SCORE}
            step={1}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="relative m-0 h-4 w-full cursor-pointer appearance-none bg-transparent focus:outline-none
              [&::-webkit-slider-runnable-track]:bg-transparent
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-[#2563eb] [&::-webkit-slider-thumb]:shadow-md
              [&::-moz-range-track]:bg-transparent
              [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#2563eb]"
          />
        </div>

        <motion.button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          whileHover={isGenerating ? undefined : { scale: 1.01 }}
          whileTap={isGenerating ? undefined : { scale: 0.99 }}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#d9e2ec] bg-white text-xs font-semibold text-[#486581] transition hover:bg-[#f8fafc] disabled:opacity-60"
        >
          <SparklesIcon className={`h-4 w-4 text-[#3b82f6] ${isGenerating ? "animate-pulse" : ""}`} />
          {t("managerEvaluations.generateDraft", "Generate Draft with AI")}
        </motion.button>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t("managerEvaluations.feedbackPlaceholder", "Add qualitative feedback and key highlights...")}
          rows={4}
          className="mt-4 block w-full resize-none rounded-xl border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#102a43] placeholder:text-[#9fb3c8] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
        />

        <motion.button
          type="button"
          onClick={handleSave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-5 h-11 w-full rounded-xl bg-[#102a43] text-sm font-semibold text-white transition hover:bg-[#1f3a56] shadow-sm"
        >
          {t("managerEvaluations.saveEvaluation", "Save Evaluation")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Team Evaluations Page                                                     */
/* -------------------------------------------------------------------------- */
const TeamEvaluations = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const getName = useCallback(
    (member) => t(`managerTasks.${member.nameKey}`, member.defaultName || ""),
    [t]
  );
  const closeModal = useCallback(() => setEvaluatingId(null), []);

  const handleSave = useCallback(({ id, score }) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "submitted", rating: score } : m))
    );
    setEvaluatingId(null);
    setToast(Date.now());
  }, []);

  const evaluating = members.find((m) => m.id === evaluatingId);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full space-y-6 pb-12 font-sans"
      >
        {/* 1. Breadcrumb + Header */}
        <motion.div variants={fadeUp} transition={{ duration: 0.2, ease: "easeOut" }}>
          <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
            {t("portal.managerPortal", "MANAGER PORTAL")} / {t("portal.teamEvaluations", "TEAM EVALUATIONS")}
          </p>
          <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
            {t("portal.teamEvaluations", "Team Evaluations")}
          </h1>
          <p className="text-sm text-[#829ab1] mt-1 font-normal">
            {t(
              "managerDashboard.subtitle",
              "Keep your team aligned, supported, and moving forward."
            )}
          </p>
        </motion.div>

        {/* 2. Active Evaluation Cycle Card */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
        >
          {/* Green left border accent matching design */}
          <div className="absolute inset-y-0 left-0 w-1 bg-[#10b981] rtl:left-auto rtl:right-0" />

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
              {t("managerEvaluations.activeCycle", "ACTIVE EVALUATION CYCLE")}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#102a43]">
              {t("managerEvaluations.cycleName", "Q3 2026 Cycle")}
            </h2>
          </div>

          <span className="rounded-full bg-[#ecfdf5] px-3.5 py-1 text-xs font-semibold text-[#059669]">
            {t("managerEvaluations.closesIn", { days: 12, defaultValue: "Closes in 12 days" })}
          </span>
        </motion.div>

        {/* 3. Team Table Card (Edge-to-edge layout) */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="bg-[#f8fafc]/60 border-b border-[#f1f5f9] text-[11px] font-bold tracking-wider text-[#94a3b8]">
                  <th className="py-4 px-6">{t("managerEvaluations.colTeamMember", "TEAM MEMBER")}</th>
                  <th className="py-4 px-6">{t("managerEvaluations.colRole", "ROLE")}</th>
                  <th className="py-4 px-6">{t("managerEvaluations.colReviewStatus", "REVIEW STATUS")}</th>
                  <th className="py-4 px-6">{t("managerEvaluations.colLastRating", "LAST RATING")}</th>
                  <th className="py-4 px-6 text-right rtl:text-left">
                    <span className="sr-only">{t("common.actions", "Actions")}</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f1f5f9]">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-[#f8fafc]/40 transition"
                  >
                    {/* Team Member */}
                    <td className="py-5 px-6 text-sm font-semibold text-[#1e293b]">
                      {getName(member)}
                    </td>

                    {/* Role */}
                    <td className="py-5 px-6 text-sm text-[#64748b]">
                      {t("managerEvaluations.roleSoftwareEngineer", "Software Engineer")}
                    </td>

                    {/* Review Status Badge */}
                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[member.status]}`}
                      >
                        {t(STATUS_KEYS[member.status], STATUS_DEFAULTS[member.status])}
                      </span>
                    </td>

                    {/* Last Rating */}
                    <td className="py-5 px-6 text-sm text-[#475569]">
                      {member.rating == null ? (
                        <span className="text-[#94a3b8] font-normal">—</span>
                      ) : (
                        <span dir="ltr" className="font-medium">
                          {formatRating(member.rating)} / 5
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-5 px-6 text-right rtl:text-left">
                      <button
                        type="button"
                        onClick={() => setEvaluatingId(member.id)}
                        className="text-xs font-semibold text-[#059669] hover:text-[#047857] transition"
                      >
                        + {t("managerEvaluations.evaluateEmployee", "Evaluate Employee")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Evaluate Modal Portal */}
      {createPortal(
        <AnimatePresence>
          {evaluating && (
            <EvaluateEmployeeModal
              key={evaluating.id}
              member={{ id: evaluating.id, name: getName(evaluating) }}
              onClose={closeModal}
              onSave={handleSave}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Toast Notification */}
      {createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed bottom-6 right-6 z-[110] rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white shadow-lg"
            >
              {t("managerEvaluations.toastSaved", "Evaluation saved successfully")}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default TeamEvaluations;