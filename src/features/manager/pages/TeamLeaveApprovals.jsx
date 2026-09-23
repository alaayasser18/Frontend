import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiCalendar } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const INITIAL_REQUESTS = [
  {
    id: 1,
    name: "Nour Adel",
    leaveTypeKey: "annual",
    defaultLeaveType: "Annual",
    dates: "Sep 23 - Sep 25",
    days: 3,
    reasonKey: "familyTrip",
    defaultReason: "Family trip",
    status: "pending",
  },
  {
    id: 2,
    name: "Omar Fathy",
    leaveTypeKey: "sick",
    defaultLeaveType: "Sick",
    dates: "Sep 19",
    days: 1,
    reasonKey: "medicalAppointment",
    defaultReason: "Medical appointment",
    status: "pending",
  },
];

const TeamLeaveApprovals = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const handleDecision = (id, status) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* ======================================
          1. BREADCRUMB + PAGE HEADER
      ====================================== */}
      <motion.div variants={fadeUp} transition={{ duration: 0.2, ease: "easeOut" }}>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("managerLeave.breadcrumb", "MANAGER PORTAL / TEAM LEAVE APPROVALS")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("managerLeave.title", "Team Leave Approvals")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerLeave.subtitle",
            "Keep your team aligned, supported, and moving forward."
          )}
        </p>
      </motion.div>

      {/* ======================================
          2. LEAVE APPROVALS TABLE CARD
      ====================================== */}
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#f8fafc]/60 border-b border-[#f1f5f9] text-[11px] font-bold tracking-wider text-[#94a3b8]">
                <th className="py-4 px-6">{t("managerLeave.table.member", "MEMBER")}</th>
                <th className="py-4 px-6">{t("managerLeave.table.leaveType", "LEAVE TYPE")}</th>
                <th className="py-4 px-6">{t("managerLeave.table.dates", "DATES")}</th>
                <th className="py-4 px-6">{t("managerLeave.table.days", "DAYS")}</th>
                <th className="py-4 px-6">{t("managerLeave.table.reason", "REASON")}</th>
                <th className="py-4 px-6 text-right rtl:text-left">
                  <span className="sr-only">{t("common.actions", "Actions")}</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f1f5f9]">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-[#f8fafc]/40 transition"
                >
                  {/* Member Name */}
                  <td className="py-5 px-6 text-sm font-semibold text-[#102a43]">
                    {request.name}
                  </td>

                  {/* Leave Type */}
                  <td className="py-5 px-6 text-sm text-[#475569]">
                    {t(
                      `managerLeave.leaveTypes.${request.leaveTypeKey}`,
                      request.defaultLeaveType
                    )}
                  </td>

                  {/* Dates */}
                  <td className="py-5 px-6 text-sm text-[#475569]">
                    {request.dates}
                  </td>

                  {/* Days */}
                  <td className="py-5 px-6 text-sm text-[#475569]">
                    {request.days}
                  </td>

                  {/* Reason */}
                  <td className="py-5 px-6 text-sm text-[#475569]">
                    {t(
                      `managerLeave.reasons.${request.reasonKey}`,
                      request.defaultReason
                    )}
                  </td>

                  {/* Actions / Status */}
                  <td className="py-5 px-6 text-right rtl:text-left whitespace-nowrap">
                    {request.status === "pending" ? (
                      <div className="inline-flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleDecision(request.id, "approved")}
                          className="text-xs font-semibold text-[#059669] hover:text-[#047857] transition"
                        >
                          {t("managerLeave.actions.approve", "Approve")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(request.id, "rejected")}
                          className="text-xs font-semibold text-[#dc2626] hover:text-[#b91c1c] transition"
                        >
                          {t("managerLeave.actions.decline", "Decline")}
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          request.status === "approved"
                            ? "bg-[#ecfdf5] text-[#059669]"
                            : "bg-[#fef2f2] text-[#ef4444]"
                        }`}
                      >
                        {request.status === "approved"
                          ? t("managerLeave.statusApproved", "Approved")
                          : t("managerLeave.statusDeclined", "Declined")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] text-[#64748b]">
              <FiCalendar size={18} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[#102a43]">
              {t("managerLeave.empty.title", "No leave requests pending")}
            </h3>
            <p className="mt-1 text-xs text-[#94a3b8]">
              {t("managerLeave.empty.description", "All team leave requests have been reviewed.")}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TeamLeaveApprovals;