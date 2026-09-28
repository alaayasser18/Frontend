import { useMemo, useState, useEffect } from "react";
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
  FiEdit2,
  FiPower,
  FiSave,
} from "react-icons/fi";

import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployeeHrFields,
  useChangeEmployeeAccountStatus,
  useEmployee,
} from "../hooks/useEmployees";

import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../../../context/AuthContext";

// =====================================================
// ANIMATIONS
// =====================================================

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 15,
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
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
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
  const updateEmployeeMutation = useUpdateEmployeeHrFields(currentLang);
  const updateHrFieldsMutation = updateEmployeeMutation;

  const { role, hasPermission, currentUser } = useAuth();
  const canUpdateHrFields =
    role === "Admin" ||
    role === "HR" ||
    role === "Owner" ||
    (typeof hasPermission === "function" && hasPermission("Update HR fields"));

  const changeStatusMutation = useChangeEmployeeAccountStatus(currentLang);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // GET /api/employees/{id} - retrieve detailed profile for selected employee
  const { data: employeeDetails } = useEmployee(
    selectedEmployee?.id,
    currentLang,
  );

  useEffect(() => {
    if (employeeDetails) {
      setEditFormData({
        job_title: employeeDetails.job_title || "",
        employment_type: employeeDetails.employment_type || "Full-time",
        status:
          String(employeeDetails.status || "").toLowerCase() === "inactive"
            ? "inactive"
            : "active",
        department_id:
          employeeDetails.department?.id ||
          employeeDetails.department_id ||
          "",
      });
    }
  }, [employeeDetails]);

  // =====================================================
  // FORM DATA - CREATE EMPLOYEE
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
  // EDIT HR FORM
  // =====================================================

  const [editFormData, setEditFormData] = useState({
    job_title: "",
    employment_type: "Full-time",
    status: "active",
    department_id: "",
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

    editHrFields: isArabic ? "تعديل بيانات الموارد البشرية" : "Edit HR Fields",
    editHrFieldsModalTitle: isArabic ? "تحديث بيانات الموارد البشرية للموظف" : "Update Employee HR Fields",
    jobTitleLabel: isArabic ? "المسمى الوظيفي" : "Job Title",
    employmentTypeLabel: isArabic ? "نوع التوظيف" : "Employment Type",
    statusLabelText: isArabic ? "الحالة" : "Status",
    departmentIdLabel: isArabic ? "معرف القسم" : "Department ID",
    saveHrFields: isArabic ? "حفظ التعديلات" : "Save Changes",
  };

  // =====================================================
  // UI STATE
  // =====================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const [details, setDetails] = useState("");

  const [owner, setOwner] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  // =====================================================
  // EMPLOYEES FROM API
  // =====================================================

  const employees = useMemo(() => {
    const response = employeesResponse;

    if (Array.isArray(response?.data)) {
      return response.data.map((employee) => {
        const normalizedStatus = String(employee.status || "").toLowerCase();

        let statusType = "info";

        if (normalizedStatus === "active") {
          statusType = "success";
        } else if (normalizedStatus === "inactive") {
          statusType = "danger";
        } else if (normalizedStatus === "late") {
          statusType = "warning";
        }

        return {
          id: employee.id,

          name: employee.name || "-",

          code: employee.employee_code || employee.code || employee.id || "-",

          role:
            employee.job_title || employee.role_label || employee.role || "-",

          department:
            employee.department?.name ||
            employee.department_name ||
            employee.department_id ||
            "-",

          departmentId: employee.department_id || employee.department?.id || "",

          branch:
            employee.company_location?.name ||
            employee.branch ||
            employee.branch_name ||
            "-",

          status: employee.status || "Unknown",

          statusType,

          employment_type: employee.employment_type || "Full-time",
        };
      });
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

    if (!value) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(value) ||
        employee.code.toString().toLowerCase().includes(value) ||
        employee.role.toLowerCase().includes(value) ||
        employee.department.toString().toLowerCase().includes(value) ||
        employee.branch.toLowerCase().includes(value)
      );
    });
  }, [searchTerm, employees]);

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {
    if (!isArabic) {
      return status;
    }

    const statusMap = {
      Active: "نشط",
      active: "نشط",

      Inactive: "غير نشط",
      inactive: "غير نشط",

      Present: "حاضر",
      Late: "متأخر",
      "On leave": "في إجازة",
      Absent: "غائب",
    };

    return statusMap[status] || status;
  };

  // =====================================================
  // STATUS CLASSES
  // =====================================================

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
  // OPEN ADD MODAL
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

  // =====================================================
  // CLOSE ADD MODAL
  // =====================================================

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
  // OPEN PROFILE
  // =====================================================

  const openProfile = (employee) => {
    setSelectedEmployee(employee);

    setIsEditMode(false);

    setEditFormData({
      job_title: employee.role === "-" ? "" : employee.role,

      employment_type: employee.employment_type || "Full-time",

      status:
        String(employee.status || "").toLowerCase() === "inactive"
          ? "inactive"
          : "active",

      department_id: employee.departmentId || "",
    });
  };

  // =====================================================
  // CLOSE PROFILE
  // =====================================================

  const closeProfile = () => {
    if (updateEmployeeMutation.isPending || changeStatusMutation.isPending) {
      return;
    }

    setSelectedEmployee(null);

    setIsEditMode(false);
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // START EDIT MODE
  // =====================================================

  const openEditMode = () => {
    if (!selectedEmployee) {
      return;
    }

    setEditFormData({
      job_title: selectedEmployee.role === "-" ? "" : selectedEmployee.role,

      employment_type: selectedEmployee.employment_type || "Full-time",

      status:
        String(selectedEmployee.status || "").toLowerCase() === "inactive"
          ? "inactive"
          : "active",

      department_id: selectedEmployee.departmentId || "",
    });

    updateEmployeeMutation.reset();

    setIsEditMode(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEditMode = () => {
    if (updateEmployeeMutation.isPending) {
      return;
    }

    setIsEditMode(false);

    updateEmployeeMutation.reset();
  };

  // =====================================================
  // UPDATE HR FIELDS
  // =====================================================

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee?.id) {
      return;
    }

    if (!editFormData.job_title.trim()) {
      return;
    }

    if (!editFormData.department_id) {
      return;
    }

    const payload = {
      job_title: editFormData.job_title.trim(),

      employment_type: editFormData.employment_type,

      status: editFormData.status,

      department_id: Number(editFormData.department_id),
    };

    try {
      const response = await updateEmployeeMutation.mutateAsync({
        id: selectedEmployee.id,
        employeeData: payload,
      });

      const updatedEmployee = response?.data || response;

      // Update selected employee locally so
      // modal reflects the latest values immediately.
      if (updatedEmployee) {
        setSelectedEmployee((prev) => ({
          ...prev,

          role: updatedEmployee.job_title || payload.job_title,

          department:
            updatedEmployee.department?.name ||
            updatedEmployee.department_name ||
            payload.department_id,

          departmentId: updatedEmployee.department_id || payload.department_id,

          status: updatedEmployee.status || payload.status,

          employment_type:
            updatedEmployee.employment_type || payload.employment_type,

          statusType:
            String(updatedEmployee.status || payload.status).toLowerCase() ===
            "active"
              ? "success"
              : "danger",
        }));
      } else {
        setSelectedEmployee((prev) => ({
          ...prev,

          role: payload.job_title,

          departmentId: payload.department_id,

          status: payload.status,

          employment_type: payload.employment_type,

          statusType: payload.status === "active" ? "success" : "danger",
        }));
      }

      setIsEditMode(false);
    } catch (error) {
      console.error("Update employee HR fields failed:", error);
    }
  };

  // =====================================================
  // CHANGE ACCOUNT STATUS
  // =====================================================

  const handleChangeAccountStatus = async () => {
    if (!selectedEmployee?.id) {
      return;
    }

    if (currentUser?.id === selectedEmployee?.id) {
      return;
    }

    try {
      const response = await changeStatusMutation.mutateAsync(
        selectedEmployee.id,
      );

      const updatedEmployee = response?.data || response;

      const currentStatus = String(selectedEmployee.status || "").toLowerCase();

      const fallbackStatus = currentStatus === "active" ? "Inactive" : "Active";

      const newStatus = updatedEmployee?.status || fallbackStatus;

      const normalizedStatus = String(newStatus).toLowerCase();

      setSelectedEmployee((prev) => ({
        ...prev,

        status: newStatus,

        statusType: normalizedStatus === "active" ? "success" : "danger",
      }));
    } catch (error) {
      console.error("Change employee account status failed:", error);
    }
  };

  // =====================================================
  // RENDER
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

            <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
              {t.title}
            </h1>

            <p className="mt-1 text-sm font-normal text-[#64748b]">
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
            whileTap={{
              scale: 0.98,
            }}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c2f42]"
          >
            <FiUserPlus size={16} />

            {t.addBtn}
          </motion.button>
        </motion.div>

        {/* =================================================
            MAIN CONTAINER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
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
                        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#2f6f4d] transition hover:text-[#23583c]"
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#edf3f7] text-[#52728c]">
                        <FiUsers size={17} />
                      </div>

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
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
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
                  {/* HEADER */}

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

                  {/* BODY */}

                  <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
                    {/* NAME + EMAIL */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormInput
                        label={t.detailsLabel}
                        value={details}
                        onChange={(value) => setDetails(value)}
                        placeholder={t.detailsPlaceholder}
                        required
                        isArabic={isArabic}
                      />

                      <FormInput
                        label={isArabic ? "البريد الإلكتروني" : "Email"}
                        type="email"
                        value={formData.email}
                        onChange={(value) => handleFormChange("email", value)}
                        placeholder="example@email.com"
                        required
                        isArabic={isArabic}
                      />
                    </div>

                    {/* PASSWORD + JOB TITLE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormInput
                        label={isArabic ? "كلمة المرور" : "Password"}
                        type="password"
                        value={formData.password}
                        onChange={(value) =>
                          handleFormChange("password", value)
                        }
                        placeholder="••••••••"
                        required
                        isArabic={isArabic}
                        helper={
                          isArabic ? "8 أحرف على الأقل" : "Minimum 8 characters"
                        }
                      />

                      <FormInput
                        label={t.ownerLabel}
                        value={owner}
                        onChange={(value) => setOwner(value)}
                        placeholder={t.ownerPlaceholder}
                        required
                        isArabic={isArabic}
                      />
                    </div>

                    {/* ROLE + EMPLOYMENT TYPE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormSelect
                        label={isArabic ? "الدور" : "Role"}
                        value={formData.role}
                        onChange={(value) => handleFormChange("role", value)}
                        required
                        isArabic={isArabic}
                        options={[
                          {
                            value: "Employee",
                            label: isArabic ? "موظف" : "Employee",
                          },
                          {
                            value: "Manager",
                            label: isArabic ? "مدير" : "Manager",
                          },
                          {
                            value: "HR",
                            label: isArabic ? "موارد بشرية" : "HR",
                          },
                        ]}
                      />

                      <FormSelect
                        label={isArabic ? "نوع التوظيف" : "Employment Type"}
                        value={formData.employment_type}
                        onChange={(value) =>
                          handleFormChange("employment_type", value)
                        }
                        required
                        isArabic={isArabic}
                        options={[
                          {
                            value: "Full-time",
                            label: isArabic ? "دوام كامل" : "Full-time",
                          },
                          {
                            value: "Part-time",
                            label: isArabic ? "دوام جزئي" : "Part-time",
                          },
                          {
                            value: "Contract",
                            label: isArabic ? "تعاقد" : "Contract",
                          },
                        ]}
                      />
                    </div>

                    {/* DEPARTMENT + START DATE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormInput
                        label={isArabic ? "رقم القسم" : "Department ID"}
                        type="number"
                        value={formData.department_id}
                        onChange={(value) =>
                          handleFormChange("department_id", value)
                        }
                        placeholder="1"
                        required={
                          formData.role === "Employee" ||
                          formData.role === "Manager"
                        }
                        isArabic={isArabic}
                        helper={
                          formData.role === "Employee" ||
                          formData.role === "Manager"
                            ? isArabic
                              ? "مطلوب للموظف والمدير"
                              : "Required for Employee and Manager"
                            : undefined
                        }
                      />

                      <FormInput
                        label={isArabic ? "تاريخ البدء" : "Start Date"}
                        type="date"
                        value={formData.start_date}
                        onChange={(value) =>
                          handleFormChange("start_date", value)
                        }
                        required
                        isArabic={isArabic}
                      />
                    </div>

                    {/* PHONE + ADDRESS */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormInput
                        label={isArabic ? "رقم الهاتف" : "Phone"}
                        type="tel"
                        value={formData.phone}
                        onChange={(value) => handleFormChange("phone", value)}
                        placeholder="01xxxxxxxxx"
                        isArabic={isArabic}
                      />

                      <FormInput
                        label={isArabic ? "العنوان" : "Address"}
                        value={formData.address}
                        onChange={(value) => handleFormChange("address", value)}
                        placeholder={
                          isArabic ? "اكتب العنوان" : "Enter address"
                        }
                        isArabic={isArabic}
                      />
                    </div>

                    {/* PERMISSIONS */}

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
                      <ApiError
                        message={
                          createEmployeeMutation.error?.response?.data
                            ?.message ||
                          (isArabic
                            ? "حدث خطأ أثناء إضافة الموظف."
                            : "Failed to create employee.")
                        }
                      />
                    )}
                  </div>

                  {/* FOOTER */}

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
          PROFILE / EDIT MODAL
      ===================================================== */}

      <AnimatePresence>
        {selectedEmployee && (
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
              {/* PROFILE HEADER */}

              <div className="relative border-b border-[#e2e8f0] bg-[#f8fafc] px-6 pb-6 pt-7">
                <button
                  type="button"
                  onClick={closeProfile}
                  disabled={
                    updateEmployeeMutation.isPending ||
                    changeStatusMutation.isPending
                  }
                  className={`absolute top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b] transition hover:bg-[#e2e8f0] hover:text-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50 ${
                    isArabic ? "left-5" : "right-5"
                  }`}
                >
                  <FiX size={16} />
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#edf3f7] text-[#64748b]">
                    <FiUsers size={21} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-[#1e293b] md:text-[21px]">
                      {selectedEmployee.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#64748b]">
                      {selectedEmployee.code}
                    </p>
                  </div>
                </div>
              </div>

              {/* PROFILE BODY */}

              {!isEditMode ? (
                <>
                  <div className="space-y-3 bg-white p-6">
                    <ProfileRow
                      icon={<FiBriefcase size={15} />}
                      label={t.roleHeader}
                      value={employeeDetails?.job_title || selectedEmployee.role}
                    />

                    <ProfileRow
                      icon={<FiUsers size={15} />}
                      label={t.departmentLabel}
                      value={
                        employeeDetails?.department?.name ||
                        selectedEmployee.department
                      }
                    />

                    <ProfileRow
                      icon={<FiMapPin size={15} />}
                      label={t.branchLabel}
                      value={
                        employeeDetails?.company_location?.name ||
                        selectedEmployee.branch
                      }
                    />
                    <ProfileRow
                      icon={<FiCheck size={15} />}
                      label={t.statusLabel}
                      value={getStatusLabel(
                        employeeDetails?.status || selectedEmployee.status,
                      )}
                      valueClass={getStatusClasses(
                        String(
                          employeeDetails?.status || selectedEmployee.status,
                        ).toLowerCase() === "active"
                          ? "success"
                          : "danger",
                      )}
                    />
                  </div>

                  {/* ACTIONS */}

                  <div className="space-y-2 border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-5">
                    {canUpdateHrFields && (
                      <button
                        type="button"
                        onClick={openEditMode}
                        disabled={changeStatusMutation.isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#243B53] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiEdit2 size={15} />

                        {t.editHrFields || t.editEmployee}
                      </button>
                    )}

                    {canUpdateHrFields &&
                      currentUser?.id !== selectedEmployee.id && (
                        <button
                          type="button"
                          onClick={handleChangeAccountStatus}
                          disabled={changeStatusMutation.isPending}
                          className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            String(
                              employeeDetails?.status ||
                                selectedEmployee.status ||
                                "",
                            ).toLowerCase() === "active"
                              ? "border-red-100 bg-red-50 text-red-700 hover:bg-red-100"
                              : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          <FiPower size={15} />

                          {changeStatusMutation.isPending
                            ? t.updating
                            : String(
                                employeeDetails?.status ||
                                  selectedEmployee.status ||
                                  "",
                              ).toLowerCase() === "active"
                              ? t.deactivate
                              : t.activate}
                        </button>
                      )}

                    {changeStatusMutation.isError && (
                      <ApiError
                        message={
                          changeStatusMutation.error?.response?.data?.message ||
                          t.statusError
                        }
                      />
                    )}

                    <button
                      type="button"
                      onClick={closeProfile}
                      disabled={changeStatusMutation.isPending}
                      className="w-full rounded-lg border border-[#e2e8f0] bg-white py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.closeBtn}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* EDIT FORM */}

                  <div className="space-y-5 bg-white p-6">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e293b]">
                        {t.editHrFields}
                      </h3>

                      <p className="mt-1 text-xs text-[#64748b]">
                        {isArabic
                          ? "قم بتعديل بيانات الموارد البشرية الخاصة بالموظف."
                          : "Update the employee's HR information."}
                      </p>
                    </div>

                    {/* JOB TITLE */}

                    <FormInput
                      label={t.jobTitle}
                      value={editFormData.job_title}
                      onChange={(value) =>
                        handleEditFormChange("job_title", value)
                      }
                      placeholder={
                        isArabic ? "اكتب المسمى الوظيفي" : "Enter job title"
                      }
                      required
                      isArabic={isArabic}
                    />

                    {/* EMPLOYMENT TYPE */}

                    <FormSelect
                      label={t.employmentType}
                      value={editFormData.employment_type}
                      onChange={(value) =>
                        handleEditFormChange("employment_type", value)
                      }
                      required
                      isArabic={isArabic}
                      options={[
                        {
                          value: "Full-time",
                          label: t.fullTime,
                        },
                        {
                          value: "Part-time",
                          label: t.partTime,
                        },
                        {
                          value: "Contract",
                          label: t.contract,
                        },
                      ]}
                    />

                    {/* STATUS */}

                    <FormSelect
                      label={t.accountStatus}
                      value={editFormData.status}
                      onChange={(value) =>
                        handleEditFormChange("status", value)
                      }
                      required
                      isArabic={isArabic}
                      options={[
                        {
                          value: "active",
                          label: t.active,
                        },
                        {
                          value: "inactive",
                          label: t.inactive,
                        },
                      ]}
                    />

                    {/* DEPARTMENT */}

                    <FormInput
                      label={t.departmentId}
                      type="number"
                      min="1"
                      value={editFormData.department_id}
                      onChange={(value) =>
                        handleEditFormChange("department_id", value)
                      }
                      placeholder="1"
                      required
                      isArabic={isArabic}
                    />

                    {/* ERROR */}

                    {updateEmployeeMutation.isError && (
                      <ApiError
                        message={
                          updateEmployeeMutation.error?.response?.data
                            ?.message || t.updateError
                        }
                      />
                    )}
                  </div>

                  {/* EDIT FOOTER */}

                  <div className="flex items-center gap-2 border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-5">
                    <button
                      type="button"
                      onClick={cancelEditMode}
                      disabled={updateEmployeeMutation.isPending}
                      className="flex-1 rounded-lg border border-[#e2e8f0] bg-white py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.cancel}
                    </button>

                    <motion.button
                      type="button"
                      onClick={handleUpdateEmployee}
                      whileTap={{
                        scale: 0.98,
                      }}
                      disabled={
                        updateEmployeeMutation.isPending ||
                        !editFormData.job_title.trim() ||
                        !editFormData.department_id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#243B53] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiSave size={15} />

                      {updateEmployeeMutation.isPending
                        ? t.updating
                        : t.saveChanges}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// =====================================================
// FORM INPUT
// =====================================================

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  helper,
  isArabic = false,
  min,
  maxLength,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        maxLength={maxLength}
        className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] ${
          isArabic ? "text-right" : "text-left"
        }`}
      />

      {helper && <p className="mt-1.5 text-[11px] text-[#94a3b8]">{helper}</p>}
    </div>
  );
}

// =====================================================
// FORM SELECT
// =====================================================

function FormSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1e293b]">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#1e293b] outline-none transition focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// =====================================================
// API ERROR
// =====================================================

function ApiError({ message }) {
  return (
    <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
      {message}
    </div>
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
