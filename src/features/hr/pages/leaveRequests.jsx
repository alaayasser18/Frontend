import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDownload,
  FiCheck,
  FiFileText,
  FiX,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

const initialRequests = [
  {
    id: 1,
    nameKey: "leaveRequests.requestsEmployees.mariam.name",
    roleKey: "leaveRequests.requestsEmployees.mariam.role",
    departmentKey: "leaveRequests.requestsEmployees.mariam.department",
    category: "annual",
    datesKey: "leaveRequests.requestsEmployees.mariam.dates",
    balanceKey: "leaveRequests.requestsEmployees.mariam.balance",
  },
  {
    id: 2,
    nameKey: "leaveRequests.requestsEmployees.omar.name",
    roleKey: "leaveRequests.requestsEmployees.omar.role",
    departmentKey: "leaveRequests.requestsEmployees.omar.department",
    category: "emergency",
    datesKey: "leaveRequests.requestsEmployees.omar.dates",
    balanceKey: "leaveRequests.requestsEmployees.omar.balance",
  },
  {
    id: 3,
    nameKey: "leaveRequests.requestsEmployees.nour.name",
    roleKey: "leaveRequests.requestsEmployees.nour.role",
    departmentKey: "leaveRequests.requestsEmployees.nour.department",
    category: "medical",
    datesKey: "leaveRequests.requestsEmployees.nour.dates",
    balanceKey: "leaveRequests.requestsEmployees.nour.balance",
  },
];

const categoryStyles = {
  annual: "bg-[#f5f3ff] text-[#7c3aed]",
  emergency: "bg-[#fff7ed] text-[#c2410c]",
  medical: "bg-[#fef2f2] text-[#dc2626]",
};

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: {
      duration: 0.18,
    },
  },
};

