import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiDownload, FiX, FiCheck, FiDollarSign } from "react-icons/fi";

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

export default function Payroll() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language || "en";
  const isArabic = currentLang?.startsWith("ar");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [workflowDetails, setWorkflowDetails] = useState("");
  const [workflowOwner, setWorkflowOwner] = useState("");

  const content = {
    en: {
      title: "Payroll",
      subtitle: "Monthly compensation execution center.",
      runBtn: "Finalize & Run Payroll",
      badgeText: "September 2026 · Ready",
      formulaText:
        "Net Salary = Basic Salary + Bonuses - Deductions - Loan Installments",
      totalPayoutLabel: "total net payout",

      tableTitle: "Payslips",

      colEmployee: "EMPLOYEE",
      colBasicPay: "BASIC PAY",
      colBonuses: "BONUSES (+)",
      colDeductions: "DEDUCTIONS (-)",
      colAdvance: "ADVANCE (-)",
      colNetPayout: "NET PAYOUT",
      colStatus: "STATUS",
      colAction: "ACTION",

      statusReady: "Ready",
      statusPending: "Pending Approval",
      generatePdf: "Generate PDF",

      modalTitle: "Create workflow record",
      labelDetails: "Details",
      placeholderDetails: "Details",
      labelOwner: "Owner",
      placeholderOwner: "Owner",
      cancelBtn: "Cancel",
      saveBtn: "Save changes",
      successTitle: "Payroll executed successfully",
      doneBtn: "Done",
    },

    ar: {
      title: "كشوف المرتبات",
      subtitle: "مركز تنفيذ التعويضات الشهرية.",
      runBtn: "إنهاء وتشغيل الرواتب",
      badgeText: "سبتمبر 2026 · جاهز",
      formulaText:
        "الراتب الصافي = الراتب الأساسي + المكافآت - الاستقطاعات - أقساط السلف",
      totalPayoutLabel: "إجمالي الصافي المستحق",

      tableTitle: "قسائم الرواتب",

      colEmployee: "الموظف",
      colBasicPay: "الراتب الأساسي",
      colBonuses: "المكافآت (+)",
      colDeductions: "الاستقطاعات (-)",
      colAdvance: "السلف (-)",
      colNetPayout: "الصافي المستحق",
      colStatus: "الحالة",
      colAction: "الإجراء",

      statusReady: "جاهز",
      statusPending: "قيد الموافقة",
      generatePdf: "إنشاء PDF",

      modalTitle: "إنشاء سجل سير العمل",
      labelDetails: "التفاصيل",
      placeholderDetails: "التفاصيل",
      labelOwner: "المالك",
      placeholderOwner: "المالك",
      cancelBtn: "إلغاء",
      saveBtn: "حفظ التغييرات",
      successTitle: "تم تنفيذ كشوف الرواتب بنجاح",
      doneBtn: "تم",
    },
  };

  const t = isArabic ? content.ar : content.en;

  const handleSaveWorkflow = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setWorkflowDetails("");
    setWorkflowOwner("");
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
          <FiZap size={15} />
          {t.runBtn}
        </button>
      </motion.div>

      {/* ================= SUMMARY CARD ================= */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            {/* Status Badge */}
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border border-[#d1fae5]
                bg-[#ecfdf5]
                px-3
                py-1
                text-xs
                font-semibold
                text-[#059669]
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              {t.badgeText}
            </span>

            {/* Formula */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
                <FiDollarSign size={17} />
              </div>

              <p className="max-w-3xl text-sm font-semibold leading-6 text-[#1e293b]">
                {t.formulaText}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="rounded-xl bg-[#f8fafc] px-5 py-4 md:min-w-[220px]">
            <p className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
              {t.totalPayoutLabel}
            </p>

            <p className="mt-1 text-[27px] font-bold tracking-tight text-[#0f172a]">
              $184,500
            </p>
          </div>
        </div>
      </motion.div>

      {/* ================= PAYSLIPS ================= */}
      <motion.div
        variants={itemVariants}
        className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
            <FiDollarSign size={17} />
          </div>

          <h2 className="text-base font-bold text-[#1e293b]">{t.tableTitle}</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className={`w-full min-w-[1050px] border-collapse ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colEmployee}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colBasicPay}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colBonuses}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colDeductions}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colAdvance}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colNetPayout}
                </th>

                <th className="p-5 text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase">
                  {t.colStatus}
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
              {/* ================= ROW 1 ================= */}
              <tr className="border-b border-[#f1f5f9] transition hover:bg-[#f8fafc]">
                <td className="p-5 font-bold text-[#1e293b]">Youssef Lotfy</td>

                <td className="p-5 text-[#475569]">$3,200</td>

                <td className="p-5 text-[#475569]">+$250</td>

                <td className="p-5 text-[#64748b]">-$0</td>

                <td className="p-5 text-[#64748b]">-$0</td>

                <td className="p-5 font-bold text-[#0f172a]">$3,450</td>

                <td className="p-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border border-[#d1fae5]
                      bg-[#ecfdf5]
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-[#059669]
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    {t.statusReady}
                  </span>
                </td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <button
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border border-[#e2e8f0]
                      bg-white
                      px-3.5
                      py-2
                      text-xs
                      font-semibold
                      text-[#475569]
                      transition
                      hover:bg-[#f8fafc]
                    "
                  >
                    <FiDownload size={13} />
                    {t.generatePdf}
                  </button>
                </td>
              </tr>

              {/* ================= ROW 2 ================= */}
              <tr className="border-b border-[#f1f5f9] transition hover:bg-[#f8fafc]">
                <td className="p-5 font-bold text-[#1e293b]">Mariam Hassan</td>

                <td className="p-5 text-[#475569]">$4,100</td>

                <td className="p-5 text-[#475569]">+$0</td>

                <td className="p-5 text-[#475569]">-$75</td>

                <td className="p-5 text-[#64748b]">-$0</td>

                <td className="p-5 font-bold text-[#0f172a]">$4,025</td>

                <td className="p-5">
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
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                    {t.statusPending}
                  </span>
                </td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <button
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border border-[#e2e8f0]
                      bg-white
                      px-3.5
                      py-2
                      text-xs
                      font-semibold
                      text-[#475569]
                      transition
                      hover:bg-[#f8fafc]
                    "
                  >
                    <FiDownload size={13} />
                    {t.generatePdf}
                  </button>
                </td>
              </tr>

              {/* ================= ROW 3 ================= */}
              <tr className="border-b border-[#f1f5f9] transition hover:bg-[#f8fafc]">
                <td className="p-5 font-bold text-[#1e293b]">Omar Khaled</td>

                <td className="p-5 text-[#475569]">$2,800</td>

                <td className="p-5 text-[#475569]">+$0</td>

                <td className="p-5 text-[#64748b]">-$0</td>

                <td className="p-5 text-[#475569]">-$400</td>

                <td className="p-5 font-bold text-[#0f172a]">$2,400</td>

                <td className="p-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border border-[#d1fae5]
                      bg-[#ecfdf5]
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-[#059669]
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    {t.statusReady}
                  </span>
                </td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <button
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border border-[#e2e8f0]
                      bg-white
                      px-3.5
                      py-2
                      text-xs
                      font-semibold
                      text-[#475569]
                      transition
                      hover:bg-[#f8fafc]
                    "
                  >
                    <FiDownload size={13} />
                    {t.generatePdf}
                  </button>
                </td>
              </tr>

              {/* ================= ROW 4 ================= */}
              <tr className="transition hover:bg-[#f8fafc]">
                <td className="p-5 font-bold text-[#1e293b]">Nour Adel</td>

                <td className="p-5 text-[#475569]">$3,600</td>

                <td className="p-5 text-[#475569]">+$0</td>

                <td className="p-5 text-[#64748b]">-$0</td>

                <td className="p-5 text-[#64748b]">-$0</td>

                <td className="p-5 font-bold text-[#0f172a]">$3,600</td>

                <td className="p-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border border-[#d1fae5]
                      bg-[#ecfdf5]
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-[#059669]
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    {t.statusReady}
                  </span>
                </td>

                <td className={`p-5 ${isArabic ? "text-left" : "text-right"}`}>
                  <button
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border border-[#e2e8f0]
                      bg-white
                      px-3.5
                      py-2
                      text-xs
                      font-semibold
                      text-[#475569]
                      transition
                      hover:bg-[#f8fafc]
                    "
                  >
                    <FiDownload size={13} />
                    {t.generatePdf}
                  </button>
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
                        {t.runBtn}
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
                  <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                    {/* Details */}
                    <div>
                      <label className="mb-2 block text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
                        {t.labelDetails}
                      </label>

                      <input
                        type="text"
                        value={workflowDetails}
                        onChange={(e) => setWorkflowDetails(e.target.value)}
                        placeholder={t.placeholderDetails}
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
                        {t.labelOwner}
                      </label>

                      <input
                        type="text"
                        value={workflowOwner}
                        onChange={(e) => setWorkflowOwner(e.target.value)}
                        placeholder={t.placeholderOwner}
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

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-2 border-t border-[#f1f5f9] px-6 py-4">
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
                      type="button"
                      onClick={handleSaveWorkflow}
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
