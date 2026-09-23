import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiCheck,
  FiUsers,
  FiBriefcase,
  FiActivity,
  FiLayers,
} from "react-icons/fi";

const content = {
  en: {
    title: "Departments & Teams",
    subtitle: "Manage organizational structure, leaders, and workstreams.",
    createBtn: "Create Department",
    searchPlaceholder: "Search departments...",

    headPrefix: "Head: ",
    headcountLabel: "Headcount",
    activeProjectsLabel: "Active projects",

    manageMembersBtn: "Manage Members",
    transferEmployeeBtn: "Transfer Employee",

    totalDepartments: "Total Departments",
    totalEmployees: "Total Employees",
    totalProjects: "Active Projects",
    avgAttendance: "Avg. Attendance",

    modalTitle: "Create Department",
    detailsLabel: "Department Name",
    detailsPlaceholder: "Enter department name",
    ownerLabel: "Department Head / Owner",
    ownerPlaceholder: "Enter leader name",

    cancelBtn: "Cancel",
    saveBtn: "Save changes",

    successTitle: "Saved successfully",
    successSubtitle: "The new department has been added successfully.",
    doneBtn: "Done",

    engineeringName: "Engineering",
    mariamHead: "Mariam Hassan",

    peopleName: "People & Culture",
    sarahHead: "Sarah Ahmed",

    salesName: "Sales",
    omarHead: "Omar Khaled",

    logisticsName: "Logistics",
    karimHead: "Karim Ashraf",

    att94: "94% attendance",
    att97: "97% attendance",
    att91: "91% attendance",
    att89: "89% attendance",

    noResults: "No departments found",
    results: "results",

    membersTitle: "Department Members",
    membersSubtitle: "Overview of current active headcount and capacity.",
    closeBtn: "Close",

    transferTitle: "Transfer Employee",
    transferSubtitle:
      "Select an employee and transfer them to this department.",
    employeePlaceholder: "Select employee",
    transferBtn: "Transfer Employee",
  },

  ar: {
    title: "الأقسام والفرق",
    subtitle: "إدارة الهيكل التنظيمي، القادة، ومسارات العمل.",
    createBtn: "إنشاء قسم",
    searchPlaceholder: "بحث عن الأقسام...",

    headPrefix: "رئيس القسم: ",
    headcountLabel: "عدد الموظفين",
    activeProjectsLabel: "المشاريع النشطة",

    manageMembersBtn: "إدارة الأعضاء",
    transferEmployeeBtn: "نقل موظف",

    totalDepartments: "إجمالي الأقسام",
    totalEmployees: "إجمالي الموظفين",
    totalProjects: "المشاريع النشطة",
    avgAttendance: "متوسط الحضور",

    modalTitle: "إنشاء قسم جديد",
    detailsLabel: "اسم القسم",
    detailsPlaceholder: "أدخل اسم القسم",
    ownerLabel: "رئيس القسم / المسؤول",
    ownerPlaceholder: "أدخل اسم المسؤول",

    cancelBtn: "إلغاء",
    saveBtn: "حفظ التغييرات",

    successTitle: "تم الحفظ بنجاح",
    successSubtitle: "تمت إضافة القسم الجديد بنجاح.",
    doneBtn: "تم",

    engineeringName: "الهندسة",
    mariamHead: "مريم حسن",

    peopleName: "الأفراد والثقافة",
    sarahHead: "سارة أحمد",

    salesName: "المبيعات",
    omarHead: "عمر خالد",

    logisticsName: "اللوجستيات",
    karimHead: "كريم أشرف",

    att94: "نسبة الحضور 94%",
    att97: "نسبة الحضور 97%",
    att91: "نسبة الحضور 91%",
    att89: "نسبة الحضور 89%",

    noResults: "لم يتم العثور على أقسام",
    results: "نتائج",

    membersTitle: "أعضاء القسم",
    membersSubtitle: "نظرة عامة على عدد الموظفين والسعة الحالية للقسم.",
    closeBtn: "إغلاق",

    transferTitle: "نقل موظف",
    transferSubtitle: "اختر موظفًا لنقله إلى هذا القسم.",
    employeePlaceholder: "اختر الموظف",
    transferBtn: "نقل الموظف",
  },
};

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
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.18 },
  },
};

