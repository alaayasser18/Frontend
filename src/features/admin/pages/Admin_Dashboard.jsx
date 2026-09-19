import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiUsers,
  FiShield,
  FiFileText,
  FiClock,
  FiMoreHorizontal,
  FiChevronDown,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [selectedRangeKey, setSelectedRangeKey] = useState("last6Months");
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHoverPoint, setActiveHoverPoint] = useState(null);

  // Range options mapping
  const rangeOptions = [
    { key: "last30Days", defaultLabel: "Last 30 days" },
    { key: "last6Months", defaultLabel: "Last 6 months" },
    { key: "last12Months", defaultLabel: "Last 12 months" },
  ];

  // Metrics data
  const metrics = [
    {
      id: "users",
      titleKey: "adminDashboard.totalUsers",
      titleDefault: "Total users",
      value: "248",
      change: "+12.4%",
      icon: FiUsers,
      bg: "bg-[#ecfdf5]",
      color: "text-[#10b981]",
    },
    {
      id: "roles",
      titleKey: "adminDashboard.activeRoles",
      titleDefault: "Active roles",
      value: "6",
      changeKey: "adminDashboard.newBadge",
      changeDefault: "+1 new",
      icon: FiShield,
      bg: "bg-[#eff6ff]",
      color: "text-[#3b82f6]",
    },
    {
      id: "policies",
      titleKey: "adminDashboard.publishedPolicies",
      titleDefault: "Published policies",
      value: "14",
      changeKey: "adminDashboard.thisMonthBadge",
      changeDefault: "+2 this month",
      icon: FiFileText,
      bg: "bg-[#fff7ed]",
      color: "text-[#f97316]",
    },
    {
      id: "actions",
      titleKey: "adminDashboard.pendingActions",
      titleDefault: "Pending actions",
      value: "8",
      changeKey: "adminDashboard.needsAttention",
      changeDefault: "Needs attention",
      icon: FiClock,
      bg: "bg-[#f5f3ff]",
      color: "text-[#8b5cf6]",
    },
  ];

  // Attention needed data
  const attentionItems = [
    {
      id: 1,
      titleKey: "adminDashboard.pendingInvitations",
      titleDefault: "4 pending invitations",
      descKey: "adminDashboard.pendingInvitationsDesc",
      descDefault: "Users are waiting to join",
      icon: FiUser,
      bg: "bg-[#fef3c7]",
      color: "text-[#d97706]",
    },
    {
      id: 2,
      titleKey: "adminDashboard.policiesToReview",
      titleDefault: "2 policies to review",
      descKey: "adminDashboard.policiesToReviewDesc",
      descDefault: "Annual review is due",
      icon: FiFileText,
      bg: "bg-[#ffedd5]",
      color: "text-[#f97316]",
    },
    {
      id: 3,
      titleKey: "adminDashboard.roleUpdates",
      titleDefault: "2 role updates",
      descKey: "adminDashboard.roleUpdatesDesc",
      descDefault: "Changes need approval",
      icon: FiShield,
      bg: "bg-[#e0f2fe]",
      color: "text-[#0284c7]",
    },
  ];

  // Recent activity data
  const recentActivities = [
    {
      id: 1,
      titleKey: "adminDashboard.newUserInvited",
      titleDefault: "New user invited",
      descKey: "adminDashboard.newUserInvitedDesc",
      descDefault: "David Okafor was invited as an Employee",
      timeKey: "adminDashboard.minAgo",
      timeDefault: "12 minutes ago",
      icon: FiUser,
      bg: "bg-[#ecfdf5]",
      color: "text-[#10b981]",
    },
    {
      id: 2,
      titleKey: "adminDashboard.policyUpdated",
      titleDefault: "Policy updated",
      descKey: "adminDashboard.policyUpdatedDesc",
      descDefault: "Leave & Time Off policy was updated by Amina Hassan",
      timeKey: "adminDashboard.hoursAgo",
      timeDefault: "2 hours ago",
      icon: FiFileText,
      bg: "bg-[#e0f2fe]",
      color: "text-[#0284c7]",
    },
    {
      id: 3,
      titleKey: "adminDashboard.rolePermissionsChanged",
      titleDefault: "Role permissions changed",
      descKey: "adminDashboard.rolePermissionsChangedDesc",
      descDefault: "Manager permissions were updated",
      timeKey: "adminDashboard.yesterdayAt",
      timeDefault: "Yesterday at 4:24 PM",
      icon: FiShield,
      bg: "bg-[#ffedd5]",
      color: "text-[#f97316]",
    },
  ];

  // Roles breakdown
  const roles = [
    {
      nameKey: "adminDashboard.employee",
      nameDefault: "Employee",
      count: 186,
      percentage: 75,
      color: "bg-[#477a5b]",
    },
    {
      nameKey: "adminDashboard.manager",
      nameDefault: "Manager",
      count: 42,
      percentage: 17,
      color: "bg-[#2d4b68]",
    },
    {
      nameKey: "adminDashboard.hrManager",
      nameDefault: "HR Manager",
      count: 14,
      percentage: 6,
      color: "bg-[#c58a28]",
    },
    {
      nameKey: "adminDashboard.administrator",
      nameDefault: "Administrator",
      count: 6,
      percentage: 2.5,
      color: "bg-[#3e5f7a]",
    },
  ];

  // Chart data points with localized month labels
  const chartPoints = [
    { monthEn: "Apr", monthAr: "أبريل", x: 50, y: 162, users: 65 },
    { monthEn: "May", monthAr: "مايو", x: 155, y: 140, users: 95 },
    { monthEn: "Jun", monthAr: "يونيو", x: 260, y: 125, users: 142 },
    { monthEn: "Jul", monthAr: "يوليو", x: 370, y: 110, users: 175 },
    { monthEn: "Aug", monthAr: "أغسطس", x: 475, y: 92, users: 208 },
    { monthEn: "Sep", monthAr: "سبتمبر", x: 585, y: 28, users: 248 },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#1e293b] tracking-tight">
            {t("adminDashboard.dashboard", "Dashboard")}
          </h1>
          <p className="text-sm text-[#64748b] mt-1 font-normal">
            {t(
              "adminDashboard.overviewSubtitle",
              "Manage your organization's people, access, and settings.",
            )}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8fafc] shadow-xs transition"
            aria-label="More options"
          >
            <FiMoreHorizontal className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div
              className={`absolute ${isRtl ? "left-0" : "right-0"} mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e2e8f0] py-1.5 z-20 text-xs`}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className={`w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2 hover:bg-[#f8fafc] text-[#1e293b]`}
              >
                {t("adminDashboard.exportReport", "Export report")}
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className={`w-full ${isRtl ? "text-right" : "text-left"} px-4 py-2 hover:bg-[#f8fafc] text-[#1e293b]`}
              >
                {t("adminDashboard.refreshData", "Refresh data")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const displayChange = metric.changeKey
            ? t(metric.changeKey, metric.changeDefault)
            : metric.change;
          return (
            <div
              key={metric.id}
              className="bg-white rounded-2xl p-5 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#10b981]">
                  {displayChange}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-[#64748b]">
                  {t(metric.titleKey, metric.titleDefault)}
                </p>
                <p className="text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: User Growth & Attention Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Growth (Left 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#1e293b]">
                {t("adminDashboard.userGrowth", "User growth")}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                {t(
                  "adminDashboard.userGrowthSubtitle",
                  "Active users across your organization",
                )}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
                className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-xs font-medium text-[#475569] hover:bg-[#f8fafc] transition shadow-2xs"
              >
                <span>
                  {t(
                    `adminDashboard.${selectedRangeKey}`,
                    rangeOptions.find((o) => o.key === selectedRangeKey)
                      ?.defaultLabel,
                  )}
                </span>
                <FiChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
              </button>
              {rangeDropdownOpen && (
                <div
                  className={`absolute ${isRtl ? "left-0" : "right-0"} mt-1.5 w-36 bg-white border border-[#e2e8f0] rounded-xl shadow-md py-1 z-10 text-xs`}
                >
                  {rangeOptions.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSelectedRangeKey(item.key);
                        setRangeDropdownOpen(false);
                      }}
                      className={`w-full ${isRtl ? "text-right" : "text-left"} px-3 py-1.5 hover:bg-[#f8fafc] ${
                        selectedRangeKey === item.key
                          ? "font-semibold text-[#3f7d5a]"
                          : "text-slate-600"
                      }`}
                    >
                      {t(`adminDashboard.${item.key}`, item.defaultLabel)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-57.5 relative pt-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3f7d5a" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#3f7d5a" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Grid lines & Labels */}
              <line
                x1="35"
                y1="20"
                x2="600"
                y2="20"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text x="5" y="24" fill="#94a3b8" fontSize="11" fontWeight="500">
                300
              </text>

              <line
                x1="35"
                y1="73"
                x2="600"
                y2="73"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text x="5" y="77" fill="#94a3b8" fontSize="11" fontWeight="500">
                200
              </text>

              <line
                x1="35"
                y1="126"
                x2="600"
                y2="126"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text x="5" y="130" fill="#94a3b8" fontSize="11" fontWeight="500">
                100
              </text>

              <line
                x1="35"
                y1="180"
                x2="600"
                y2="180"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x="12"
                y="184"
                fill="#94a3b8"
                fontSize="11"
                fontWeight="500"
              >
                0
              </text>

              {/* Area fill */}
              <path
                d="M 50 162 
                   C 100 152, 140 142, 180 134 
                   C 220 126, 240 135, 280 122 
                   C 320 108, 350 130, 390 115 
                   C 430 102, 460 104, 500 88 
                   C 540 74, 565 60, 585 28 
                   L 585 180 L 50 180 Z"
                fill="url(#chartGradient)"
              />

              {/* Line stroke */}
              <path
                d="M 50 162 
                   C 100 152, 140 142, 180 134 
                   C 220 126, 240 135, 280 122 
                   C 320 108, 350 130, 390 115 
                   C 430 102, 460 104, 500 88 
                   C 540 74, 565 60, 585 28"
                fill="none"
                stroke="#3f7d5a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Dots on Hover */}
              {chartPoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={activeHoverPoint === idx ? 6 : 4}
                  className="cursor-pointer transition-all duration-200 fill-[#3f7d5a] stroke-white stroke-2 hover:r-6"
                  onMouseEnter={() => setActiveHoverPoint(idx)}
                  onMouseLeave={() => setActiveHoverPoint(null)}
                />
              ))}
            </svg>

            {/* Floating Tooltip */}
            {activeHoverPoint !== null && (
              <div
                className="absolute -top-4 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-md pointer-events-none transform -translate-x-1/2 transition-opacity"
                style={{
                  left: `${(chartPoints[activeHoverPoint].x / 600) * 100}%`,
                }}
              >
                {isRtl
                  ? chartPoints[activeHoverPoint].monthAr
                  : chartPoints[activeHoverPoint].monthEn}
                : {chartPoints[activeHoverPoint].users}{" "}
                {t("adminDashboard.usersCount", "users")}
              </div>
            )}

            {/* X-Axis Months */}
            <div className="flex justify-between pl-8 pr-2 pt-2 text-xs font-medium text-[#94a3b8]">
              {chartPoints.map((pt) => (
                <span key={pt.monthEn}>{isRtl ? pt.monthAr : pt.monthEn}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Attention Needed (Right 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1e293b]">
                  {t("adminDashboard.attentionNeeded", "Attention needed")}
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  {t(
                    "adminDashboard.attentionSubtitle",
                    "Items that need your review",
                  )}
                </p>
              </div>
              <button className="text-xs font-semibold text-[#2f6f4d] hover:text-[#23583c] flex items-center gap-1 transition">
                <span>{t("adminDashboard.viewAll", "View all")}</span>
                <FiChevronRight
                  className={`w-3.5 h-3.5 stroke-[2.5] ${isRtl ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div className="space-y-3.5">
              {attentionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8fafc] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#1e293b]">
                          {t(item.titleKey, item.titleDefault)}
                        </h4>
                        <p className="text-xs text-[#94a3b8] mt-0.5">
                          {t(item.descKey, item.descDefault)}
                        </p>
                      </div>
                    </div>
                    <FiChevronRight
                      className={`w-4 h-4 text-[#94a3b8] group-hover:translate-x-0.5 transition ${isRtl ? "rotate-180 group-hover:-translate-x-0.5" : ""}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Roles Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity (Left) */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1e293b]">
                  {t("adminDashboard.recentActivity", "Recent activity")}
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  {t(
                    "adminDashboard.recentActivitySubtitle",
                    "Latest changes in your workspace",
                  )}
                </p>
              </div>
              <button className="text-xs font-semibold text-[#2f6f4d] hover:text-[#23583c] flex items-center gap-1 transition">
                <span>{t("adminDashboard.seeActivity", "See activity")}</span>
                <FiChevronRight
                  className={`w-3.5 h-3.5 stroke-[2.5] ${isRtl ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div className="divide-y divide-[#f1f5f9]">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-full ${act.bg} ${act.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#1e293b]">
                          {t(act.titleKey, act.titleDefault)}
                        </h4>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {t(act.descKey, act.descDefault)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#94a3b8] whitespace-nowrap ml-2 rtl:ml-0 rtl:mr-2">
                      {t(act.timeKey, act.timeDefault)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Roles Overview (Right) */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1e293b]">
                  {t("adminDashboard.rolesOverview", "Roles overview")}
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  {t("adminDashboard.rolesSubtitle", "Users by assigned role")}
                </p>
              </div>
              <button className="text-xs font-semibold text-[#2f6f4d] hover:text-[#23583c] flex items-center gap-1 transition">
                <span>{t("adminDashboard.manage", "Manage")}</span>
                <FiChevronRight
                  className={`w-3.5 h-3.5 stroke-[2.5] ${isRtl ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.nameKey}>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-[#1e293b]">
                      {t(role.nameKey, role.nameDefault)}
                    </span>
                    <span className="text-[#475569] font-normal">
                      {role.count}
                    </span>
                  </div>
                  <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${role.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${role.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
