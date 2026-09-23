import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const INITIAL_ATTENDANCE = [
  {
    id: 1,
    name: "Youssef Lotfy",
    shift: "09:00 - 17:00",
    checkIn: "08:51",
    delay: 0,
    verification: "GPS",
    waiver: false,
  },
  {
    id: 2,
    name: "Karim Ashraf",
    shift: "09:00 - 17:00",
    checkIn: "09:12",
    delay: 12,
    verification: "Biometric",
    waiver: false,
  },
  {
    id: 3,
    name: "Salma Nabil",
    shift: "09:00 - 17:00",
    checkIn: "08:53",
    delay: 0,
    verification: "GPS",
    waiver: false,
  },
  {
    id: 4,
    name: "Omar Fathy",
    shift: "09:00 - 17:00",
    checkIn: "08:54",
    delay: 0,
    verification: "Biometric",
    waiver: false,
  },
  {
    id: 5,
    name: "Nour Adel",
    shift: "09:00 - 17:00",
    checkIn: "08:55",
    delay: 0,
    verification: "GPS",
    waiver: false,
  },
];

const TeamAttendance = () => {
  const { t } = useTranslation();
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [toast, setToast] = useState(null);

  const handleExcuseWaiver = (member) => {
    setAttendance((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, waiver: true } : item
      )
    );

    setToast({
      message: t("managerAttendance.toast.success", {
        member: member.name,
        defaultValue: `Excuse waiver applied for ${member.name}`,
      }),
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* =====================================================
          1. BREADCRUMB + PAGE HEADER
      ====================================================== */}
      <motion.div variants={fadeUp} transition={{ duration: 0.2, ease: "easeOut" }}>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("managerAttendance.breadcrumb", "MANAGER PORTAL / TEAM ATTENDANCE")}
        </p>
        <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
          {t("managerAttendance.title", "Team Attendance")}
        </h1>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerAttendance.subtitle",
            "Keep your team aligned, supported, and moving forward."
          )}
        </p>
      </motion.div>

      {/* =====================================================
          2. ATTENDANCE TABLE CARD (Edge-to-edge UI match)
      ====================================================== */}
      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-[#f8fafc]/60 border-b border-[#f1f5f9] text-[11px] font-bold tracking-wider text-[#94a3b8]">
                <th className="py-4 px-6">{t("managerAttendance.table.member", "MEMBER")}</th>
                <th className="py-4 px-6">{t("managerAttendance.table.shift", "SHIFT")}</th>
                <th className="py-4 px-6">{t("managerAttendance.table.checkInTime", "CHECK-IN TIME")}</th>
                <th className="py-4 px-6">{t("managerAttendance.table.delayMinutes", "DELAY MINUTES")}</th>
                <th className="py-4 px-6">{t("managerAttendance.table.verification", "VERIFICATION")}</th>
                <th className="py-4 px-6 text-right rtl:text-left">
                  <span className="sr-only">{t("common.actions", "Actions")}</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f1f5f9]">
              {attendance.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-[#f8fafc]/40 transition"
                >
                  {/* Member Name */}
                  <td className="py-5 px-6 text-sm font-semibold text-[#1e293b]">
                    {member.name}
                  </td>

                  {/* Shift */}
                  <td className="py-5 px-6 text-sm text-[#64748b]">
                    {member.shift}
                  </td>

                  {/* Check-in Time */}
                  <td className="py-5 px-6 text-sm text-[#64748b]">
                    {member.checkIn}
                  </td>

                  {/* Delay Minutes Badge */}
                  <td className="py-5 px-6">
                    {member.waiver ? (
                      <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#059669]">
                        {t("managerAttendance.waived", "Waived")}
                      </span>
                    ) : member.delay > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-[#fefce8] px-3 py-1 text-xs font-semibold text-[#d97706]">
                        {member.delay} min
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#059669]">
                        0 min
                      </span>
                    )}
                  </td>

                  {/* Verification Pill */}
                  <td className="py-5 px-6">
                    <span className="inline-flex items-center rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-medium text-[#475569]">
                      {member.verification}
                    </span>
                  </td>

                  {/* Action: Manager Excuse Waiver in Red / Applied */}
                  <td className="py-5 px-6 text-right rtl:text-left">
                    {!member.waiver ? (
                      <button
                        type="button"
                        onClick={() => handleExcuseWaiver(member)}
                        className="text-xs font-semibold text-[#dc2626] hover:text-[#b91c1c] transition"
                      >
                        {t(
                          "managerAttendance.managerExcuseWaiver",
                          "Manager Excuse Waiver"
                        )}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-[#059669]">
                        {t(
                          "managerAttendance.waiverApplied",
                          "Waiver Applied"
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* =====================================================
          3. SUCCESS TOAST
      ====================================================== */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-lg"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-xs font-bold text-[#059669]">
              ✓
            </div>
            <p className="text-xs font-medium text-[#1e293b]">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamAttendance;