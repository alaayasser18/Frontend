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
  FiChevronDown,
} from "react-icons/fi";

import { useEmployees, useCreateEmployee } from "../hooks/useEmployees";
import { usePermissions } from "../hooks/usePermissions";

// =====================================================
// ANIMATIONS
// =====================================================

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
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
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

// =====================================================
// EMPLOYEES PAGE
// =====================================================

function EmployeesPage() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language || "en";
  const isArabic = currentLang.toLowerCase().startsWith("ar");

  // =====================================================
  // API / REACT QUERY
  // =====================================================

  const { data: employeesResponse } = useEmployees({}, currentLang);

  const { data: permissionsResponse } = usePermissions(currentLang);

  const createEmployeeMutation = useCreateEmployee(currentLang);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Employee",
    employment_type: "Full-time",
    department_id: "",
    start_date: "",
    phone: "",
    address: "",
    permissions: [],
  });

  // =====================================================
  // TRANSLATIONS
  // =====================================================

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

  // =====================================================
  // UI STATE
  // =====================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [details, setDetails] = useState("");
  const [owner, setOwner] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Permissions dropdown state
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  // =====================================================
  // EMPLOYEES FROM API
  // =====================================================

  const employees = useMemo(() => {
    const response = employeesResponse;

    if (Array.isArray(response?.data)) {
      return response.data.map((employee) => ({
        id: employee.id,

        name: employee.name || "-",

        code: employee.employee_code || employee.code || employee.id || "-",

        role: employee.job_title || employee.role_label || employee.role || "-",

        department:
          employee.department?.name || employee.department_name || "-",

        branch:
          employee.company_location?.name ||
          employee.branch ||
          employee.branch_name ||
          "-",

        status: employee.status || "Present",

        statusType: "success",
      }));
    }

    return [];
  }, [employeesResponse]);

  // =====================================================
  // PERMISSIONS FROM API
  // =====================================================

  const permissions = useMemo(() => {
    if (Array.isArray(permissionsResponse?.data)) {
      return permissionsResponse.data;
    }

    return [];
  }, [permissionsResponse]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredEmployees = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return employees;

    return employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(value) ||
        employee.code.toString().toLowerCase().includes(value) ||
        employee.role.toLowerCase().includes(value) ||
        employee.department.toLowerCase().includes(value) ||
        employee.branch.toLowerCase().includes(value)
      );
    });
  }, [searchTerm, employees]);

  // =====================================================
  // STATUS
  // =====================================================

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

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // SAVE EMPLOYEE
  // =====================================================

  const handleSave = async () => {
    if (
      !details.trim() ||
      !owner.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.start_date
    ) {
      return;
    }

    if (
      (formData.role === "Employee" || formData.role === "Manager") &&
      !formData.department_id
    ) {
      return;
    }

    if (formData.password.length < 8) {
      return;
    }

    const payload = {
      name: details.trim(),

      email: formData.email.trim(),

      password: formData.password,

      job_title: owner.trim(),

      role: formData.role,

      employment_type: formData.employment_type,

      start_date: formData.start_date,

      department_id: formData.department_id
        ? Number(formData.department_id)
        : null,

      phone: formData.phone.trim() || null,

      address: formData.address.trim() || null,

      permissions: formData.permissions,
    };

    try {
      await createEmployeeMutation.mutateAsync(payload);

      setDetails("");
      setOwner("");

      setFormData({
        email: "",
        password: "",
        role: "Employee",
        employment_type: "Full-time",
        department_id: "",
        start_date: "",
        phone: "",
        address: "",
        permissions: [],
      });

      setIsPermissionsOpen(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Create employee failed:", error);
    }
  };

  // =====================================================
  // ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setDetails("");
    setOwner("");

    setFormData({
      email: "",
      password: "",
      role: "Employee",
      employment_type: "Full-time",
      department_id: "",
      start_date: "",
      phone: "",
      address: "",
      permissions: [],
    });

    setIsPermissionsOpen(false);

    createEmployeeMutation.reset();

    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (createEmployeeMutation.isPending) {
      return;
    }

    setIsModalOpen(false);
    setIsSuccess(false);
    setIsPermissionsOpen(false);

    setDetails("");
    setOwner("");

    setFormData({
      email: "",
      password: "",
      role: "Employee",
      employment_type: "Full-time",
      department_id: "",
      start_date: "",
      phone: "",
      address: "",
      permissions: [],
    });

    createEmployeeMutation.reset();
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const openProfile = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeProfile = () => {
    setSelectedEmployee(null);
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className={`w-full min-w-0 ${isArabic ? "text-right" : "text-left"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="w-full">
        {/* =================================================
            HEADER
        ================================================= */}

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

        {/* =================================================
            MAIN CONTAINER
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.08,
          }}
          className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          {/* SEARCH */}
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
                className={`pointer-events-none absolute inset-y-0 flex items-center ${
                  isArabic ? "right-0 pr-3.5" : "left-0 pl-3.5"
                }`}
              >
                <FiSearch size={17} className="text-[#94a3b8]" />
              </div>

              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${
                  isArabic ? "pl-10 pr-10 text-right" : "pl-10 pr-10 text-left"
                }`}
              />

              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className={`absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#edf3f7] text-[#6d879d] transition hover:bg-[#e2ebf1] hover:text-[#315d80] ${
                      isArabic ? "left-2" : "right-2"
                    }`}
                  >
                    <FiX size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {t.employeeHeader}
                  </th>

                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {t.roleHeader}
                  </th>

                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {t.departmentHeader}
                  </th>

                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {t.branchHeader}
                  </th>

                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {t.statusHeader}
                  </th>

                  <th
                    className={`px-5 py-4 text-[11px] font-bold tracking-wider text-[#94a3b8] ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {t.actionHeader}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredEmployees.map((employee) => (
                  <motion.tr
                    key={employee.id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
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
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClasses(
                          employee.statusType,
                        )}`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                        {getStatusLabel(employee.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <motion.button
                        type="button"
                        onClick={() => openProfile(employee)}
                        whileHover={{
                          x: isArabic ? -2 : 2,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
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

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="grid gap-4 p-5 lg:hidden">
            <AnimatePresence mode="popLayout">
              {filteredEmployees.map((employee) => (
                <motion.div
                  key={employee.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
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
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClasses(
                        employee.statusType,
                      )}`}
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
                    whileTap={{
                      scale: 0.98,
                    }}
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

          {/* EMPTY STATE */}

          {filteredEmployees.length === 0 && (
            <EmptyState
              title={t.noResults}
              text={t.noResultsText}
              isArabic={isArabic}
            />
          )}
        </motion.div>
      </div>

      {/* =====================================================
          ADD EMPLOYEE MODAL
      ===================================================== */}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/50 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {!isSuccess ? (
                <>
                  {/* MODAL HEADER */}

                  <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-4">
                    <div>
                      <h2 className="text-base font-bold text-[#1e293b]">
                        {t.modalTitle}
                      </h2>

                      <p className="mt-1 text-xs text-[#64748b]">
                        {isArabic
                          ? "أدخل بيانات الموظف."
                          : "Enter employee information."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={createEmployeeMutation.isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b] transition hover:bg-[#e2e8f0] hover:text-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiX size={16} />
                    </button>
                  </div>

                  {/* MODAL BODY */}

                  <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
                    {/* NAME + EMAIL */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "اسم الموظف" : "Employee Name"}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          placeholder={
                            isArabic ? "اكتب اسم الموظف" : "Enter employee name"
                          }
                          className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${
                            isArabic ? "text-right" : "text-left"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "البريد الإلكتروني" : "Email"}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleFormChange("email", e.target.value)
                          }
                          placeholder="example@email.com"
                          className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${
                            isArabic ? "text-right" : "text-left"
                          }`}
                        />
                      </div>
                    </div>

                    {/* PASSWORD + JOB TITLE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "كلمة المرور" : "Password"}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            handleFormChange("password", e.target.value)
                          }
                          placeholder="••••••••"
                          className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${
                            isArabic ? "text-right" : "text-left"
                          }`}
                        />

                        <p className="mt-1.5 text-[11px] text-[#94a3b8]">
                          {isArabic
                            ? "8 أحرف على الأقل"
                            : "Minimum 8 characters"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "المسمى الوظيفي" : "Job Title"}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          maxLength={255}
                          value={owner}
                          onChange={(e) => setOwner(e.target.value)}
                          placeholder={
                            isArabic ? "اكتب المسمى الوظيفي" : "Enter job title"
                          }
                          className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${
                            isArabic ? "text-right" : "text-left"
                          }`}
                        />
                      </div>
                    </div>

                    {/* ROLE + EMPLOYMENT TYPE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "الدور" : "Role"}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <select
                          value={formData.role}
                          onChange={(e) =>
                            handleFormChange("role", e.target.value)
                          }
                          className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9]"
                        >
                          <option value="Employee">
                            {isArabic ? "موظف" : "Employee"}
                          </option>

                          <option value="Manager">
                            {isArabic ? "مدير" : "Manager"}
                          </option>

                          <option value="HR">
                            {isArabic ? "موارد بشرية" : "HR"}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "نوع التوظيف" : "Employment Type"}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <select
                          value={formData.employment_type}
                          onChange={(e) =>
                            handleFormChange("employment_type", e.target.value)
                          }
                          className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9]"
                        >
                          <option value="Full-time">
                            {isArabic ? "دوام كامل" : "Full-time"}
                          </option>

                          <option value="Part-time">
                            {isArabic ? "دوام جزئي" : "Part-time"}
                          </option>

                          <option value="Contract">
                            {isArabic ? "تعاقد" : "Contract"}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* DEPARTMENT + START DATE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "رقم القسم" : "Department ID"}

                          {(formData.role === "Employee" ||
                            formData.role === "Manager") && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={formData.department_id}
                          onChange={(e) =>
                            handleFormChange("department_id", e.target.value)
                          }
                          placeholder="1"
                          className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9]"
                        />

                        {(formData.role === "Employee" ||
                          formData.role === "Manager") && (
                          <p className="mt-1.5 text-[11px] text-[#94a3b8]">
                            {isArabic
                              ? "مطلوب للموظف والمدير"
                              : "Required for Employee and Manager"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "تاريخ البدء" : "Start Date"}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) =>
                            handleFormChange("start_date", e.target.value)
                          }
                          className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9]"
                        />
                      </div>
                    </div>

                    {/* PHONE + ADDRESS */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "رقم الهاتف" : "Phone"}
                        </label>

                        <input
                          type="tel"
                          maxLength={20}
                          value={formData.phone}
                          onChange={(e) =>
                            handleFormChange("phone", e.target.value)
                          }
                          placeholder="01xxxxxxxxx"
                          className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "العنوان" : "Address"}
                        </label>

                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            handleFormChange("address", e.target.value)
                          }
                          placeholder={
                            isArabic ? "اكتب العنوان" : "Enter address"
                          }
                          className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9]"
                        />
                      </div>
                    </div>

                    {/* =================================================
                        PERMISSIONS DROPDOWN
                    ================================================= */}

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="block text-sm font-semibold text-[#1e293b]">
                          {isArabic ? "الصلاحيات" : "Permissions"}
                        </label>

                        {formData.permissions.length > 0 && (
                          <span className="text-[11px] font-semibold text-[#64748b]">
                            {formData.permissions.length}{" "}
                            {isArabic ? "محددة" : "selected"}
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        {/* DROPDOWN BUTTON */}

                        <button
                          type="button"
                          onClick={() => setIsPermissionsOpen((prev) => !prev)}
                          disabled={permissions.length === 0}
                          className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-sm text-[#1e293b] outline-none transition hover:bg-[#f8fafc] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] disabled:cursor-not-allowed disabled:bg-[#f8fafc] ${
                            isArabic ? "text-right" : "text-left"
                          }`}
                        >
                          <span
                            className={
                              formData.permissions.length === 0
                                ? "text-[#94a3b8]"
                                : "text-[#1e293b]"
                            }
                          >
                            {formData.permissions.length === 0
                              ? isArabic
                                ? "اختر الصلاحيات"
                                : "Select permissions"
                              : isArabic
                                ? `تم اختيار ${formData.permissions.length} صلاحية`
                                : `${formData.permissions.length} permissions selected`}
                          </span>

                          <FiChevronDown
                            size={16}
                            className={`shrink-0 text-[#64748b] transition-transform ${
                              isPermissionsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* DROPDOWN MENU */}

                        <AnimatePresence>
                          {isPermissionsOpen && permissions.length > 0 && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                y: -5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: -5,
                              }}
                              transition={{
                                duration: 0.15,
                              }}
                              className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-lg"
                            >
                              {permissions.map((permission) => {
                                const checked =
                                  formData.permissions.includes(permission);

                                return (
                                  <label
                                    key={permission}
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#475569] transition hover:bg-[#f8fafc] ${
                                      isArabic
                                        ? "flex-row-reverse justify-between"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          permissions: checked
                                            ? prev.permissions.filter(
                                                (item) => item !== permission,
                                              )
                                            : [...prev.permissions, permission],
                                        }));
                                      }}
                                      className="h-4 w-4 shrink-0 accent-[#243B53]"
                                    />

                                    <span className="flex-1 break-all">
                                      {permission}
                                    </span>
                                  </label>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {formData.permissions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {formData.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center gap-1 rounded-md bg-[#edf3f7] px-2 py-1 text-[11px] font-semibold text-[#475569]"
                            >
                              {permission}

                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(
                                      (item) => item !== permission,
                                    ),
                                  }));
                                }}
                                className="text-[#94a3b8] transition hover:text-red-500"
                              >
                                <FiX size={11} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {permissions.length === 0 && (
                        <p className="mt-1.5 text-[11px] text-[#94a3b8]">
                          {isArabic
                            ? "لا توجد صلاحيات متاحة"
                            : "No permissions available"}
                        </p>
                      )}
                    </div>

                    {/* API ERROR */}

                    {createEmployeeMutation.isError && (
                      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
                        {createEmployeeMutation.error?.response?.data
                          ?.message ||
                          (isArabic
                            ? "حدث خطأ أثناء إضافة الموظف."
                            : "Failed to create employee.")}
                      </div>
                    )}
                  </div>

                  {/* FORM FOOTER */}

                  <div className="flex items-center justify-end gap-2 border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={createEmployeeMutation.isPending}
                      className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.cancel}
                    </button>

                    <motion.button
                      type="button"
                      onClick={handleSave}
                      whileTap={{
                        scale: 0.98,
                      }}
                      disabled={
                        createEmployeeMutation.isPending ||
                        !details.trim() ||
                        !owner.trim() ||
                        !formData.email.trim() ||
                        !formData.password ||
                        formData.password.length < 8 ||
                        !formData.start_date ||
                        ((formData.role === "Employee" ||
                          formData.role === "Manager") &&
                          !formData.department_id)
                      }
                      className="rounded-lg bg-[#243B53] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c2f42] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {createEmployeeMutation.isPending
                        ? isArabic
                          ? "جاري الحفظ..."
                          : "Saving..."
                        : t.save}
                    </motion.button>
                  </div>
                </>
              ) : (
                /* =================================================
                   SUCCESS
                ================================================= */

                <div className="px-6 py-10 text-center">
                  <motion.div
                    initial={{
                      scale: 0.7,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
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

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/50 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeProfile();
              }
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
              <div className="relative border-b border-[#e2e8f0] bg-[#f8fafc] px-6 pb-6 pt-7">
                <button
                  type="button"
                  onClick={closeProfile}
                  className={`absolute top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b] transition hover:bg-[#e2e8f0] hover:text-[#1e293b] ${
                    isArabic ? "left-5" : "right-5"
                  }`}
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

              <div className="space-y-3 bg-white p-6">
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

// =====================================================
// INFO BOX
// =====================================================

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#f1f5f9] bg-[#f8fafb] p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
        {icon}
        {label}
      </div>

      <div className="text-sm font-semibold text-[#1e293b]">{value}</div>
    </div>
  );
}

// =====================================================
// PROFILE ROW
// =====================================================

function ProfileRow({ icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#f1f5f9] bg-[#f8fafb] px-4 py-3.5">
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

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({ title, text, isArabic }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
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
