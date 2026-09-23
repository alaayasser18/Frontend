import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiChevronDown,
  FiDownload,
  FiFileText,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const Reports = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");

  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [department, setDepartment] = useState("all");
  const [branch, setBranch] = useState("all");

  const [toast, setToast] = useState(null);

  // ==================== Motion Variants ====================

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

  // ==================== Date Range ====================

  const months = useMemo(
    () => [
      {
        value: "2026-09",
        label: t("reports.september2026"),
      },
      {
        value: "2026-08",
        label: t("reports.august2026"),
      },
      {
        value: "2026-07",
        label: t("reports.july2026"),
      },
      {
        value: "2026-06",
        label: t("reports.june2026"),
      },
    ],
    [t],
  );

  // ==================== Departments ====================

  const departments = [
    {
      value: "all",
      label: t("reports.allDepartments"),
    },
    {
      value: "engineering",
      label: t("reports.engineering"),
    },
    {
      value: "sales",
      label: t("reports.sales"),
    },
  ];

  // ==================== Branches ====================

  const branches = [
    {
      value: "all",
      label: t("reports.allBranches"),
    },
    {
      value: "cairo",
      label: t("reports.cairoHq"),
    },
    {
      value: "alexandria",
      label: t("reports.alexandriaHub"),
    },
  ];

  // ==================== Reports ====================

  const reports = [
    {
      id: "attendance",
      formats: ["PDF", "CSV"],
      title: t("reports.attendance.title"),
      description: t("reports.attendance.description"),
    },
    {
      id: "payroll",
      formats: ["Excel", "PDF"],
      title: t("reports.payroll.title"),
      description: t("reports.payroll.description"),
    },
    {
      id: "leave",
      formats: ["CSV"],
      title: t("reports.leave.title"),
      description: t("reports.leave.description"),
    },
    {
      id: "skills",
      formats: ["PDF"],
      title: t("reports.skills.title"),
      description: t("reports.skills.description"),
    },
  ];

  // =====================================================
  // Get Selected Filters
  // =====================================================

  const getSelectedMonthLabel = () => {
    const selected = months.find((month) => month.value === selectedMonth);

    return selected?.label || selectedMonth;
  };

  const getSelectedDepartmentLabel = () => {
    const selected = departments.find((item) => item.value === department);

    return selected?.label || department;
  };

  const getSelectedBranchLabel = () => {
    const selected = branches.find((item) => item.value === branch);

    return selected?.label || branch;
  };

  // =====================================================
  // Toast
  // =====================================================

  const showSuccessToast = (report) => {
    setToast({
      type: "success",
      message: isArabic
        ? `تم تصدير "${report.title}" بنجاح`
        : `"${report.title}" exported successfully`,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // =====================================================
  // CSV Export
  // =====================================================

  const exportCSV = (report) => {
    const rows = [
      ["Report", report.title],
      ["Description", report.description],
      ["Date Range", getSelectedMonthLabel()],
      ["Department", getSelectedDepartmentLabel()],
      ["Branch", getSelectedBranchLabel()],
      ["Status", "Exported successfully"],
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value ?? "").replace(/"/g, '""');

            return `"${safeValue}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${report.id}-report.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // Excel Export
  // =====================================================

  const exportExcel = (report) => {
    const data = [
      {
        Report: report.title,
        Description: report.description,
        "Date Range": getSelectedMonthLabel(),
        Department: getSelectedDepartmentLabel(),
        Branch: getSelectedBranchLabel(),
        Status: "Exported successfully",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet["!cols"] = [
      { wch: 35 },
      { wch: 65 },
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, `${report.id}-report.xlsx`);
  };

  // =====================================================
  // PDF Export
  // =====================================================

  const exportPDF = (report) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(28, 54, 79);

    doc.text(report.title, 20, 25);

    doc.setFontSize(11);
    doc.setTextColor(90, 110, 130);

    const descriptionLines = doc.splitTextToSize(
      report.description,
      pageWidth - 40,
    );

    doc.text(descriptionLines, 20, 38);

    doc.setDrawColor(220, 229, 236);

    doc.line(20, 55, pageWidth - 20, 55);

    doc.setFontSize(11);
    doc.setTextColor(28, 54, 79);

    doc.text("Report Information", 20, 72);

    doc.setFontSize(10);
    doc.setTextColor(80, 95, 110);

    doc.text(`Date Range: ${getSelectedMonthLabel()}`, 20, 87);

    doc.text(`Department: ${getSelectedDepartmentLabel()}`, 20, 101);

    doc.text(`Branch: ${getSelectedBranchLabel()}`, 20, 115);

    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 129);

    doc.setFontSize(11);
    doc.setTextColor(38, 132, 92);

    doc.text("Status: Exported successfully", 20, 150);

    doc.setFontSize(9);
    doc.setTextColor(130, 145, 160);

    doc.text("Workforce Reports", 20, 280);

    doc.text("Generated by Smart HR", pageWidth - 20, 280, {
      align: "right",
    });

    doc.save(`${report.id}-report.pdf`);
  };

  // =====================================================
  // Export Report
  // =====================================================

  const handleExport = (report) => {
    try {
      report.formats.forEach((format) => {
        if (format === "CSV") {
          exportCSV(report);
        }

        if (format === "Excel") {
          exportExcel(report);
        }

        if (format === "PDF") {
          exportPDF(report);
        }
      });

      showSuccessToast(report);
    } catch (error) {
      console.error("Report export failed:", error);

      setToast({
        type: "error",
        message: isArabic
          ? "حدث خطأ أثناء تصدير التقرير"
          : "Something went wrong while exporting the report",
      });

      setTimeout(() => {
        setToast(null);
      }, 3500);
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <>
      <motion.div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* ==================== HEADER ==================== */}

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
              HR / REPORTS
            </div>

            <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
              {t("reports.title")}
            </h1>

            <p className="mt-1 text-sm font-normal text-[#64748b]">
              {t("reports.subtitle")}
            </p>
          </div>
        </motion.div>

        {/* ==================== EXPORT COCKPIT ==================== */}

        <motion.section
          variants={itemVariants}
          className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          {/* Section Header */}

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
              <FiFileText className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#1e293b]">
                {t("reports.exportCockpit")}
              </h2>

              <p className="mt-0.5 text-xs font-normal text-[#64748b]">
                {isArabic
                  ? "اختار الفلاتر المطلوبة قبل تصدير التقرير"
                  : "Choose the required filters before exporting the report"}
              </p>
            </div>
          </div>

          {/* Filters */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Date Range */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#475569]">
                {t("reports.dateRange")}
              </label>

              <div className="relative">
                <div
                  className={`pointer-events-none absolute top-0 z-10 flex h-10 w-10 items-center justify-center text-[#94a3b8] ${
                    isArabic ? "right-0" : "left-0"
                  }`}
                >
                  <FiCalendar className="h-4 w-4" />
                </div>

                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={`h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white text-xs font-medium text-[#475569] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] ${
                    isArabic ? "pr-10 pl-9" : "pl-10 pr-9"
                  }`}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                <div
                  className={`pointer-events-none absolute top-0 z-10 flex h-10 w-8 items-center justify-center text-[#94a3b8] ${
                    isArabic ? "left-0" : "right-0"
                  }`}
                >
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Department */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#475569]">
                {t("reports.department")}
              </label>

              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white text-xs font-medium text-[#475569] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] ${
                    isArabic ? "pr-3 pl-9" : "pl-3 pr-9"
                  }`}
                >
                  {departments.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <div
                  className={`pointer-events-none absolute top-0 z-10 flex h-10 w-8 items-center justify-center text-[#94a3b8] ${
                    isArabic ? "left-0" : "right-0"
                  }`}
                >
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Branch */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-[#475569]">
                {t("reports.branch")}
              </label>

              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className={`h-10 w-full appearance-none rounded-lg border border-[#e2e8f0] bg-white text-xs font-medium text-[#475569] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] ${
                    isArabic ? "pr-3 pl-9" : "pl-3 pr-9"
                  }`}
                >
                  {branches.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <div
                  className={`pointer-events-none absolute top-0 z-10 flex h-10 w-8 items-center justify-center text-[#94a3b8] ${
                    isArabic ? "left-0" : "right-0"
                  }`}
                >
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==================== REPORTS ==================== */}

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {reports.map((report) => (
            <motion.article
              key={report.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="flex min-h-[205px] flex-col rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
            >
              {/* Card Header */}

              <div className="flex items-start justify-between gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
                  <FiFileText className="h-4 w-4" />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  {report.formats.map((format) => (
                    <span
                      key={format}
                      className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] font-bold text-[#64748b]"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}

              <div className="mt-4 flex-1">
                <h3 className="text-sm font-bold text-[#1e293b]">
                  {report.title}
                </h3>

                <p className="mt-1.5 text-xs font-normal leading-5 text-[#64748b]">
                  {report.description}
                </p>
              </div>

              {/* Action */}

              <div className="mt-5 border-t border-[#f1f5f9] pt-4">
                <motion.button
                  type="button"
                  onClick={() => handleExport(report)}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42]"
                >
                  <FiDownload className="h-4 w-4" />

                  {t("reports.exportReport")}
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>

      {/* ==================== TOAST ==================== */}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className={`fixed bottom-6 z-[9999] flex min-h-[52px] max-w-[380px] items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
              isArabic ? "left-6" : "right-6"
            } ${
              toast.type === "success" ? "border-[#d1fae5]" : "border-[#fecaca]"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                toast.type === "success"
                  ? "bg-[#ecfdf5] text-[#10b981]"
                  : "bg-[#fef2f2] text-[#ef4444]"
              }`}
            >
              {toast.type === "success" ? (
                <FiCheckCircle className="h-4 w-4" />
              ) : (
                <FiX className="h-4 w-4" />
              )}
            </div>

            <span
              className={`flex-1 text-xs font-semibold leading-5 ${
                toast.type === "success" ? "text-[#047857]" : "text-[#b91c1c]"
              }`}
            >
              {toast.message}
            </span>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
            >
              <FiX className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Reports;
