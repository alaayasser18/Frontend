import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiX, FiFileText } from "react-icons/fi";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const SUBMISSIONS_SEED = [
  {
    id: 1,
    queueId: "oauth2Flow",
    titleKey: "submissionOauth2Title",
    defaultTitle: "Implement OAuth2 Flow",
    submitterKey: "youssefLotfy",
    defaultSubmitter: "Youssef Lotfy",
    dateKey: "dateSep16",
    defaultDate: "Sep 16, 2026",
    notesKey: "submissionOauth2Notes",
    defaultNotes: "Added refresh token rotation and covered the callback edge cases in integration tests.",
    files: ["oauth-service.ts", "auth.test.ts"],
    expanded: true,
  },
  {
    id: 2,
    queueId: "releaseNotes",
    titleKey: "submissionQ3ReleaseNotesTitle",
    defaultTitle: "Q3 release notes",
    submitterKey: "salmaNabil",
    defaultSubmitter: "Salma Nabil",
    attachmentsCount: 2,
    expanded: false,
    details: {
      dateKey: "dateSep15",
      defaultDate: "Sep 15, 2026",
      notesKey: "submissionQ3ReleaseNotesNotes",
      defaultNotes: "Updated the quarterly changelog and release summary.",
      files: ["release-notes-q3.md", "changelog.md"],
    },
  },
  {
    id: 3,
    queueId: "paymentTests",
    titleKey: "submissionPaymentTestsTitle",
    defaultTitle: "Payment integration tests",
    submitterKey: "karimAshraf",
    defaultSubmitter: "Karim Ashraf",
    attachmentsCount: 2,
    expanded: false,
    details: {
      dateKey: "dateSep17",
      defaultDate: "Sep 17, 2026",
      notesKey: "submissionPaymentTestsNotes",
      defaultNotes: "Completed edge case coverage for recurring payments.",
      files: ["payment.test.ts", "test-report.pdf"],
    },
  },
];

const expandSubmission = (submission) => ({
  ...submission,
  ...submission.details,
  attachmentsCount: undefined,
  expanded: true,
});

const SubmissionReviews = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedQueueId = location.state?.submissionQueueId ?? null;
  const selectedSubmission = SUBMISSIONS_SEED.find((s) => s.queueId === selectedQueueId);

  const [submissions, setSubmissions] = useState(() =>
    SUBMISSIONS_SEED.map((s) => (s.id === selectedSubmission?.id ? expandSubmission(s) : s)),
  );
  const [highlightId, setHighlightId] = useState(selectedSubmission?.id ?? null);
  const [changeModalSubmissionId, setChangeModalSubmissionId] = useState(null);
  const [changeText, setChangeText] = useState("");

  useEffect(() => {
    if (!selectedSubmission) return undefined;
    navigate(location.pathname, { replace: true, state: null });
    const scrollTimer = setTimeout(() => {
      document
        .getElementById(`submission-${selectedSubmission.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    const highlightTimer = setTimeout(() => setHighlightId(null), 2500);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };
  }, []);

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
          className="bg-[#102a43] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg"
        >
          {message}
        </motion.div>
      ),
      { position: "bottom-right" },
    );
  };

  const handleApprove = (id) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    showToast(
      t("managerSubmissions.toastApproved", "Submission approved and task completed"),
    );
  };

  const handleReject = (id) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    showToast(t("managerSubmissions.toastRejected", "Submission rejected"));
  };

  const handleOpenChangeModal = (id) => {
    setChangeModalSubmissionId(id);
    setChangeText("");
  };

  const handleCloseChangeModal = () => {
    setChangeModalSubmissionId(null);
    setChangeText("");
  };

  const handleSendChangeRequest = () => {
    handleCloseChangeModal();
    showToast(t("managerSubmissions.toastChangeRequested", "Change request sent"));
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans">
      {/* 1. Breadcrumb + Header */}
      <div>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("managerSubmissions.breadcrumb", "MANAGER PORTAL / SUBMISSION REVIEWS")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("managerSubmissions.title", "Submission Reviews")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerSubmissions.subtitle",
            "Keep your team aligned, supported, and moving forward.",
          )}
        </p>
      </div>

      {/* 2. Submission Cards */}
      <motion.div initial="hidden" animate="visible" variants={listStagger} className="space-y-4">
        <AnimatePresence>
          {submissions.map((submission) => {
            const title = t(`managerSubmissions.${submission.titleKey}`, submission.defaultTitle || "");
            const submitter = t(`managerSubmissions.${submission.submitterKey}`, submission.defaultSubmitter || "");
            const date = submission.dateKey ? t(`managerSubmissions.${submission.dateKey}`, submission.defaultDate || "") : "";
            const notes = submission.notesKey ? t(`managerSubmissions.${submission.notesKey}`, submission.defaultNotes || "") : "";

            return (
              <motion.div
                key={submission.id}
                id={`submission-${submission.id}`}
                variants={cardVariants}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all duration-300 ${
                  highlightId === submission.id ? "ring-2 ring-[#486581]/30" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  {/* Badge */}
                  <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-xs font-semibold text-[#b45309]">
                    {t("managerSubmissions.reviewPending", "Review Pending")}
                  </span>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-semibold text-[#102a43] mt-2.5">
                    {title}
                  </h3>

                  {/* Submitter & Meta */}
                  <p className="text-sm text-[#64748b] mt-1">
                    {t("managerSubmissions.submittedBy", "Submitted by")}{" "}
                    <span className="font-medium text-[#334155]">{submitter}</span>
                    {date && <> · {date}</>}
                    {submission.attachmentsCount && (
                      <>
                        {" "}
                        ·{" "}
                        {t("managerSubmissions.attachmentsCount", {
                          count: submission.attachmentsCount,
                          defaultValue: `${submission.attachmentsCount} attachments`,
                        })}
                      </>
                    )}
                  </p>

                  {/* Submitter Notes */}
                  {submission.expanded && notes && (
                    <p className="text-sm text-[#475569] mt-3.5 leading-relaxed">
                      <span className="font-semibold text-[#1e293b]">
                        {t("managerSubmissions.submitterNotes", "Submitter notes:")}
                      </span>{" "}
                      {notes}
                    </p>
                  )}

                  {/* Attached Files Chips */}
                  {submission.expanded && submission.files && (
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      {submission.files.map((file) => (
                        <span
                          key={file}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#475569]"
                        >
                          <FiFileText className="w-3.5 h-3.5 text-[#64748b]" />
                          {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {submission.expanded && (
                  <div className="flex flex-col items-stretch gap-2 shrink-0 md:w-48">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleApprove(submission.id)}
                      className="w-full rounded-xl bg-[#15803d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#166534] transition shadow-sm"
                    >
                      {t("managerSubmissions.approveComplete", "Approve & Complete")}
                    </motion.button>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleOpenChangeModal(submission.id)}
                        className="flex-1 rounded-xl bg-[#d97706] px-3 py-2 text-xs font-semibold text-white hover:bg-[#b45309] transition shadow-sm text-center"
                      >
                        {t("managerSubmissions.requestChanges", "Request Changes")}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleReject(submission.id)}
                        className="rounded-xl bg-[#dc2626] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#b91c1c] transition shadow-sm"
                      >
                        {t("managerSubmissions.reject", "Reject")}
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* 3. Request Changes Modal */}
      <AnimatePresence>
        {changeModalSubmissionId !== null && (
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
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base md:text-lg font-bold text-[#102a43]">
                  {t("managerSubmissions.requestChanges", "Request Changes")}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseChangeModal}
                  className="text-[#94a3b8] hover:text-[#102a43] transition"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <textarea
                value={changeText}
                onChange={(e) => setChangeText(e.target.value)}
                placeholder={t(
                  "managerSubmissions.changePlaceholder",
                  "Explain what needs to change...",
                )}
                rows={4}
                className="w-full rounded-xl border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#102a43] placeholder:text-[#9fb3c8] focus:outline-none focus:ring-2 focus:ring-[#486581]/30 resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSendChangeRequest}
                className="mt-5 w-full rounded-xl bg-[#d97706] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b45309] transition shadow-sm"
              >
                {t("managerSubmissions.sendChangeRequest", "Send Change Request")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmissionReviews;