import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiUserPlus,
  FiUsers,
  FiBriefcase,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";

const initialEmployees = [
  {
    id: 1,
    name: "Youssef Lotfy",
    code: "WW-00142",
    role: "Senior Product Designer",
    department: "Design",
    branch: "Cairo HQ",
    status: "Present",
    statusType: "success",
  },
  {
    id: 2,
    name: "Mariam Hassan",
    code: "WW-00118",
    role: "Engineering Manager",
    department: "Engineering",
    branch: "Cairo HQ",
    status: "Late",
    statusType: "warning",
  },
  {
    id: 3,
    name: "Omar Khaled",
    code: "WW-00087",
    role: "Sales Executive",
    department: "Sales",
    branch: "Alexandria Hub",
    status: "Present",
    statusType: "success",
  },
  {
    id: 4,
    name: "Nour Adel",
    code: "WW-00131",
    role: "People Operations Specialist",
    department: "People & Culture",
    branch: "Cairo HQ",
    status: "On leave",
    statusType: "info",
  },
  {
    id: 5,
    name: "Karim Ashraf",
    code: "WW-00054",
    role: "Operations Lead",
    department: "Operations",
    branch: "Alexandria Hub",
    status: "Absent",
    statusType: "danger",
  },
];

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

function EmployeesPage() {
  const { t: translate, i18n } = useTranslation();

  const currentLang = i18n.language || "en";
  const isArabic = currentLang.toLowerCase().startsWith("ar");

  const t = {
    breadcrumb: isArabic
      ? "بوابة الموارد البشرية / الموظفون"
      : "HR Portal / Employees",
    title: isArabic ? "الموظفون" : "Employees",
    subtitle: isArabic
      ? "إدارة سجلات الموظفين وبيانات القوى العاملة."
      : "Manage employee records and workforce information.",
    recordsCount: isArabic ? "سجلات الموظفين" : "employee records",
    addBtn: isArabic ? "إضافة موظف" : "Add Employee",
    searchPlaceholder: isArabic ? "البحث عن موظف..." : "Search employees...",
    employeeHeader: isArabic ? "الموظف" : "EMPLOYEE",
    roleHeader: isArabic ? "المسمى الوظيفي" : "ROLE",
    departmentHeader: isArabic ? "القسم" : "DEPARTMENT",
    branchHeader: isArabic ? "الفرع" : "BRANCH",
    statusHeader: isArabic ? "الحالة" : "STATUS",
    actionHeader: isArabic ? "الإجراء" : "ACTION",
    viewProfileBtn: isArabic ? "عرض الملف" : "View profile",
    modalTitle: isArabic ? "إنشاء سجل موظف" : "Create employee record",
    detailsLabel: isArabic ? "اسم الموظف" : "Employee Name",
    ownerLabel: isArabic ? "المسمى الوظيفي" : "Job Role",
    detailsPlaceholder: isArabic ? "اكتب اسم الموظف" : "Enter employee name",
    ownerPlaceholder: isArabic ? "اكتب المسمى الوظيفي" : "Enter job role",
    cancel: isArabic ? "إلغاء" : "Cancel",
    save: isArabic ? "حفظ الموظف" : "Save Employee",
    successTitle: isArabic ? "تمت إضافة الموظف" : "Employee added",
    successText: isArabic
      ? "تم إنشاء سجل الموظف بنجاح."
      : "The employee record has been created successfully.",
    done: isArabic ? "تم" : "Done",
    profileTitle: isArabic ? "ملف الموظف" : "Employee Profile",
    employeeId: isArabic ? "رقم الموظف" : "Employee ID",
    departmentLabel: isArabic ? "القسم" : "Department",
    branchLabel: isArabic ? "الفرع" : "Branch",
    statusLabel: isArabic ? "الحالة" : "Status",
    closeBtn: isArabic ? "إغلاق" : "Close",
    noResults: isArabic ? "لا توجد نتائج" : "No results found",
    noResultsText: isArabic
      ? "لم نتمكن من العثور على موظفين مطابقين لبحثك."
      : "We couldn't find any employees matching your search.",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [details, setDetails] = useState("");
  const [owner, setOwner] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const translatedEmployees = useMemo(() => {
    return employees;
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return translatedEmployees;

    return translatedEmployees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(value) ||
        employee.code.toLowerCase().includes(value) ||
        employee.role.toLowerCase().includes(value) ||
        employee.department.toLowerCase().includes(value) ||
        employee.branch.toLowerCase().includes(value)
      );
    });
  }, [searchTerm, translatedEmployees]);

  const getStatusLabel = (status) => {
    if (!isArabic) return status;
    const statusMap = {
      Present: "حاضر",
      Late: "متأخر",
      "On leave": "في إجازة",
      Absent: "غائب",
    };
    return statusMap[status] || status;
  };

  const getStatusClasses = (type) => {
    const styles = {
      success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      warning: "bg-amber-50 text-amber-700 border border-amber-100",
      info: "bg-blue-50 text-blue-700 border border-blue-100",
      danger: "bg-red-50 text-red-700 border border-red-100",
    };
    return styles[type] || styles.info;
  };

  const handleSave = () => {
    if (!details.trim() || !owner.trim()) return;

    const newEmployee = {
      id: Date.now(),
      name: details.trim(),
      code: `WW-${String(Math.floor(Math.random() * 90000) + 10000).slice(-5)}`,
      role: owner.trim(),
      department: isArabic ? "عام" : "General",
      branch: "Cairo HQ",
      status: "Present",
      statusType: "success",
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    setDetails("");
    setOwner("");
    setIsSuccess(true);
  };

  const openAddModal = () => {
    setDetails("");
    setOwner("");
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setDetails("");
    setOwner("");
  };

  const openProfile = (employee) => setSelectedEmployee(employee);
  const closeProfile = () => setSelectedEmployee(null);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className={`w-full min-w-0 ${isArabic ? "text-right" : "text-left"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="w-full">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <motion.div variants={itemVariants} className="min-w-0">
            <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
              {t.breadcrumb}
            </p>
            <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
              {t.title}
            </h1>
            <p className="text-sm text-[#64748b] mt-1 font-normal">
              {t.subtitle}
            </p>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={openAddModal}
            whileHover={{
              y: -1,
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(36,59,83,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            className="flex shrinking-0 items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c2f42]"
          >
            <FiUserPlus size={16} />
            {t.addBtn}
          </motion.button>
        </motion.div>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex flex-col gap-4 border-b border-[#f1f5f9] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b]">
                <FiUsers size={15} />
              </div>
              <div className="text-sm font-semibold text-[#64748b]">
                <span className="font-bold text-[#1e293b]">
                  {filteredEmployees.length}
                </span>{" "}
                {t.recordsCount}
              </div>
            </div>

            <motion.div
              animate={{
                boxShadow: searchTerm
                  ? "0 0 0 3px rgba(36,59,83,0.05)"
                  : "0 0 0 0 rgba(36,59,83,0)",
              }}
              className="relative w-full md:max-w-md"
            >
              <div
                className={`pointer-events-none absolute inset-y-0 flex items-center ${isArabic ? "right-0 pr-3.5" : "left-0 pl-3.5"}`}
              >
                <FiSearch size={17} className="text-[#94a3b8]" />
              </div>

              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${isArabic ? "pl-10 pr-10 text-right" : "pl-10 pr-10 text-left"}`}
              />

              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className={`absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#edf3f7] text-[#6d879d] transition hover:bg-[#e2ebf1] hover:text-[#315d80] ${isArabic ? "left-2" : "right-2"}`}
                  >
                    <FiX size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {t.employeeHeader}
                  </th>
                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {t.roleHeader}
                  </th>
                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {t.departmentHeader}
                  </th>
                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {t.branchHeader}
                  </th>
                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {t.statusHeader}
                  </th>
                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${isArabic ? "text-right" : "text-left"}`}
                  >
                    {t.actionHeader}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredEmployees.map((employee) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="transition-colors hover:bg-[#f8fafc]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#edf3f7] text-[#52728c]">
                          <FiUsers size={17} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#1e293b]">
                            {employee.name}
                          </div>
                          <div className="mt-0.5 text-xs text-[#64748b]">
                            {employee.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#475569]">
                        <FiBriefcase size={14} className="text-[#94a3b8]" />
                        {employee.role}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-[#f1f5f9] px-2.5 py-1.5 text-xs font-semibold text-[#475569]">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#475569]">
                        <FiMapPin size={14} className="text-[#94a3b8]" />
                        {employee.branch}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClasses(employee.statusType)}`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                        {getStatusLabel(employee.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <motion.button
                        type="button"
                        onClick={() => openProfile(employee)}
                        whileHover={{ x: isArabic ? -2 : 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-sm font-semibold text-[#2f6f4d] hover:text-[#23583c] transition shrinking-0 inline-flex items-center gap-1.5"
                      >
                        {t.viewProfileBtn}
                        <FiChevronRight
                          size={13}
                          className={isArabic ? "rotate-180" : ""}
                        />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-5 lg:hidden">
            <AnimatePresence mode="popLayout">
              {filteredEmployees.map((employee) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#1e293b]">
                          {employee.name}
                        </div>
                        <div className="mt-0.5 text-xs text-[#64748b]">
                          {employee.code}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClasses(employee.statusType)}`}
                    >
                      {getStatusLabel(employee.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <InfoBox
                      icon={<FiBriefcase size={14} />}
                      label={t.roleHeader}
                      value={employee.role}
                    />
                    <InfoBox
                      icon={<FiUsers size={14} />}
                      label={t.departmentHeader}
                      value={employee.department}
                    />
                    <InfoBox
                      icon={<FiMapPin size={14} />}
                      label={t.branchHeader}
                      value={employee.branch}
                    />
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => openProfile(employee)}
                    whileTap={{ scale: 0.98 }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
                  >
                    {t.viewProfileBtn}
                    <FiChevronRight
                      size={14}
                      className={isArabic ? "rotate-180" : ""}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredEmployees.length === 0 && (
            <EmptyState
              title={t.noResults}
              text={t.noResultsText}
              isArabic={isArabic}
            />
          )}
        </motion.div>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/50 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {!isSuccess ? (
                <>
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4 bg-[#f8fafc]">
                    <div>
                      <h2 className="text-base font-bold text-[#1e293b]">
                        {t.modalTitle}
                      </h2>
                      <p className="mt-1 text-xs text-[#64748b]">
                        {isArabic
                          ? "أدخل بيانات الموظف الجديدة."
                          : "Enter the new employee information."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b] transition hover:bg-[#e2e8f0] hover:text-[#1e293b]"
                    >
                      <FiX size={16} />
                    </button>
                  </div>

                  <div className="space-y-5 p-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                        {t.detailsLabel}
                      </label>
                      <input
                        type="text"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder={t.detailsPlaceholder}
                        className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${isArabic ? "text-right" : "text-left"}`}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                        {t.ownerLabel}
                      </label>
                      <input
                        type="text"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        placeholder={t.ownerPlaceholder}
                        className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${isArabic ? "text-right" : "text-left"}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
                    >
                      {t.cancel}
                    </button>
                    <motion.button
                      type="button"
                      onClick={handleSave}
                      whileTap={{ scale: 0.98 }}
                      disabled={!details.trim() || !owner.trim()}
                      className="rounded-lg bg-[#243B53] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c2f42] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.save}
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="px-6 py-10 text-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                  >
                    <FiCheck size={26} />
                  </motion.div>
                  <h2 className="mt-5 text-lg font-bold text-[#1e293b]">
                    {t.successTitle}
                  </h2>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#64748b]">
                    {t.successText}
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-8 rounded-lg bg-[#243B53] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
                  >
                    {t.done}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/50 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeProfile();
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <div className="relative border-b border-[#e2e8f0] px-6 pb-6 pt-7 bg-[#f8fafc]">
                <button
                  type="button"
                  onClick={closeProfile}
                  className={`absolute top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b] transition hover:bg-[#e2e8f0] hover:text-[#1e293b] ${isArabic ? "left-5" : "right-5"}`}
                >
                  <FiX size={16} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b]">
                    <FiUsers size={21} />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-[21px] font-bold text-[#1e293b]">
                      {selectedEmployee.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#64748b]">
                      {selectedEmployee.code}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-6 bg-white">
                <ProfileRow
                  icon={<FiBriefcase size={15} />}
                  label={t.roleHeader}
                  value={selectedEmployee.role}
                />
                <ProfileRow
                  icon={<FiUsers size={15} />}
                  label={t.departmentLabel}
                  value={selectedEmployee.department}
                />
                <ProfileRow
                  icon={<FiMapPin size={15} />}
                  label={t.branchLabel}
                  value={selectedEmployee.branch}
                />
                <ProfileRow
                  icon={<FiCheck size={15} />}
                  label={t.statusLabel}
                  value={getStatusLabel(selectedEmployee.status)}
                  valueClass={getStatusClasses(selectedEmployee.statusType)}
                />
              </div>

              <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-5">
                <button
                  type="button"
                  onClick={closeProfile}
                  className="w-full rounded-lg bg-[#243B53] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
                >
                  {t.closeBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Components Outside Main Function

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-[#f8fafb] p-4 border border-[#f1f5f9]">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-[#1e293b]">{value}</div>
    </div>
  );
}

function ProfileRow({ icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f8fafb] px-4 py-3.5 border border-[#f1f5f9]">
      <div className="flex items-center gap-2.5 text-sm font-medium text-[#64748b]">
        {icon}
        {label}
      </div>
      <div
        className={`text-sm font-semibold ${valueClass || "text-[#1e293b]"}`}
      >
        {value}
      </div>
    </div>
  );
}

function EmptyState({ title, text, isArabic }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5f9] text-[#94a3b8]">
        <FiSearch size={28} />
      </div>
      <h3 className="mt-5 text-base font-bold text-[#1e293b]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#64748b]">
        {text}
      </p>
    </motion.div>
  );
}

export default EmployeesPage;
