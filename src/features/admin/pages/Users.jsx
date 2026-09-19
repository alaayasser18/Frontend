import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiPlus, FiDownload, FiX } from "react-icons/fi";

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

const Users = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState(USERS_SEED);
    const [roleFilter, setRoleFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Employee");
    const [department, setDepartment] = useState("");

    const filteredUsers = users.filter(
        (user) => roleFilter === "All" || user.role === roleFilter,
    );

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setRole("Employee");
        setDepartment("");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleCreateUser = () => {
        const newUser = {
            id: users.length + 1,
            name: fullName,
            email,
            role,
            roleColor: "#64748b",
            department,
            status: "Active",
            access: true,
        };
        setUsers((prev) => [...prev, newUser]);
        handleCloseModal();
    };
    const handleToggleAccess = (userId) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId ? { ...user, access: !user.access } : user,
            ),
        );
    };

    return (
        <div className="w-full space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-bold text-[#1e293b] tracking-tight">
                        {t("usersPage.title", "Users")}
                    </h1>
                    <p className="text-sm text-[#64748b] mt-1 font-normal">
                        {t(
                            "usersPage.subtitle",
                            "Configure and manage your WiseWork users.",
                        )}
                    </p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#f8fafc] transition shadow-2xs"
                >
                    <FiDownload className="w-4 h-4" />
                    {t("usersPage.exportConfiguration", "Export configuration")}
                </button>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h2 className="text-base font-bold text-[#1e293b]">
                            {t("usersPage.userAccounts", "User accounts")}
                        </h2>
                        <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                            {t(
                                "usersPage.userAccountsSubtitle",
                                "Manage workspace access, roles, and account status.",
                            )}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c2f42] transition"
                    >
                        <FiPlus className="w-4 h-4" />
                        {t("usersPage.addUser", "Add User")}
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-3.5 rtl:left-auto rtl:right-3.5 flex items-center pointer-events-none">
                            <FiSearch className="w-4 h-4 text-[#94a3b8]" />
                        </span>
                        <input
                            type="text"
                            placeholder={t("usersPage.searchPlaceholder", "Search users")}
                            className="w-full rounded-lg border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                    >
                        <option value="All">{t("usersPage.filterAll", "All")}</option>
                        <option value="HR">{t("usersPage.filterHr", "HR")}</option>
                        <option value="Admin">{t("usersPage.filterAdmin", "Admin")}</option>
                        <option value="Manager">
                            {t("usersPage.filterManager", "Manager")}
                        </option>
                        <option value="Employee">
                            {t("usersPage.filterEmployee", "Employee")}
                        </option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left rtl:text-right">
                        <thead>
                            <tr className="text-[11px] font-bold tracking-wider text-[#94a3b8]">
                                <th className="pb-3 pr-4">{t("usersPage.colUser", "USER")}</th>
                                <th className="pb-3 pr-4">{t("usersPage.colRole", "ROLE")}</th>
                                <th className="pb-3 pr-4">
                                    {t("usersPage.colDepartment", "DEPARTMENT")}
                                </th>
                                <th className="pb-3 pr-4">
                                    {t("usersPage.colStatus", "STATUS")}
                                </th>
                                <th className="pb-3">{t("usersPage.colAccess", "ACCESS")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9]">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-full bg-[#e7eef5] text-xs font-bold text-[#486581]">
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#1e293b]">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-[#64748b]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <span
                                            className="inline-flex items-center gap-1.5 rounded-full bg-[#f8fafc] px-2.5 py-1 text-xs font-semibold"
                                            style={{ color: user.roleColor }}
                                        >
                                            <span
                                                className="size-1.5 rounded-full"
                                                style={{ backgroundColor: user.roleColor }}
                                            />
                                            {t(`usersPage.${ROLE_LABEL_KEYS[user.role]}`, user.role)}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-sm text-[#475569]">
                                        {user.department}
                                    </td>
                                    <td className="py-4 pr-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "Active"
                                                ? "bg-[#ecfdf5] text-[#10b981]"
                                                : "bg-[#f1f5f9] text-[#94a3b8]"
                                                }`}
                                        >
                                            <span className="size-1.5 rounded-full bg-current" />
                                            {t(`usersPage.${STATUS_LABEL_KEYS[user.status]}`, user.status)}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={user.access}
                                            onClick={() => handleToggleAccess(user.id)}
                                            className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${user.access ? "bg-[#12B76A]" : "bg-[#e2e8f0]"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block size-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${user.access
                                                        ? "translate-x-2.5 rtl:-translate-x-2.5"
                                                        : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[#1e293b]">
                                {t("usersPage.addUserAccount", "Add user account")}
                            </h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="text-[#94a3b8] hover:text-[#1e293b] transition"
                                aria-label="Close"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                                    {t("usersPage.fullName", "Full name")}
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                                    {t("usersPage.emailAddress", "Email address")}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                                    {t("usersPage.role", "Role")}
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                                >
                                    <option value="Employee">
                                        {t("usersPage.filterEmployee", "Employee")}
                                    </option>
                                    <option value="HR">{t("usersPage.filterHr", "HR")}</option>
                                    <option value="Admin">
                                        {t("usersPage.filterAdmin", "Admin")}
                                    </option>
                                    <option value="Manager">
                                        {t("usersPage.filterManager", "Manager")}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                                    {t("usersPage.department", "Department")}
                                </label>
                                <input
                                    type="text"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="rounded-lg border border-[#e2e8f0] px-4 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition"
                            >
                                {t("usersPage.cancel", "Cancel")}
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateUser}
                                className="rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c2f42] transition"
                            >
                                {t("usersPage.createUser", "Create user")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;