export default function DepartmentsAndTeams() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");
  const t = content[isArabic ? "ar" : "en"];

  const [departments, setDepartments] = useState([
    {
      id: 1,
      nameKey: "engineeringName",
      headKey: "mariamHead",
      attendanceKey: "att94",
      headcount: 38,
      activeProjects: 12,
    },
    {
      id: 2,
      nameKey: "peopleName",
      headKey: "sarahHead",
      attendanceKey: "att97",
      headcount: 14,
      activeProjects: 5,
    },
    {
      id: 3,
      nameKey: "salesName",
      headKey: "omarHead",
      attendanceKey: "att91",
      headcount: 38,
      activeProjects: 9,
    },
    {
      id: 4,
      nameKey: "logisticsName",
      headKey: "karimHead",
      attendanceKey: "att89",
      headcount: 52,
      activeProjects: 18,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [details, setDetails] = useState("");
  const [owner, setOwner] = useState("");

  const [membersModal, setMembersModal] = useState(null);
  const [transferModal, setTransferModal] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const filteredDepartments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return departments;

    return departments.filter((dept) => {
      const name = dept.nameKey ? t[dept.nameKey] : dept.customName || "";
      const head = dept.headKey ? t[dept.headKey] : dept.customHead || "";

      return (
        name.toLowerCase().includes(query) || head.toLowerCase().includes(query)
      );
    });
  }, [departments, searchTerm, isArabic, t]);

  const totalEmployees = useMemo(
    () => departments.reduce((sum, dept) => sum + dept.headcount, 0),
    [departments],
  );

  const totalProjects = useMemo(
    () => departments.reduce((sum, dept) => sum + dept.activeProjects, 0),
    [departments],
  );

  const averageAttendance = useMemo(() => {
    if (departments.length === 0) return 0;

    const sumAttendance = departments.reduce((sum, dept) => {
      const attendanceText = dept.attendanceKey
        ? t[dept.attendanceKey]
        : dept.customAttendance || "";

      const match = attendanceText.match(/\d+/);

      return sum + (match ? Number(match[0]) : 0);
    }, 0);

    return Math.round(sumAttendance / departments.length);
  }, [departments, t]);

  const handleCreateDepartment = () => {
    setDetails("");
    setOwner("");
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const handleSaveDepartment = (e) => {
    e.preventDefault();

    if (!details.trim()) return;

    const newDept = {
      id: Date.now(),
      nameKey: null,
      customName: details.trim(),

      headKey: null,
      customHead: owner.trim() || (isArabic ? "غير محدد" : "Unassigned"),

      attendanceKey: null,
      customAttendance: isArabic ? "نسبة الحضور 90%" : "90% attendance",

      headcount: 1,
      activeProjects: 0,
    };

    setDepartments((prev) => [newDept, ...prev]);
    setIsSuccess(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setDetails("");
    setOwner("");
  };

  const openMembersModal = (department) => {
    setMembersModal(department);
  };

  const openTransferModal = (department) => {
    setSelectedEmployee("");
    setTransferModal(department);
  };

  const closeMembersModal = () => {
    setMembersModal(null);
  };

  const closeTransferModal = () => {
    setTransferModal(null);
    setSelectedEmployee("");
  };

  const handleTransfer = (e) => {
    e.preventDefault();

    if (!selectedEmployee || !transferModal) return;

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === transferModal.id
          ? { ...dept, headcount: dept.headcount + 1 }
          : dept,
      ),
    );

    closeTransferModal();
  };

  return (
    <motion.div
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ==================== Header ==================== */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
            {isArabic
              ? "الموارد البشرية / الأقسام والفرق"
              : "HR Portal / Departments & Teams"}
          </p>

          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
            {t.title}
          </h1>

          <p className="mt-1 text-sm font-normal text-[#64748b]">
            {t.subtitle}
          </p>
        </div>

        {/* Search + Create */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <div
              className={`pointer-events-none absolute inset-y-0 flex items-center ${
                isArabic ? "right-0 pr-3.5" : "left-0 pl-3.5"
              }`}
            >
              <FiSearch size={16} className="text-[#94a3b8]" />
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full rounded-lg border border-[#e2e8f0] bg-white py-2.5 text-xs text-[#334155] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:text-sm ${
                isArabic ? "pr-9 pl-3" : "pl-9 pr-3"
              }`}
            />
          </div>

          <motion.button
            type="button"
            onClick={handleCreateDepartment}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
          >
            <FiPlus className="h-4 w-4" />
            <span>{t.createBtn}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ==================== 4 Stat Cards ==================== */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Departments */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t.totalDepartments}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ff] text-[#8b5cf6]">
              <FiLayers className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              {departments.length}
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {t.totalDepartments}
            </p>
          </div>
        </motion.div>

        {/* Total Employees */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t.totalEmployees}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
              <FiUsers className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              {totalEmployees}
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {t.totalEmployees}
            </p>
          </div>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t.totalProjects}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#f97316]">
              <FiBriefcase className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              {totalProjects}
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {t.totalProjects}
            </p>
          </div>
        </motion.div>

        {/* Attendance */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -4,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t.avgAttendance}
            </p>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981]">
              <FiActivity className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
              {averageAttendance}%
            </p>

            <p className="mt-1 text-xs font-normal text-[#64748b]">
              {t.avgAttendance}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ==================== Results Header ==================== */}
      <motion.div variants={itemVariants}>
        <p className="text-xs font-normal text-[#64748b]">
          {filteredDepartments.length} {t.results}
        </p>
      </motion.div>

      {/* ==================== Departments ==================== */}
      {filteredDepartments.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredDepartments.map((department) => {
            const departmentName = department.nameKey
              ? t[department.nameKey]
              : department.customName;

            const departmentHead = department.headKey
              ? t[department.headKey]
              : department.customHead;

            const attendance = department.attendanceKey
              ? t[department.attendanceKey]
              : department.customAttendance;

            return (
              <motion.div
                key={department.id}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="group flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3ff] text-[#8b5cf6]">
                        <FiBriefcase className="h-[18px] w-[18px]" />
                      </div>

                      <h3 className="truncate text-sm font-bold text-[#1e293b] sm:text-base">
                        {departmentName}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#64748b]">
                        {t.headPrefix}
                        {departmentHead}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-bold text-[#16a34a] sm:text-xs">
                      {attendance}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#f8fafc] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] sm:text-xs">
                        {t.headcountLabel}
                      </p>

                      <p className="mt-1 text-base font-bold text-[#0f172a]">
                        {department.headcount}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] sm:text-xs">
                        {t.activeProjectsLabel}
                      </p>

                      <p className="mt-1 text-base font-bold text-[#0f172a]">
                        {department.activeProjects}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 space-y-2 border-t border-[#f1f5f9] pt-4">
                  <motion.button
                    type="button"
                    onClick={() => openMembersModal(department)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#243B53] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42]"
                  >
                    <FiUsers className="h-3.5 w-3.5" />
                    {t.manageMembersBtn}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => openTransferModal(department)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
                  >
                    {t.transferEmployeeBtn}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white py-12 text-center"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f8fafc] text-[#94a3b8]">
            <FiSearch className="h-[18px] w-[18px]" />
          </div>

          <p className="mt-3 text-xs font-semibold text-[#64748b] sm:text-sm">
            {t.noResults}
          </p>
        </motion.div>
      )}

      {/* ==================== Create Department Modal ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCreateModal}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]"
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-xl"
            >
              {!isSuccess ? (
                <>
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-5">
                    <div>
                      <h2 className="text-base font-bold text-[#1e293b]">
                        {t.modalTitle}
                      </h2>

                      <p className="mt-1 text-xs text-[#64748b]">
                        {t.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeCreateModal}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveDepartment} className="p-6">
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#475569]">
                          {t.detailsLabel}
                        </label>

                        <input
                          type="text"
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          placeholder={t.detailsPlaceholder}
                          autoFocus
                          className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#334155] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#475569]">
                          {t.ownerLabel}
                        </label>

                        <input
                          type="text"
                          value={owner}
                          onChange={(e) => setOwner(e.target.value)}
                          placeholder={t.ownerPlaceholder}
                          className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#334155] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={closeCreateModal}
                        className="flex-1 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#64748b] transition hover:bg-[#f8fafc] sm:text-sm"
                      >
                        {t.cancelBtn}
                      </button>

                      <button
                        type="submit"
                        disabled={!details.trim()}
                        className="flex-1 rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                      >
                        {t.saveBtn}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="px-6 py-9 text-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf5] text-[#10b981]"
                  >
                    <FiCheck className="h-[26px] w-[26px]" />
                  </motion.div>

                  <h2 className="mt-4 text-base font-bold text-[#1e293b] sm:text-lg">
                    {t.successTitle}
                  </h2>

                  <p className="mx-auto mt-1 max-w-xs text-xs text-[#64748b] sm:text-sm">
                    {t.successSubtitle}
                  </p>

                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="mt-6 w-full rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42] sm:text-sm"
                  >
                    {t.doneBtn}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Manage Members Modal ==================== */}
      <AnimatePresence>
        {membersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMembersModal}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]"
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-md rounded-2xl border border-[#e2e8f0]/80 bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
                    <FiUsers className="h-[18px] w-[18px]" />
                  </div>

                  <h2 className="text-base font-bold text-[#1e293b]">
                    {t.membersTitle}
                  </h2>

                  <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                    {membersModal.nameKey
                      ? t[membersModal.nameKey]
                      : membersModal.customName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeMembersModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 rounded-xl bg-[#f8fafc] p-4">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#64748b]">{t.headcountLabel}</span>

                  <span className="font-bold text-[#0f172a]">
                    {membersModal.headcount}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                  <div
                    className="h-full rounded-full bg-[#8b5cf6]"
                    style={{
                      width: `${Math.min(membersModal.headcount * 2, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#64748b] sm:text-sm">
                {t.membersSubtitle}
              </p>

              <button
                type="button"
                onClick={closeMembersModal}
                className="mt-6 w-full rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42] sm:text-sm"
              >
                {t.closeBtn}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Transfer Employee Modal ==================== */}
      <AnimatePresence>
        {transferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTransferModal}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]"
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-xl"
            >
              <div className="flex items-start justify-between border-b border-[#f1f5f9] px-6 py-5">
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6]">
                    <FiUsers className="h-[18px] w-[18px]" />
                  </div>

                  <h2 className="text-base font-bold text-[#1e293b]">
                    {t.transferTitle}
                  </h2>

                  <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                    {transferModal.nameKey
                      ? t[transferModal.nameKey]
                      : transferModal.customName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeTransferModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleTransfer} className="p-6">
                <p className="mb-5 text-xs text-[#64748b] sm:text-sm">
                  {t.transferSubtitle}
                </p>

                <label className="mb-1.5 block text-xs font-semibold text-[#475569]">
                  {t.employeePlaceholder}
                </label>

                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#334155] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:text-sm"
                >
                  <option value="">{t.employeePlaceholder}</option>

                  <option value="employee-1">
                    {isArabic ? "أحمد محمد" : "Ahmed Mohamed"}
                  </option>

                  <option value="employee-2">
                    {isArabic ? "سلمى علي" : "Salma Ali"}
                  </option>

                  <option value="employee-3">
                    {isArabic ? "يوسف خالد" : "Youssef Khaled"}
                  </option>
                </select>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={closeTransferModal}
                    className="flex-1 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#64748b] transition hover:bg-[#f8fafc] sm:text-sm"
                  >
                    {t.cancelBtn}
                  </button>

                  <button
                    type="submit"
                    disabled={!selectedEmployee}
                    className="flex-1 rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    {t.transferBtn}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
