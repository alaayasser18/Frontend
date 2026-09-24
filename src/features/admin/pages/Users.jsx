import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    FiSearch,
    FiPlus,
    FiX,
    FiChevronRight,
    FiCheckCircle,
    FiLoader,
} from "react-icons/fi";
import { LuArrowUpRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { useEmployees, usePermissions, useCreateEmployee } from "../hooks";

const ROLE_COLORS = {
    Owner: "#3f7d5a",
    Admin: "#3f7d5a",
    HR: "#0284c7",
    Manager: "#8b5cf6",
    Employee: "#64748b",
};

const ROLE_LABEL_KEYS = {
    Owner: "filterOwner",
    Admin: "filterAdmin",
    HR: "filterHr",
    Manager: "filterManager",
    Employee: "filterEmployee",
};

const STATUS_LABEL_KEYS = {
    Active: "statusActive",
    Inactive: "statusInactive",
};

const getInitials = (name) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

/* ─── Animation variants ─── */

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 14,
    },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            delay: i * 0.06,
            ease: "easeOut",
        },
    }),
};

const rowVariants = {
    hidden: {
        opacity: 0,
        y: 8,
    },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.28,
            delay: i * 0.05,
            ease: "easeOut",
        },
    }),
    exit: {
        opacity: 0,
        y: -6,
        transition: {
            duration: 0.18,
        },
    },
};

const modalBackdrop = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.18,
        },
    },
};

const modalPanel = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 16,
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
        scale: 0.95,
        y: 10,
        transition: {
            duration: 0.18,
        },
    },
};

const toastVariants = {
    hidden: {
        opacity: 0,
        y: -20,
        scale: 0.96,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        scale: 0.96,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

/* ─── Role badge ─── */

const RoleBadge = ({ role, color }) => (
    <span
        className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f4f7] px-2.5 py-1 text-xs font-semibold"
        style={{ color }}
    >
        <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: color }}
        />
        {role}
    </span>
);

/* ─── Status badge ─── */

const StatusBadge = ({
    active,
    activeLabel,
    inactiveLabel,
}) =>
    active ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3eb] px-2.5 py-1 text-xs font-semibold text-[#3f7d5a]">
            <span className="size-1.5 rounded-full bg-current" />
            {activeLabel}
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef1f4] px-2.5 py-1 text-xs font-semibold text-[#627d98]">
            <span className="size-1.5 rounded-full bg-current" />
            {inactiveLabel}
        </span>
    );

/* ─── Toggle ─── */

