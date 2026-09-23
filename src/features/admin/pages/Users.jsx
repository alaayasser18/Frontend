import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FiSearch,
    FiPlus,
    FiX,
    FiChevronRight,
    FiCheckCircle,
} from "react-icons/fi";
import { LuArrowUpRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const USERS_SEED = [
    {
        id: 1,
        name: "Sarah Ahmed",
        email: "sarah.ahmed@wisework.co",
        role: "Admin",
        roleColor: "#3f7d5a",
        department: "Administration",
        status: "Active",
        access: true,
    },
    {
        id: 2,
        name: "Mostafa Khalil",
        email: "mostafa.k@wisework.co",
        role: "HR",
        roleColor: "#0284c7",
        department: "People & Culture",
        status: "Active",
        access: true,
    },
    {
        id: 3,
        name: "Omar Nabil",
        email: "omar.nabil@wisework.co",
        role: "Manager",
        roleColor: "#8b5cf6",
        department: "Operations",
        status: "Active",
        access: true,
    },
    {
        id: 4,
        name: "Youssef Lotfy",
        email: "youssef.lotfy@wisework.co",
        role: "Employee",
        roleColor: "#64748b",
        department: "Engineering",
        status: "Inactive",
        access: false,
    },
];

const ROLE_LABEL_KEYS = {
    Admin: "filterAdmin",
    HR: "filterHr",
    Manager: "filterManager",
    Employee: "filterEmployee",
};

const STATUS_LABEL_KEYS = {
    Active: "statusActive",
    Inactive: "statusInactive",
};

const getInitials = (name) =>
    name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

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

    const [users, setUsers] = useState(USERS_SEED);
    const [roleFilter, setRoleFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Employee");
    const [department, setDepartment] = useState("");

    const [showToast, setShowToast] = useState(false);

    const filteredUsers = users.filter(
        (user) =>
            (roleFilter === "All" || user.role === roleFilter) &&
            `${user.name} ${user.email} ${user.department}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
    );

    /* ─── Export configuration ─── */

    const handleExportConfiguration = () => {
        const configuration = {
            exportedAt: new Date().toISOString(),
            users: users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                status: user.status,
                access: user.access,
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
        setRole("Employee");
        setDepartment("");
    };

    /* ─── Close modal ─── */

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    /* ─── Create user ─── */

    const handleCreateUser = () => {
        if (!fullName.trim() || !email.trim() || !department.trim()) {
            return;
        }

        const roleColors = {
            Admin: "#3f7d5a",
            HR: "#0284c7",
            Manager: "#8b5cf6",
            Employee: "#64748b",
        };

        const newUser = {
            id:
                users.length > 0
                    ? Math.max(...users.map((user) => user.id)) + 1
                    : 1,
            name: fullName,
            email,
            role,
            roleColor: roleColors[role] || "#64748b",
            department,
            status: "Active",
            access: true,
        };

        setUsers((prev) => [...prev, newUser]);

        handleCloseModal();
    };

    /* ─── Toggle access ─── */

    const handleToggleAccess = (userId) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          access: !user.access,
                      }
                    : user,
            ),
        );
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
                    className="self-start sm:self-auto inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#bcccdc] rounded-lg text-[#486581] text-[14px] font-semibold shadow-[0_1px_2px_rgba(16,42,67,0.04)] hover:bg-[#f0f4f7] hover:border-[#9fb3c8] transition-all duration-150 whitespace-nowrap"
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
                        className="inline-flex items-center justify-center gap-2 h-10 px-[18px] bg-[#243B53] border-0 rounded-lg text-white text-[14px] font-semibold shadow-[0_1px_3px_rgba(16,42,67,0.12)] hover:bg-[#334e68] transition-colors duration-150 whitespace-nowrap"
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
                            className="rounded-lg border border-[#d9e2ec] bg-white px-3 py-2.5 text-sm font-medium text-[#486581] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                        >
                            <option value="All">
                                {t(
                                    "usersPage.filterAll",
                                    "All",
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
                        <table className="w-full min-w-[720px] text-left rtl:text-right text-sm">
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
                                <AnimatePresence mode="popLayout">
                                    {filteredUsers.map(
                                        (user, i) => (
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
                                                        <div className="flex size-9 items-center justify-center rounded-full bg-[#e7eef5] text-xs font-bold text-[#486581] shrink-0">
                                                            {getInitials(
                                                                user.name,
                                                            )}
                                                        </div>

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
                                                            `usersPage.${ROLE_LABEL_KEYS[user.role]}`,
                                                            user.role,
                                                        )}
                                                        color={
                                                            user.roleColor
                                                        }
                                                    />
                                                </td>

                                                <td className="py-4 text-sm text-[#627d98]">
                                                    {user.department}
                                                </td>

                                                <td className="py-4">
                                                    <StatusBadge
                                                        active={
                                                            user.status ===
                                                            "Active"
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
                                                            user.access
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
                                        ),
                                    )}
                                </AnimatePresence>
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
                            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[18px] font-bold text-[#243B53] leading-[1.3]">
                                    {t(
                                        "usersPage.addUserAccount",
                                        "Add user account",
                                    )}
                                </h3>

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="text-[#829ab1] hover:text-[#243B53] transition rounded-lg p-1 hover:bg-[#f0f4f7]"
                                    aria-label="Close"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                        {t(
                                            "usersPage.fullName",
                                            "Full name",
                                        )}
                                    </label>

                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                        {t(
                                            "usersPage.emailAddress",
                                            "Email address",
                                        )}
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                        {t(
                                            "usersPage.role",
                                            "Role",
                                        )}
                                    </label>

                                    <select
                                        value={role}
                                        onChange={(e) =>
                                            setRole(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                    >
                                        <option value="Employee">
                                            {t(
                                                "usersPage.filterEmployee",
                                                "Employee",
                                            )}
                                        </option>

                                        <option value="HR">
                                            {t(
                                                "usersPage.filterHr",
                                                "HR",
                                            )}
                                        </option>

                                        <option value="Admin">
                                            {t(
                                                "usersPage.filterAdmin",
                                                "Admin",
                                            )}
                                        </option>

                                        <option value="Manager">
                                            {t(
                                                "usersPage.filterManager",
                                                "Manager",
                                            )}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#243B53] mb-1.5">
                                        {t(
                                            "usersPage.department",
                                            "Department",
                                        )}
                                    </label>

                                    <input
                                        type="text"
                                        value={department}
                                        onChange={(e) =>
                                            setDepartment(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#d9e2ec] px-3.5 py-2.5 text-sm text-[#243B53] outline-none focus:border-[#486581] focus:ring-1 focus:ring-[#486581]/20 transition"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-lg border border-[#d9e2ec] px-4 py-2.5 text-sm font-semibold text-[#486581] hover:bg-[#f0f4f7] hover:border-[#9fb3c8] transition"
                                >
                                    {t(
                                        "usersPage.cancel",
                                        "Cancel",
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCreateUser}
                                    className="rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#334e68] transition shadow-[0_1px_3px_rgba(16,42,67,0.12)]"
                                >
                                    {t(
                                        "usersPage.createUser",
                                        "Create user",
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Users;