import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiCheck,
  FiDollarSign,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
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
  hidden: { opacity: 0, y: 14 },
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

export default function AdvancesAndDeductions() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language || "en";
  const isArabic = currentLang?.startsWith("ar");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [details, setDetails] = useState("");
  const [owner, setOwner] = useState("");

  const content = {
    en: {
      title: "Advances & Deductions",
      subtitle:
        "Control salary advances, penalties, and payroll-linked deductions.",
      recordBtn: "Record Manual Deduction",

      salarySection: "Salary Advance Requests",

      colEmployee: "EMPLOYEE",
      colRequestedAmount: "REQUESTED AMOUNT",
      colRepayment: "REPAYMENT",
      colMonthlyDeduction: "MONTHLY DEDUCTION",
      colReason: "REASON",
      colAction: "ACTION",

      approve: "Approve Advance",

      disciplinarySection: "Disciplinary & Delay Deductions",
      colPenaltyReason: "PENALTY REASON",
      colAmount: "AMOUNT",
      colDate: "DATE",
      colStatus: "STATUS",

      statusQueued: "Queued for Month-End Deduction",

      omarReason: "Emergency family expense",
      nourReason: "Medical expense",
      mariamReason: "Repeated unexcused delay",
      karimReason: "Policy breach",

      modalTitle: "Create workflow record",
      detailsLabel: "Details",
      detailsPlaceholder: "Details",
      ownerLabel: "Owner",
      ownerPlaceholder: "Owner",
      cancelBtn: "Cancel",
      saveBtn: "Save changes",
      successTitle: "Saved successfully",
      doneBtn: "Done",
    },

    ar: {
      title: "السلف والاستقطاعات",
      subtitle:
        "التحكم في سلف الرواتب، الجزاءات، والاستقطاعات المرتبطة بالرواتب.",
      recordBtn: "تسجيل استقطاع يدوي",

      salarySection: "طلبات سلف الرواتب",

      colEmployee: "الموظف",
      colRequestedAmount: "المبلغ المطلوب",
      colRepayment: "فترة السداد",
      colMonthlyDeduction: "الاستقطاع الشهري",
      colReason: "السبب",
      colAction: "الإجراء",

      approve: "موافقة على السلفة",

      disciplinarySection: "جزاءات التأخير والخصومات",
      colPenaltyReason: "سبب الجزاء",
      colAmount: "المبلغ",
      colDate: "التاريخ",
      colStatus: "الحالة",

      statusQueued: "مدرج للاستقطاع نهاية الشهر",

      omarReason: "مصروفات عائلية طارئة",
      nourReason: "مصروفات طبية",
      mariamReason: "تأخير متكرر بدون عذر",
      karimReason: "مخالفة للسياسة",

      modalTitle: "إنشاء سجل عمل جديد",
      detailsLabel: "التفاصيل",
      detailsPlaceholder: "التفاصيل",
      ownerLabel: "المسؤول",
      ownerPlaceholder: "المسؤول",
      cancelBtn: "إلغاء",
      saveBtn: "حفظ التغييرات",
      successTitle: "تم الحفظ بنجاح",
      doneBtn: "تم",
    },
  };

  const t = isArabic ? content.ar : content.en;

  const handleSave = (e) => {
    e.preventDefault();

    console.log({
      details,
      owner,
    });

    setIsSuccess(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setDetails("");
    setOwner("");
  };

  return (
    <motion.div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ================= HEADER ================= */}
      <motion.div
        variants={pageVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
            HR Management
          </p>

          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-normal text-[#64748b]">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsSuccess(false);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
        >
          <FiPlus size={16} />
          {t.recordBtn}
        </button>
      </motion.div>

      {/* ================= SALARY ADVANCES ================= */}
      <motion.div
        variants={itemVariants}
        className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
            <FiDollarSign size={17} />
          </div>

          <h2 className="text-base font-bold text-[#1e293b]">
            {t.salarySection}
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className={`w-full min-w-[900px] border-collapse ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colEmployee}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colRequestedAmount}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colRepayment}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colMonthlyDeduction}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colReason}
                </th>

                <th
                  className={`p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase ${
                    isArabic ? "text-left" : "text-right"
                  }`}
                >
                  {t.colAction}
                </th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {/* Omar */}
              <tr className="border-b border-[#f1f5f9] transition hover:bg-[#f8fafc]">
                <td className="p-5">
                  <span className="font-bold text-[#1e293b]">Omar Khaled</span>
                </td>

                <td className="p-5 font-medium text-[#475569]">$1,200</td>

                <td className="p-5 text-[#64748b]">3 Months</td>

                <td className="p-5 font-medium text-[#475569]">$400</td>

                <td className="p-5 text-xs text-[#64748b]">{t.omarReason}</td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <button
                    className="
                      rounded-lg
                      border border-[#d1fae5]
                      bg-[#ecfdf5]
                      px-4 py-2
                      text-xs
                      font-semibold
                      text-[#059669]
                      transition
                      hover:bg-[#d1fae5]
                    "
                  >
                    {t.approve}
                  </button>
                </td>
              </tr>

              {/* Nour */}
              <tr className="transition hover:bg-[#f8fafc]">
                <td className="p-5">
                  <span className="font-bold text-[#1e293b]">Nour Adel</span>
                </td>

                <td className="p-5 font-medium text-[#475569]">$800</td>

                <td className="p-5 text-[#64748b]">4 Months</td>

                <td className="p-5 font-medium text-[#475569]">$200</td>

                <td className="p-5 text-xs text-[#64748b]">{t.nourReason}</td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <button
                    className="
                      rounded-lg
                      border border-[#d1fae5]
                      bg-[#ecfdf5]
                      px-4 py-2
                      text-xs
                      font-semibold
                      text-[#059669]
                      transition
                      hover:bg-[#d1fae5]
                    "
                  >
                    {t.approve}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ================= DISCIPLINARY DEDUCTIONS ================= */}
      <motion.div
        variants={itemVariants}
        className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff7ed] text-[#f97316]">
            <FiAlertCircle size={17} />
          </div>

          <h2 className="text-base font-bold text-[#1e293b]">
            {t.disciplinarySection}
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className={`w-full min-w-[800px] border-collapse ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colEmployee}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colPenaltyReason}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colAmount}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colDate}
                </th>

                <th
                  className={`p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase ${
                    isArabic ? "text-left" : "text-right"
                  }`}
                >
                  {t.colStatus}
                </th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {/* Mariam */}
              <tr className="border-b border-[#f1f5f9] transition hover:bg-[#f8fafc]">
                <td className="p-5">
                  <span className="font-bold text-[#1e293b]">
                    Mariam Hassan
                  </span>
                </td>

                <td className="p-5 text-xs text-[#64748b]">{t.mariamReason}</td>

                <td className="p-5 font-medium text-[#475569]">$75</td>

                <td className="p-5 text-[#64748b]">Sep 15</td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border border-[#fed7aa]
                      bg-[#fff7ed]
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-[#c2410c]
                    "
                  >
                    <FiClock size={12} />
                    {t.statusQueued}
                  </span>
                </td>
              </tr>

              {/* Karim */}
              <tr className="transition hover:bg-[#f8fafc]">
                <td className="p-5">
                  <span className="font-bold text-[#1e293b]">Karim Ashraf</span>
                </td>

                <td className="p-5 text-xs text-[#64748b]">{t.karimReason}</td>

                <td className="p-5 font-medium text-[#475569]">$120</td>

                <td className="p-5 text-[#64748b]">Sep 12</td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border border-[#fed7aa]
                      bg-[#fff7ed]
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-[#c2410c]
                    "
                  >
                    <FiClock size={12} />
                    {t.statusQueued}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-xl"
            >
              {!isSuccess ? (
                <>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-5">
                    <div>
                      <h3 className="text-base font-bold text-[#1e293b]">
                        {t.modalTitle}
                      </h3>

                      <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                        {t.recordBtn}
                      </p>
                    </div>

                    <button
                      onClick={handleCloseModal}
                      className="rounded-lg p-2 text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <form onSubmit={handleSave} className="space-y-5 p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* Details */}
                      <div>
                        <label className="mb-2 block text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
                          {t.detailsLabel}
                        </label>

                        <input
                          type="text"
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          placeholder={t.detailsPlaceholder}
                          className="
                            w-full
                            rounded-lg
                            border border-[#e2e8f0]
                            bg-white
                            px-3
                            py-2.5
                            text-xs
                            text-[#475569]
                            outline-none
                            transition
                            placeholder:text-[#94a3b8]
                            focus:border-[#94a3b8]
                            focus:ring-2
                            focus:ring-[#f1f5f9]
                          "
                        />
                      </div>

                      {/* Owner */}
                      <div>
                        <label className="mb-2 block text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
                          {t.ownerLabel}
                        </label>

                        <input
                          type="text"
                          value={owner}
                          onChange={(e) => setOwner(e.target.value)}
                          placeholder={t.ownerPlaceholder}
                          className="
                            w-full
                            rounded-lg
                            border border-[#e2e8f0]
                            bg-white
                            px-3
                            py-2.5
                            text-xs
                            text-[#475569]
                            outline-none
                            transition
                            placeholder:text-[#94a3b8]
                            focus:border-[#94a3b8]
                            focus:ring-2
                            focus:ring-[#f1f5f9]
                          "
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 border-t border-[#f1f5f9] pt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="
                          rounded-lg
                          border border-[#e2e8f0]
                          bg-white
                          px-4
                          py-2.5
                          text-xs
                          font-semibold
                          text-[#475569]
                          transition
                          hover:bg-[#f8fafc]
                        "
                      >
                        {t.cancelBtn}
                      </button>

                      <button
                        type="submit"
                        className="
                          rounded-lg
                          bg-[#243B53]
                          px-4
                          py-2.5
                          text-xs
                          font-semibold
                          text-white
                          transition
                          hover:bg-[#1c2f42]
                        "
                      >
                        {t.saveBtn}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* ================= SUCCESS ================= */
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981]">
                    <FiCheck size={26} strokeWidth={2.5} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#1e293b]">
                    {t.successTitle}
                  </h3>

                  <button
                    onClick={handleCloseModal}
                    className="
                      mt-6
                      w-full
                      max-w-[180px]
                      rounded-lg
                      bg-[#243B53]
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#1c2f42]
                    "
                  >
                    {t.doneBtn}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