const Toggle = ({ checked, onChange, label }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#486581]/40 ${
            checked ? "bg-[#12B76A]" : "bg-[#d9e2ec]"
        }`}
    >
        <motion.span
            layout
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 38,
            }}
            className="inline-block size-5 rounded-full bg-white shadow-sm"
            style={{
                marginLeft: checked ? "auto" : undefined,
            }}
        />
    </button>
);

/* ─── Main page ─── */

const Users = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language?.startsWith("ar");
    const currentLang = isRtl ? "ar" : "en";

    // Filtering & Search
    const [roleFilter, setRoleFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accessMap, setAccessMap] = useState({});
    const [showToast, setShowToast] = useState(false);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Employee");
    const [jobTitle, setJobTitle] = useState("");
    const [employmentType, setEmploymentType] = useState("Full-time");
    const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [departmentId, setDepartmentId] = useState("1");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // API Hooks
    const {
        data: employeesResponse,
        isLoading: isEmployeesLoading,
        isError: isEmployeesError,
        error: employeesError,
        refetch: refetchEmployees,
    } = useEmployees({
        search: searchQuery || undefined,
        role: roleFilter === "All" ? undefined : roleFilter,
        lang: currentLang,
    });

    const {
        data: permissionsResponse,
        isLoading: isPermissionsLoading,
    } = usePermissions(currentLang);

    const createEmployeeMutation = useCreateEmployee();

    // Extracted live employees list
    const employeesList = useMemo(() => {
        if (Array.isArray(employeesResponse?.data?.data)) {
            return employeesResponse.data.data;
        }
        if (Array.isArray(employeesResponse?.data)) {
            return employeesResponse.data;
        }
        if (Array.isArray(employeesResponse)) {
            return employeesResponse;
        }
        return [];
    }, [employeesResponse]);

    // Permissions list from backend
    const permissionsList = useMemo(() => {
        if (Array.isArray(permissionsResponse?.data)) {
            return permissionsResponse.data;
        }
        if (Array.isArray(permissionsResponse)) {
            return permissionsResponse;
        }
        return [];
    }, [permissionsResponse]);

    // Client-side search & role filter if not already filtered by API
    const filteredUsers = useMemo(() => {
        return employeesList.filter((user) => {
            const matchesRole =
                roleFilter === "All" ||
                user.role === roleFilter ||
                (roleFilter === "Admin" && user.role === "Owner");

            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesRole;

            const name = (user.name || "").toLowerCase();
            const userEmail = (user.email || "").toLowerCase();
            const dept = (user.department?.name || user.department || "").toLowerCase();
            const job = (user.job_title || "").toLowerCase();
            const userPhone = (user.phone || "").toLowerCase();

            const matchesSearch =
                name.includes(q) ||
                userEmail.includes(q) ||
                dept.includes(q) ||
                job.includes(q) ||
                userPhone.includes(q);

            return matchesRole && matchesSearch;
        });
    }, [employeesList, roleFilter, searchQuery]);

    /* ─── Export configuration ─── */

    const handleExportConfiguration = () => {
        const configuration = {
            exportedAt: new Date().toISOString(),
            users: filteredUsers.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || null,
                job_title: user.job_title || null,
                department: user.department?.name || user.department || null,
                status: user.status || "Active",
                permissions: user.permissions || [],
                access:
                    accessMap[user.id] !== undefined
                        ? accessMap[user.id]
                        : user.status
                        ? user.status.toLowerCase() === "active"
                        : true,
            })),
        };

        const jsonData = JSON.stringify(configuration, null, 2);
        const blob = new Blob([jsonData], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "wisework-users-configuration.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    /* ─── Reset form ─── */

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setPassword("");
        setRole("Employee");
        setJobTitle("");
        setEmploymentType("Full-time");
        setStartDate(new Date().toISOString().split("T")[0]);
        setDepartmentId("1");
        setPhone("");
        setAddress("");
        setSelectedPermissions([]);
    };

    /* ─── Close modal ─── */

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    /* ─── Toggle permission selection ─── */

    const togglePermission = (perm) => {
        setSelectedPermissions((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };

    /* ─── Create user ─── */

    const handleCreateUser = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (
            !fullName.trim() ||
            !email.trim() ||
            !password.trim() ||
            !jobTitle.trim() ||
            !startDate
        ) {
            toast.error(
                t(
                    "usersPage.validationError",
                    "Please fill in all required fields.",
                ),
            );
            return;
        }

        if (password.trim().length < 8) {
            toast.error(
                t(
                    "usersPage.passwordPlaceholder",
                    "Password must be at least 8 characters.",
                ),
            );
            return;
        }

        if (role !== "HR" && !departmentId) {
            toast.error(
                t(
                    "usersPage.validationError",
                    "Please select a department.",
                ),
            );
            return;
        }

        const payload = {
            name: fullName.trim(),
            email: email.trim(),
            password: password.trim(),
            role,
            job_title: jobTitle.trim(),
            employment_type: employmentType,
            start_date: startDate,
            department_id:
                role === "HR" && !departmentId
                    ? null
                    : Number(departmentId) || null,
            permissions: selectedPermissions,
            phone: phone.trim() || null,
            address: address.trim() || null,
        };

        createEmployeeMutation.mutate(
            { employeeData: payload, lang: currentLang },
            {
                onSuccess: (res) => {
                    toast.success(
                        res?.message ||
                            t(
                                "usersPage.createSuccess",
                                "Employee created successfully.",
                            ),
                    );
                    handleCloseModal();
                },
                onError: (err) => {
                    const backendErrors = err?.response?.data?.errors;
                    let errorMessage =
                        err?.response?.data?.message ||
                        t(
                            "usersPage.createError",
                            "Failed to create employee.",
                        );

                    if (backendErrors && typeof backendErrors === "object") {
                        const firstFieldErrors = Object.values(backendErrors).flat();
                        if (firstFieldErrors.length > 0) {
                            errorMessage = firstFieldErrors[0];
                        }
                    }

                    toast.error(errorMessage);
                },
            },
        );
    };

    /* ─── Toggle access ─── */

    const handleToggleAccess = (userId) => {
        setAccessMap((prev) => {
            const currentAccess =
                prev[userId] !== undefined ? prev[userId] : true;
            return {
                ...prev,
                [userId]: !currentAccess,
            };
        });
    };

    return (
        <div className="w-full space-y-6">

            {/* ── Toast ── */}

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        variants={toastVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-5 right-5 rtl:right-auto rtl:left-5 z-[100] flex items-center gap-3 rounded-xl border border-[#d9e2ec] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(16,42,67,0.12)]"
                    >
                        <div className="flex size-9 items-center justify-center rounded-full bg-[#e8f3eb] text-[#3f7d5a]">
                            <FiCheckCircle size={18} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#243B53]">
                                {t(
                                    "usersPage.exportSuccessTitle",
                                    "Export successful",
                                )}
                            </p>

                            <p className="mt-0.5 text-xs text-[#829ab1]">
                                {t(
                                    "usersPage.exportSuccessMessage",
                                    "User configuration exported successfully.",
                                )}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Breadcrumb ── */}

            <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#829ab1]"
            >
                <span>
                    {t(
                        "usersPage.breadcrumbAdmin",
                        "Administration",
                    )}
                </span>

                <FiChevronRight
                    className={`w-3.5 h-3.5 text-[#9fb3c8] ${
                        isRtl ? "rotate-180" : ""
                    }`}
                />

                <span className="text-[#486581]">
                    {t("usersPage.title", "Users")}
                </span>
            </motion.div>

            {/* ── Page Header ── */}

            <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#243B53]">
                        {t("usersPage.title", "Users")}
                    </h1>

                    <p className="mt-1.5 text-[14px] leading-[1.4] text-[#627d98] font-normal">
                        {t(
                            "usersPage.subtitle",
                            "Configure and manage your WiseWork users.",
                        )}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleExportConfiguration}
                    className="self-start sm:self-auto inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#bcccdc] rounded-lg text-[#486581] text-[14px] font-semibold shadow-[0_1px_2px_rgba(16,42,67,0.04)] hover:bg-[#f0f4f7] hover:border-[#9fb3c8] transition-all duration-150 whitespace-nowrap cursor-pointer"
                >
                    <LuArrowUpRight size={17} />

                    {t(
                        "usersPage.exportConfiguration",
                        "Export configuration",
                    )}
                </button>
            </motion.div>

            {/* ── Users Card ── */}

            <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl border border-[#d9e2ec] shadow-[0_1px_3px_rgba(16,42,67,0.03)]"
            >
                {/* Card Header */}

                <div className="flex items-start justify-between px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#243B53] leading-[1.3]">
                            {t(
                                "usersPage.userAccounts",
                                "User accounts",
                            )}
                        </h2>

                        <p className="text-[14px] text-[#829ab1] mt-1 leading-[1.4]">
                            {t(
                                "usersPage.userAccountsSubtitle",
                                "Manage workspace access, roles, and account status.",
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 h-10 px-[18px] bg-[#243B53] border-0 rounded-lg text-white text-[14px] font-semibold shadow-[0_1px_3px_rgba(16,42,67,0.12)] hover:bg-[#334e68] transition-colors duration-150 whitespace-nowrap cursor-pointer"
                    >
                        <FiPlus size={16} />

                        {t(
                            "usersPage.addUser",
                            "Add User",
                        )}
                    </button>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-5">

                    {/* Search & Filter */}

                    <div className="flex flex-wrap gap-3">
                        <div className="relative min-w-56 flex-1">
                            <FiSearch
                                className={`absolute top-1/2 -translate-y-1/2 text-[#829ab1] ${
                                    isRtl
                                        ? "right-3"
                                        : "left-3"
                                }`}
                                size={16}
                            />

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                placeholder={t(
                                    "usersPage.searchPlaceholder",
                                    "Search users",
                                )}
                                className={`w-full rounded-lg border border-[#d9e2ec] py-2.5 text-sm text-[#1e293b] placeholder:text-[#829ab1] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition ${
                                    isRtl
                                        ? "pr-9 pl-3"
                                        : "pl-9 pr-3"
                                }`}
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                            className="rounded-lg border border-[#d9e2ec] bg-white px-3 py-2.5 text-sm font-medium text-[#486581] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition cursor-pointer"
                        >
                            <option value="All">
                                {t(
                                    "usersPage.filterAll",
                                    "All",
                                )}
                            </option>

                            <option value="Owner">
                                {t(
                                    "usersPage.filterOwner",
                                    "Owner",
                                )}
                            </option>

                            <option value="Admin">
                                {t(
                                    "usersPage.filterAdmin",
                                    "Admin",
                                )}
                            </option>

                            <option value="HR">
                                {t(
                                    "usersPage.filterHr",
                                    "HR",
                                )}
                            </option>

                            <option value="Manager">
                                {t(
                                    "usersPage.filterManager",
                                    "Manager",
                                )}
                            </option>

                            <option value="Employee">
                                {t(
                                    "usersPage.filterEmployee",
                                    "Employee",
                                )}
                            </option>
                        </select>
                    </div>

                    {/* Table */}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left rtl:text-right text-sm">
                            <thead className="border-b border-[#d9e2ec] text-xs uppercase tracking-wide text-[#829ab1]">
                                <tr>
                                    <th className="pb-3 font-semibold">
                                        {t(
                                            "usersPage.colUser",
                                            "User",
                                        )}
                                    </th>

                                    <th className="pb-3 font-semibold">
                                        {t(
                                            "usersPage.colRole",
                                            "Role",
                                        )}
                                    </th>

                                    <th className="pb-3 font-semibold">
                                        {t(
                                            "usersPage.colDepartment",
                                            "Department",
                                        )}
                                    </th>

                                    <th className="pb-3 font-semibold">
                                        {t(
                                            "usersPage.colPhone",
                                            "Phone",
                                        )}
                                    </th>

                                    <th className="pb-3 font-semibold">
                                        {t(
                                            "usersPage.colStatus",
                                            "Status",
                                        )}
                                    </th>

                                    <th className="pb-3 font-semibold text-right rtl:text-left">
                                        {t(
                                            "usersPage.colAccess",
                                            "Access",
                                        )}
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#eef1f4]">
                                {isEmployeesLoading ? (
                                    [...Array(4)].map((_, idx) => (
                                        <tr
                                            key={`skeleton-${idx}`}
                                            className="animate-pulse"
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-[#eef1f4]" />
                                                    <div className="space-y-1.5">
                                                        <div className="h-4 w-28 rounded bg-[#eef1f4]" />
                                                        <div className="h-3 w-40 rounded bg-[#eef1f4]" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="h-6 w-16 rounded-full bg-[#eef1f4]" />
                                            </td>
                                            <td className="py-4">
                                                <div className="h-4 w-24 rounded bg-[#eef1f4]" />
                                            </td>
                                            <td className="py-4">
                                                <div className="h-4 w-24 rounded bg-[#eef1f4]" />
                                            </td>
                                            <td className="py-4">
                                                <div className="h-6 w-16 rounded-full bg-[#eef1f4]" />
                                            </td>
                                            <td className="py-4 text-right rtl:text-left">
                                                <div className="h-6 w-11 inline-block rounded-full bg-[#eef1f4]" />
                                            </td>
                                        </tr>
                                    ))
                                ) : isEmployeesError ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center"
                                        >
                                            <p className="text-sm text-red-500 font-medium">
                                                {employeesError?.response?.data?.message ||
                                                    t(
                                                        "usersPage.createError",
                                                        "Failed to load employees.",
                                                    )}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    refetchEmployees()
                                                }
                                                className="mt-2 text-xs font-semibold text-[#243B53] underline hover:text-[#486581] cursor-pointer"
                                            >
                                                Retry
                                            </button>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-10 text-center text-sm text-[#829ab1]"
                                        >
                                            {t(
                                                "usersPage.noEmployeesFound",
                                                "No employees found.",
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {filteredUsers.map((user, i) => {
                                            const roleColor =
                                                ROLE_COLORS[user.role] ||
                                                "#64748b";
                                            const roleLabelKey =
                                                ROLE_LABEL_KEYS[user.role] ||
                                                "filterEmployee";

                                            const isUserActive = user.status
                                                ? user.status.toLowerCase() ===
                                                  "active"
                                                : true;

                                            const currentAccess =
                                                accessMap[user.id] !== undefined
                                                    ? accessMap[user.id]
                                                    : isUserActive;

                                            const deptName =
                                                user.department?.name ||
                                                (typeof user.department ===
                                                "string"
                                                    ? user.department
                                                    : "") ||
                                                "";

                                            return (
                                                <motion.tr
                                                    key={user.id}
                                                    custom={i}
                                                    variants={rowVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    layout
                                                >
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            {user.avatar ? (
                                                                <img
                                                                    src={
                                                                        user.avatar
                                                                    }
                                                                    alt={
                                                                        user.name
                                                                    }
                                                                    className="size-9 rounded-full object-cover shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="flex size-9 items-center justify-center rounded-full bg-[#e7eef5] text-xs font-bold text-[#486581] shrink-0">
                                                                    {getInitials(
                                                                        user.name,
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="font-semibold text-[#243B53] text-sm">
                                                                    {user.name}
                                                                </p>

                                                                <p className="text-xs text-[#829ab1]">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="py-4">
                                                        <RoleBadge
                                                            role={t(
                                                                `usersPage.${roleLabelKey}`,
                                                                user.role,
                                                            )}
                                                            color={roleColor}
                                                        />
                                                    </td>

                                                    <td className="py-4 text-sm text-[#627d98]">
                                                        <div>
                                                            <p className="font-medium text-[#243B53]">
                                                                {user.job_title ||
                                                                    deptName ||
                                                                    "—"}
                                                            </p>
                                                            {user.job_title &&
                                                                deptName && (
                                                                    <p className="text-xs text-[#829ab1]">
                                                                        {deptName}
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </td>

                                                    <td className="py-4 text-sm text-[#627d98]">
                                                        <span className="dir-ltr inline-block">
                                                            {user.phone || "—"}
                                                        </span>
                                                    </td>

                                                    <td className="py-4">
                                                        <StatusBadge
                                                            active={
                                                                isUserActive
                                                            }
                                                            activeLabel={t(
                                                                `usersPage.${STATUS_LABEL_KEYS.Active}`,
                                                                "Active",
                                                            )}
                                                            inactiveLabel={t(
                                                                `usersPage.${STATUS_LABEL_KEYS.Inactive}`,
                                                                "Inactive",
                                                            )}
                                                        />
                                                    </td>

                                                    <td className="py-4 text-right rtl:text-left">
                                                        <Toggle
                                                            checked={
                                                                currentAccess
                                                            }
                                                            onChange={() =>
                                                                handleToggleAccess(
                                                                    user.id,
                                                                )
                                                            }
                                                            label={`Toggle ${user.name}`}
                                                        />
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* ── Add User Modal ── */}

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        key="backdrop"
                        variants={modalBackdrop}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/40 p-4"
                        onClick={(e) =>
                            e.target === e.currentTarget &&
                            handleCloseModal()
                        }
                    >
                        <motion.div
                            key="panel"
                            variants={modalPanel}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#eef1f4]">
                                <h3 className="text-[18px] font-bold text-[#243B53] leading-[1.3]">
                                    {t(
                                        "usersPage.addUserAccount",
                                        "Add user account",
                                    )}
                                </h3>

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="text-[#829ab1] hover:text-[#243B53] transition rounded-lg p-1 hover:bg-[#f0f4f7] cursor-pointer"
                                    aria-label="Close"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Full name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.fullName",
                                                "Full name",
                                            )}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) =>
                                                setFullName(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                "usersPage.fullName",
                                                "Full name",
                                            )}
                                            className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.emailAddress",
                                                "Email address",
                                            )}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                "usersPage.emailAddress",
                                                "Email address",
                                            )}
                                            className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.password",
                                                "Password",
                                            )}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                "usersPage.passwordPlaceholder",
                                                "Minimum 8 characters",
                                            )}
                                            className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.role",
                                                "Role",
                                            )}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <select
                                            value={role}
                                            onChange={(e) =>
                                                setRole(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#d9e2ec] bg-white px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition cursor-pointer"
                                        >
                                            <option value="Employee">
                                                {t(
                                                    "usersPage.filterEmployee",
                                                    "Employee",
                                                )}
                                            </option>

                                            <option value="Manager">
                                                {t(
                                                    "usersPage.filterManager",
                                                    "Manager",
                                                )}
                                            </option>

                                            <option value="HR">
                                                {t(
                                                    "usersPage.filterHr",
                                                    "HR",
                                                )}
                                            </option>
                                        </select>
                                    </div>

                                    {/* Job Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.jobTitle",
                                                "Job title",
                                            )}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            value={jobTitle}
                                            onChange={(e) =>
                                                setJobTitle(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                "usersPage.jobTitlePlaceholder",
                                                "e.g. Software Engineer",
                                            )}
                                            className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                        />
                                    </div>

                                    {/* Employment Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.employmentType",
                                                "Employment type",
                                            )}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <select
                                            value={employmentType}
                                            onChange={(e) =>
                                                setEmploymentType(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#d9e2ec] bg-white px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition cursor-pointer"
                                        >
                                            <option value="Full-time">
                                                {t(
                                                    "usersPage.fullTime",
                                                    "Full-time",
                                                )}
                                            </option>

                                            <option value="Part-time">
                                                {t(
                                                    "usersPage.partTime",
                                                    "Part-time",
                                                )}
                                            </option>

                                            <option value="Contract">
                                                {t(
                                                    "usersPage.contract",
                                                    "Contract",
                                                )}
                                            </option>
                                        </select>
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.startDate",
                                                "Start date",
                                            )}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="date"
                                            required
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                        />
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.department",
                                                "Department",
                                            )}{" "}
                                            {role !== "HR" && (
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            )}
                                        </label>

                                        <select
                                            value={departmentId}
                                            onChange={(e) =>
                                                setDepartmentId(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#d9e2ec] bg-white px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition cursor-pointer"
                                        >
                                            <option value="">
                                                {t(
                                                    "departments.selectDepartment",
                                                    "Select Department",
                                                )}
                                            </option>
                                            <option value="1">
                                                1 - Engineering
                                            </option>
                                            <option value="2">
                                                2 - Operations
                                            </option>
                                            <option value="3">
                                                3 - People & Culture
                                            </option>
                                            <option value="4">
                                                4 - Sales
                                            </option>
                                            <option value="5">
                                                5 - Finance
                                            </option>
                                        </select>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.phone",
                                                "Phone number",
                                            )}
                                        </label>

                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                "usersPage.phonePlaceholder",
                                                "e.g. +201234567890",
                                            )}
                                            className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                            {t(
                                                "usersPage.address",
                                                "Address",
                                            )}
                                        </label>

                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={t(
                                                "usersPage.addressPlaceholder",
                                                "e.g. Cairo, Egypt",
                                            )}
                                            className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                        />
                                    </div>
                                </div>

                                {/* Permissions dynamically loaded */}
                                <div className="pt-2">
                                    <label className="block text-sm font-semibold text-[#243B53] mb-2">
                                        {t(
                                            "usersPage.permissions",
                                            "Permissions",
                                        )}
                                    </label>

                                    {isPermissionsLoading ? (
                                        <div className="flex items-center gap-2 py-3 text-xs text-[#829ab1]">
                                            <FiLoader className="animate-spin" size={14} />
                                            <span>
                                                {t(
                                                    "usersPage.loadingPermissions",
                                                    "Loading permissions...",
                                                )}
                                            </span>
                                        </div>
                                    ) : permissionsList.length === 0 ? (
                                        <p className="py-2 text-xs text-[#829ab1]">
                                            {t(
                                                "usersPage.noPermissionsFound",
                                                "No permissions available.",
                                            )}
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 rounded-lg border border-[#d9e2ec] bg-[#f8fafc]">
                                            {permissionsList.map(
                                                (perm) => {
                                                    const isSelected =
                                                        selectedPermissions.includes(
                                                            perm,
                                                        );

                                                    return (
                                                        <button
                                                            key={perm}
                                                            type="button"
                                                            onClick={() =>
                                                                togglePermission(
                                                                    perm,
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                                                                isSelected
                                                                    ? "bg-[#243B53] text-white shadow-xs"
                                                                    : "bg-white text-[#486581] border border-[#d9e2ec] hover:border-[#9fb3c8]"
                                                            }`}
                                                        >
                                                            <span
                                                                className={`size-1.5 rounded-full ${
                                                                    isSelected
                                                                        ? "bg-[#12B76A]"
                                                                        : "bg-[#9fb3c8]"
                                                                }`}
                                                            />
                                                            {perm}
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eef1f4]">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={
                                            createEmployeeMutation.isPending
                                        }
                                        className="rounded-lg border border-[#d9e2ec] px-4 py-2.5 text-sm font-semibold text-[#486581] hover:bg-[#f0f4f7] hover:border-[#9fb3c8] transition cursor-pointer disabled:opacity-50"
                                    >
                                        {t(
                                            "usersPage.cancel",
                                            "Cancel",
                                        )}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            createEmployeeMutation.isPending
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#243B53] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#334e68] transition shadow-[0_1px_3px_rgba(16,42,67,0.12)] cursor-pointer disabled:opacity-60"
                                    >
                                        {createEmployeeMutation.isPending && (
                                            <FiLoader
                                                className="animate-spin"
                                                size={15}
                                            />
                                        )}
                                        {createEmployeeMutation.isPending
                                            ? t(
                                                  "usersPage.creating",
                                                  "Creating...",
                                              )
                                            : t(
                                                  "usersPage.createUser",
                                                  "Create user",
                                              )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;