const LeaveRequests = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.toLowerCase().startsWith("ar");

  const [requests, setRequests] = useState(initialRequests);

  const [approvedCount, setApprovedCount] = useState(12);
  const [rejectedCount, setRejectedCount] = useState(2);

  const [activeAction, setActiveAction] = useState(null);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    request: null,
  });

  const [rejectNote, setRejectNote] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [isArabic]);

  const translatedRequests = useMemo(() => {
    return requests.map((request) => ({
      ...request,
      name: t(request.nameKey),
      role: t(request.roleKey),
      department: t(request.departmentKey),
      dates: t(request.datesKey),
      balance: t(request.balanceKey),
    }));
  }, [requests, i18n.language, t]);

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage(null);
    }, 2500);
  };

  const handleApprove = (request) => {
    setActiveAction(`approve-${request.id}`);

    setTimeout(() => {
      setRequests((prev) => prev.filter((item) => item.id !== request.id));

      setApprovedCount((prev) => prev + 1);

      setActiveAction(null);

      showMessage(
        "success",
        isArabic
          ? `تمت الموافقة على طلب ${request.name}`
          : `${request.name}'s leave request has been approved.`,
      );
    }, 500);
  };

  const handleRejectClick = (request) => {
    setRejectModal({
      open: true,
      request,
    });

    setRejectNote("");
  };

  const closeRejectModal = () => {
    setRejectModal({
      open: false,
      request: null,
    });

    setRejectNote("");
  };

  const handleConfirmReject = () => {
    if (!rejectModal.request || !rejectNote.trim()) {
      return;
    }

    const request = rejectModal.request;

    setActiveAction(`reject-${request.id}`);

    setTimeout(() => {
      setRequests((prev) => prev.filter((item) => item.id !== request.id));

      setRejectedCount((prev) => prev + 1);

      setActiveAction(null);

      setRejectModal({
        open: false,
        request: null,
      });

      setRejectNote("");

      showMessage(
        "error",
        isArabic
          ? `تم رفض طلب ${request.name}`
          : `${request.name}'s leave request has been rejected.`,
      );
    }, 500);
  };

  const handleExport = () => {
    const headers = [
      t("leaveRequests.table.employee"),
      t("leaveRequests.table.roleDepartment"),
      t("leaveRequests.table.category"),
      t("leaveRequests.table.duration"),
      t("leaveRequests.table.balance"),
    ];

    const rows = translatedRequests.map((request) => [
      request.name,
      `${request.role} - ${request.department}`,
      t(`leaveRequests.categories.${request.category}`),
      request.dates,
      request.balance,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "leave-requests.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showMessage(
      "success",
      isArabic
        ? "تم تصدير قائمة الطلبات بنجاح"
        : "Leave requests exported successfully.",
    );
  };

  const pendingCount = requests.length;

  return (
    <motion.div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full min-w-0 space-y-6 overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* ==================== Toast ==================== */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.97,
            }}
            transition={{
              duration: 0.2,
            }}
            className={`fixed right-5 top-5 z-[100] flex max-w-[360px] items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
              message.type === "success"
                ? "border-[#d1fae5] text-[#047857]"
                : "border-[#fecaca] text-[#dc2626]"
            }`}
          >
            {message.type === "success" ? (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5]">
                <FiCheck size={17} />
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2]">
                <FiAlertCircle size={17} />
              </div>
            )}

            <span className="text-xs font-semibold sm:text-sm">
              {message.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== Header ==================== */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
            {isArabic
              ? "الموارد البشرية / طلبات الإجازات"
              : "HR Portal / Leave Requests"}
          </p>

          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
            {t("leaveRequests.title")}
          </h1>

          <p className="mt-1 text-sm font-normal text-[#64748b]">
            {t("leaveRequests.subtitle")}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleExport}
          whileHover={{
            y: -2,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.97,
          }}
          transition={{
            duration: 0.2,
          }}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
        >
          <FiDownload className="h-4 w-4" />

          <span>{t("leaveRequests.export")}</span>
        </motion.button>
      </motion.div>

      {/* ==================== Statistics ==================== */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {/* Pending */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {isArabic ? "طلبات قيد المراجعة" : "Pending Reviews"}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#f97316]">
              <FiClock className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              {pendingCount}
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {isArabic ? "في انتظار المراجعة" : "Waiting for review"}
            </p>
          </div>
        </motion.div>

        {/* Approved */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {isArabic ? "تمت الموافقة" : "Approved"}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981]">
              <FiCheck className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              {approvedCount}
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {isArabic ? "تمت الموافقة هذا الشهر" : "Approved this month"}
            </p>
          </div>
        </motion.div>

        {/* Rejected */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {isArabic ? "مرفوضة" : "Rejected"}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fef2f2] text-[#ef4444]">
              <FiX className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              {rejectedCount}
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {isArabic ? "تم الرفض هذا الشهر" : "Rejected this month"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ==================== Results ==================== */}
      <motion.div variants={itemVariants}>
        <p className="text-xs font-normal text-[#64748b]">
          {isArabic
            ? `${pendingCount} طلبات قيد المراجعة`
            : `${pendingCount} pending requests`}
        </p>
      </motion.div>

      {/* ==================== Main Card ==================== */}
      <motion.div
        variants={itemVariants}
        className="w-full overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-[#1e293b] sm:text-lg">
              {t("leaveRequests.queue")}
            </h2>

            <p className="mt-1 text-xs text-[#64748b]">
              {isArabic
                ? "مراجعة وإدارة طلبات الإجازات"
                : "Review and manage employee leave requests."}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
            <FiFileText className="h-[18px] w-[18px]" />
          </div>
        </div>

        {/* ==================== Desktop Table ==================== */}
        <div className="hidden w-full lg:block">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[13%]" />
              <col className="w-[17%]" />
              <col className="w-[10%]" />
              <col className="w-[16%]" />
              <col className="w-[10%]" />
              <col className="w-[13%]" />
              <col className="w-[21%]" />
            </colgroup>

            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] rtl:text-right sm:text-[11px]">
                  {t("leaveRequests.table.employee")}
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] rtl:text-right sm:text-[11px]">
                  {t("leaveRequests.table.roleDepartment")}
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] rtl:text-right sm:text-[11px]">
                  {t("leaveRequests.table.category")}
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] rtl:text-right sm:text-[11px]">
                  {t("leaveRequests.table.duration")}
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] rtl:text-right sm:text-[11px]">
                  {t("leaveRequests.table.balance")}
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] rtl:text-right sm:text-[11px]">
                  {t("leaveRequests.table.reason")}
                </th>

                <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] rtl:text-right sm:text-[11px]">
                  {t("leaveRequests.table.actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8fafc] text-[#94a3b8]">
                        <FiCheck size={22} />
                      </div>

                      <p className="text-sm font-bold text-[#1e293b] sm:text-base">
                        {isArabic
                          ? "لا توجد طلبات معلقة"
                          : "No pending requests"}
                      </p>

                      <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                        {isArabic
                          ? "تمت مراجعة جميع طلبات الإجازات."
                          : "All leave requests have been reviewed."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                translatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t border-[#f1f5f9] transition-colors hover:bg-[#fafbfc]"
                  >
                    {/* Employee */}
                    <td className="px-5 py-5 align-middle">
                      <span className="block truncate text-sm font-bold text-[#1e293b]">
                        {request.name}
                      </span>
                    </td>

                    {/* Role / Department */}
                    <td className="px-4 py-5 align-middle">
                      <div className="truncate text-xs font-medium text-[#475569] sm:text-sm">
                        {request.role}
                      </div>

                      <div className="mt-1 truncate text-xs text-[#94a3b8]">
                        {request.department}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-5 align-middle">
                      <span
                        className={`inline-flex max-w-full rounded-full px-2.5 py-1 text-[10px] font-bold sm:px-3 sm:py-1.5 sm:text-xs ${
                          categoryStyles[request.category]
                        }`}
                      >
                        {t(`leaveRequests.categories.${request.category}`)}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-5 align-middle">
                      <span className="block truncate text-xs text-[#64748b] sm:text-sm">
                        {request.dates}
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-5 align-middle">
                      <span className="block truncate text-xs font-medium text-[#475569] sm:text-sm">
                        {request.balance}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-5 align-middle">
                      <button
                        type="button"
                        className="flex max-w-full items-center gap-1.5 text-xs font-semibold text-[#475569] underline underline-offset-2 transition hover:text-[#243B53]"
                      >
                        <FiFileText className="shrink-0" size={14} />

                        <span className="truncate">
                          {t("leaveRequests.viewReason")}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-5 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={activeAction !== null}
                          onClick={() => handleApprove(request)}
                          className="flex h-9 min-w-[88px] items-center justify-center gap-1.5 rounded-lg bg-[#ecfdf5] px-3 text-xs font-semibold text-[#15803d] transition hover:bg-[#dcfce7] hover:shadow-sm active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {activeAction === `approve-${request.id}` ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#15803d] border-t-transparent" />
                          ) : (
                            <>
                              <FiCheck size={14} />

                              {t("leaveRequests.approve")}
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={activeAction !== null}
                          onClick={() => handleRejectClick(request)}
                          className="flex h-9 items-center justify-center rounded-lg bg-[#fef2f2] px-3 text-xs font-semibold text-[#dc2626] transition hover:bg-[#fee2e2] hover:shadow-sm active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {t("leaveRequests.reject")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ==================== Mobile ==================== */}
        <div className="divide-y divide-[#f1f5f9] lg:hidden">
          {requests.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8fafc] text-[#94a3b8]">
                <FiCheck size={22} />
              </div>

              <p className="mt-3 text-sm font-bold text-[#1e293b]">
                {isArabic ? "لا توجد طلبات معلقة" : "No pending requests"}
              </p>

              <p className="mt-1 text-xs text-[#64748b]">
                {isArabic
                  ? "تمت مراجعة جميع طلبات الإجازات."
                  : "All leave requests have been reviewed."}
              </p>
            </div>
          ) : (
            translatedRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="p-5 transition-colors hover:bg-[#fafbfc]"
              >
                {/* Employee */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-[#1e293b] sm:text-base">
                      {request.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-[#475569] sm:text-sm">
                      {request.role}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#94a3b8]">
                      {request.department}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-bold sm:px-3 sm:text-xs ${
                      categoryStyles[request.category]
                    }`}
                  >
                    {t(`leaveRequests.categories.${request.category}`)}
                  </span>
                </div>

                {/* Info */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f8fafc] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                      {t("leaveRequests.table.duration")}
                    </p>

                    <p className="mt-1 text-xs text-[#475569]">
                      {request.dates}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8fafc] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                      {t("leaveRequests.table.balance")}
                    </p>

                    <p className="mt-1 text-xs text-[#475569]">
                      {request.balance}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <button
                  type="button"
                  className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#475569] underline underline-offset-2 transition hover:text-[#243B53] sm:text-sm"
                >
                  <FiFileText size={15} />

                  {t("leaveRequests.viewReason")}
                </button>

                {/* Buttons */}
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    disabled={activeAction !== null}
                    onClick={() => handleApprove(request)}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#ecfdf5] px-4 text-xs font-semibold text-[#15803d] transition hover:bg-[#dcfce7] active:scale-[0.98] disabled:opacity-50"
                  >
                    {activeAction === `approve-${request.id}` ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#15803d] border-t-transparent" />
                    ) : (
                      <>
                        <FiCheck size={14} />

                        {t("leaveRequests.approve")}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={activeAction !== null}
                    onClick={() => handleRejectClick(request)}
                    className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#fef2f2] px-4 text-xs font-semibold text-[#dc2626] transition hover:bg-[#fee2e2] active:scale-[0.98] disabled:opacity-50"
                  >
                    {t("leaveRequests.reject")}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* ==================== Reject Modal ==================== */}
      <AnimatePresence>
        {rejectModal.open && rejectModal.request && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeRejectModal();
              }
            }}
          >
            {/* Overlay */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]"
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reject-leave-title"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#f1f5f9] px-6 py-5">
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef2f2] text-[#ef4444]">
                    <FiX className="h-[18px] w-[18px]" />
                  </div>

                  <h3
                    id="reject-leave-title"
                    className="text-base font-bold text-[#1e293b]"
                  >
                    {isArabic ? "رفض طلب الإجازة" : "Reject Leave Request"}
                  </h3>

                  <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                    {rejectModal.request.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeRejectModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
                  aria-label={isArabic ? "إغلاق" : "Close"}
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#475569]">
                    {isArabic ? "سبب الرفض" : "Rejection note"}
                  </label>

                  <textarea
                    value={rejectNote}
                    onChange={(event) => setRejectNote(event.target.value)}
                    rows={4}
                    placeholder={
                      isArabic
                        ? "اكتبي سبب رفض الطلب..."
                        : "Add a note for the employee..."
                    }
                    className="w-full resize-none rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#334155] outline-none transition placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:text-sm"
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={closeRejectModal}
                    className="flex-1 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#64748b] transition hover:bg-[#f8fafc] active:scale-[0.98] sm:text-sm"
                  >
                    {t("common.cancel")}
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmReject}
                    disabled={!rejectNote.trim() || activeAction !== null}
                    className="flex-1 rounded-lg bg-[#dc2626] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#b91c1c] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    {activeAction === `reject-${rejectModal.request.id}` ? (
                      <span className="mx-auto block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      t("leaveRequests.reject")
                    )}
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

export default LeaveRequests;
