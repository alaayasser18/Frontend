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
  FiCheckCircle,
  FiX,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  const [selectedRangeKey, setSelectedRangeKey] =
    useState("last6Months");
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHoverPoint, setActiveHoverPoint] = useState(null);

  const [toast, setToast] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    items: [],
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // --------------------------------------------------
  // Framer Motion
  // --------------------------------------------------

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
      y: 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const rowVariants = {
    hidden: {
      opacity: 0,
      x: isRtl ? 15 : -15,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.18,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.97,
      transition: {
        duration: 0.15,
      },
    },
  };

  const modalBackdropVariants = {
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
        duration: 0.15,
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 15,
      scale: 0.97,
      transition: {
        duration: 0.2,
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
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.96,
      transition: {
        duration: 0.2,
      },
    },
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const showToast = (title, message) => {
    setToast({
      visible: true,
      title,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 3000);
  };

  const closeModal = () => {
    setModal({
      open: false,
      type: "",
      title: "",
      items: [],
    });
  };

  const openModal = (type, title, items = []) => {
    setModal({
      open: true,
      type,
      title,
      items,
    });
  };

  // --------------------------------------------------
  // Range options
  // --------------------------------------------------

  const rangeOptions = [
    {
      key: "last30Days",
      defaultLabel: "Last 30 days",
    },
    {
      key: "last6Months",
      defaultLabel: "Last 6 months",
    },
    {
      key: "last12Months",
      defaultLabel: "Last 12 months",
    },
  ];

  // --------------------------------------------------
  // Metrics data
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Attention needed
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Recent activity
  // --------------------------------------------------

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
      descDefault:
        "Leave & Time Off policy was updated by Amina Hassan",
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

  // --------------------------------------------------
  // Roles
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Chart
  // --------------------------------------------------

  const chartPoints = [
    {
      monthEn: "Apr",
      monthAr: "أبريل",
      x: 50,
      y: 162,
      users: 65,
    },
    {
      monthEn: "May",
      monthAr: "مايو",
      x: 155,
      y: 140,
      users: 95,
    },
    {
      monthEn: "Jun",
      monthAr: "يونيو",
      x: 260,
      y: 125,
      users: 142,
    },
    {
      monthEn: "Jul",
      monthAr: "يوليو",
      x: 370,
      y: 110,
      users: 175,
    },
    {
      monthEn: "Aug",
      monthAr: "أغسطس",
      x: 475,
      y: 92,
      users: 208,
    },
    {
      monthEn: "Sep",
      monthAr: "سبتمبر",
      x: 585,
      y: 28,
      users: 248,
    },
  ];

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      range: selectedRangeKey,
      totalUsers: 248,
      activeRoles: 6,
      publishedPolicies: 14,
      pendingActions: 8,
      roles,
      attentionItems: attentionItems.map((item) => ({
        title: t(item.titleKey, item.titleDefault),
        description: t(item.descKey, item.descDefault),
      })),
      recentActivities: recentActivities.map((item) => ({
        title: t(item.titleKey, item.titleDefault),
        description: t(item.descKey, item.descDefault),
        time: t(item.timeKey, item.timeDefault),
      })),
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      {
        type: "application/json",
      },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "admin-dashboard-report.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setMenuOpen(false);

    showToast(
      t("adminDashboard.exportSuccessTitle", "Export successful"),
      t(
        "adminDashboard.exportSuccessMessage",
        "Dashboard report exported successfully.",
      ),
    );
  };

  const handleRefresh = () => {
    setMenuOpen(false);
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);

      showToast(
        t("adminDashboard.refreshSuccessTitle", "Data refreshed"),
        t(
          "adminDashboard.refreshSuccessMessage",
          "Dashboard data has been refreshed successfully.",
        ),
      );
    }, 900);
  };

  const handleAttentionItemClick = (item) => {
    openModal(
      "attention",
      t(item.titleKey, item.titleDefault),
      [item],
    );
  };

  const handleViewAll = () => {
    openModal(
      "attention",
      t("adminDashboard.attentionNeeded", "Attention needed"),
      attentionItems,
    );
  };

  const handleSeeActivity = () => {
    openModal(
      "activity",
      t("adminDashboard.recentActivity", "Recent activity"),
      recentActivities,
    );
  };

  const handleManageRoles = () => {
    openModal(
      "roles",
      t("adminDashboard.rolesOverview", "Roles overview"),
      roles,
    );
  };

  return (
    <>
      <motion.div
        className="w-full space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex items-start justify-between"
        >
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
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.94,
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8fafc] shadow-xs transition"
              aria-label="More options"
            >
              <FiMoreHorizontal className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`absolute ${
                    isRtl ? "left-0" : "right-0"
                  } mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e2e8f0] py-1.5 z-20 text-xs`}
                >
                  <motion.button
                    whileHover={{
                      x: isRtl ? -3 : 3,
                    }}
                    onClick={handleExportReport}
                    className={`w-full ${
                      isRtl ? "text-right" : "text-left"
                    } px-4 py-2.5 hover:bg-[#f8fafc] text-[#1e293b] flex items-center gap-2`}
                  >
                    <FiDownload className="w-3.5 h-3.5 text-[#64748b]" />
                    {t(
                      "adminDashboard.exportReport",
                      "Export report",
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{
                      x: isRtl ? -3 : 3,
                    }}
                    onClick={handleRefresh}
                    className={`w-full ${
                      isRtl ? "text-right" : "text-left"
                    } px-4 py-2.5 hover:bg-[#f8fafc] text-[#1e293b] flex items-center gap-2`}
                  >
                    <FiRefreshCw className="w-3.5 h-3.5 text-[#64748b]" />
                    {t(
                      "adminDashboard.refreshData",
                      "Refresh data",
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 4 Stats Cards Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {metrics.map((metric) => {
            const Icon = metric.icon;

            const displayChange = metric.changeKey
              ? t(metric.changeKey, metric.changeDefault)
              : metric.change;

            return (
              <motion.div
                key={metric.id}
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="bg-white rounded-2xl p-5 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{
                      rotate: 5,
                      scale: 1.08,
                    }}
                    className={`w-10 h-10 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  <span className="text-xs font-semibold text-[#10b981]">
                    {displayChange}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-[#64748b]">
                    {t(metric.titleKey, metric.titleDefault)}
                  </p>

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.25,
                      duration: 0.35,
                    }}
                    className="text-3xl font-bold text-[#0f172a] mt-1 tracking-tight"
                  >
                    {metric.value}
                  </motion.p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Growth */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1e293b]">
                  {t(
                    "adminDashboard.userGrowth",
                    "User growth",
                  )}
                </h2>

                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  {t(
                    "adminDashboard.userGrowthSubtitle",
                    "Active users across your organization",
                  )}
                </p>
              </div>

              <div className="relative">
                <motion.button
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={() =>
                    setRangeDropdownOpen(!rangeDropdownOpen)
                  }
                  className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-xs font-medium text-[#475569] hover:bg-[#f8fafc] transition shadow-2xs"
                >
                  <span>
                    {t(
                      `adminDashboard.${selectedRangeKey}`,
                      rangeOptions.find(
                        (o) => o.key === selectedRangeKey,
                      )?.defaultLabel,
                    )}
                  </span>

                  <motion.span
                    animate={{
                      rotate: rangeDropdownOpen ? 180 : 0,
                    }}
                  >
                    <FiChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {rangeDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute ${
                        isRtl ? "left-0" : "right-0"
                      } mt-1.5 w-36 bg-white border border-[#e2e8f0] rounded-xl shadow-md py-1 z-10 text-xs`}
                    >
                      {rangeOptions.map((item) => (
                        <motion.button
                          key={item.key}
                          whileHover={{
                            x: isRtl ? -2 : 2,
                          }}
                          onClick={() => {
                            setSelectedRangeKey(item.key);
                            setRangeDropdownOpen(false);

                            showToast(
                              t(
                                "adminDashboard.rangeUpdatedTitle",
                                "Range updated",
                              ),
                              t(
                                "adminDashboard.rangeUpdatedMessage",
                                "User growth range updated successfully.",
                              ),
                            );
                          }}
                          className={`w-full ${
                            isRtl
                              ? "text-right"
                              : "text-left"
                          } px-3 py-1.5 hover:bg-[#f8fafc] ${
                            selectedRangeKey === item.key
                              ? "font-semibold text-[#3f7d5a]"
                              : "text-slate-600"
                          }`}
                        >
                          {t(
                            `adminDashboard.${item.key}`,
                            item.defaultLabel,
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full h-57.5 relative pt-2">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3f7d5a"
                      stopOpacity="0.16"
                    />
                    <stop
                      offset="100%"
                      stopColor="#3f7d5a"
                      stopOpacity="0.01"
                    />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <line
                  x1="35"
                  y1="20"
                  x2="600"
                  y2="20"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />

                <text
                  x="5"
                  y="24"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="500"
                >
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

                <text
                  x="5"
                  y="77"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="500"
                >
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

                <text
                  x="5"
                  y="130"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="500"
                >
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

                {/* Area */}
                <motion.path
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  d="M 50 162
                     C 100 152, 140 142, 180 134
                     C 220 126, 240 135, 280 122
                     C 320 108, 350 130, 390 115
                     C 430 102, 460 104, 500 88
                     C 540 74, 565 60, 585 28
                     L 585 180 L 50 180 Z"
                  fill="url(#chartGradient)"
                />

                {/* Line */}
                <motion.path
                  initial={{
                    pathLength: 0,
                    opacity: 0,
                  }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.3,
                    ease: "easeInOut",
                  }}
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

                {/* Points */}
                {chartPoints.map((pt, idx) => (
                  <motion.circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    initial={{
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      opacity: 1,
                      scale:
                        activeHoverPoint === idx
                          ? 1.45
                          : 1,
                    }}
                    transition={{
                      delay: 0.8 + idx * 0.08,
                      duration: 0.25,
                    }}
                    r="4"
                    className="cursor-pointer fill-[#3f7d5a] stroke-white stroke-2"
                    onMouseEnter={() =>
                      setActiveHoverPoint(idx)
                    }
                    onMouseLeave={() =>
                      setActiveHoverPoint(null)
                    }
                  />
                ))}
              </svg>

              {/* Tooltip */}
              <AnimatePresence>
                {activeHoverPoint !== null && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 5,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 5,
                      scale: 0.9,
                    }}
                    className="absolute -top-4 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-md pointer-events-none transform -translate-x-1/2"
                    style={{
                      left: `${
                        (chartPoints[activeHoverPoint].x /
                          600) *
                        100
                      }%`,
                    }}
                  >
                    {isRtl
                      ? chartPoints[activeHoverPoint]
                          .monthAr
                      : chartPoints[activeHoverPoint]
                          .monthEn}
                    : {chartPoints[activeHoverPoint].users}{" "}
                    {t(
                      "adminDashboard.usersCount",
                      "users",
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Months */}
              <div className="flex justify-between pl-8 pr-2 pt-2 text-xs font-medium text-[#94a3b8]">
                {chartPoints.map((pt) => (
                  <motion.span
                    key={pt.monthEn}
                    whileHover={{
                      color: "#3f7d5a",
                      y: -2,
                    }}
                  >
                    {isRtl ? pt.monthAr : pt.monthEn}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Attention Needed */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-[#1e293b]">
                    {t(
                      "adminDashboard.attentionNeeded",
                      "Attention needed",
                    )}
                  </h2>

                  <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                    {t(
                      "adminDashboard.attentionSubtitle",
                      "Items that need your review",
                    )}
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    x: isRtl ? -3 : 3,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={handleViewAll}
                  className="text-xs font-semibold text-[#2f6f4d] hover:text-[#23583c] flex items-center gap-1 transition"
                >
                  <span>
                    {t(
                      "adminDashboard.viewAll",
                      "View all",
                    )}
                  </span>

                  <FiChevronRight
                    className={`w-3.5 h-3.5 stroke-[2.5] ${
                      isRtl ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>
              </div>

              <motion.div
                variants={containerVariants}
                className="space-y-3.5"
              >
                {attentionItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      variants={rowVariants}
                      whileHover={{
                        x: isRtl ? -4 : 4,
                        scale: 1.01,
                      }}
                      onClick={() =>
                        handleAttentionItemClick(item)
                      }
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8fafc] transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <motion.div
                          whileHover={{
                            scale: 1.08,
                            rotate: 4,
                          }}
                          className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>

                        <div>
                          <h4 className="text-sm font-semibold text-[#1e293b]">
                            {t(
                              item.titleKey,
                              item.titleDefault,
                            )}
                          </h4>

                          <p className="text-xs text-[#94a3b8] mt-0.5">
                            {t(
                              item.descKey,
                              item.descDefault,
                            )}
                          </p>
                        </div>
                      </div>

                      <FiChevronRight
                        className={`w-4 h-4 text-[#94a3b8] group-hover:translate-x-0.5 transition ${
                          isRtl
                            ? "rotate-180 group-hover:-translate-x-0.5"
                            : ""
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-[#1e293b]">
                    {t(
                      "adminDashboard.recentActivity",
                      "Recent activity",
                    )}
                  </h2>

                  <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                    {t(
                      "adminDashboard.recentActivitySubtitle",
                      "Latest changes in your workspace",
                    )}
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    x: isRtl ? -3 : 3,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={handleSeeActivity}
                  className="text-xs font-semibold text-[#2f6f4d] hover:text-[#23583c] flex items-center gap-1 transition"
                >
                  <span>
                    {t(
                      "adminDashboard.seeActivity",
                      "See activity",
                    )}
                  </span>

                  <FiChevronRight
                    className={`w-3.5 h-3.5 stroke-[2.5] ${
                      isRtl ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>
              </div>

              <motion.div
                variants={containerVariants}
                className="divide-y divide-[#f1f5f9]"
              >
                {recentActivities.map((act) => {
                  const Icon = act.icon;

                  return (
                    <motion.div
                      key={act.id}
                      variants={rowVariants}
                      whileHover={{
                        x: isRtl ? -3 : 3,
                      }}
                      onClick={() =>
                        openModal(
                          "activity",
                          t(
                            act.titleKey,
                            act.titleDefault,
                          ),
                          [act],
                        )
                      }
                      className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0 cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5">
                        <motion.div
                          whileHover={{
                            scale: 1.08,
                          }}
                          className={`w-10 h-10 rounded-full ${act.bg} ${act.color} flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>

                        <div>
                          <h4 className="text-sm font-semibold text-[#1e293b]">
                            {t(
                              act.titleKey,
                              act.titleDefault,
                            )}
                          </h4>

                          <p className="text-xs text-[#64748b] mt-0.5">
                            {t(
                              act.descKey,
                              act.descDefault,
                            )}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-[#94a3b8] whitespace-nowrap ml-2 rtl:ml-0 rtl:mr-2">
                        {t(
                          act.timeKey,
                          act.timeDefault,
                        )}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>

          {/* Roles Overview */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-[#1e293b]">
                    {t(
                      "adminDashboard.rolesOverview",
                      "Roles overview",
                    )}
                  </h2>

                  <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                    {t(
                      "adminDashboard.rolesSubtitle",
                      "Users by assigned role",
                    )}
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    x: isRtl ? -3 : 3,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={handleManageRoles}
                  className="text-xs font-semibold text-[#2f6f4d] hover:text-[#23583c] flex items-center gap-1 transition"
                >
                  <span>
                    {t(
                      "adminDashboard.manage",
                      "Manage",
                    )}
                  </span>

                  <FiChevronRight
                    className={`w-3.5 h-3.5 stroke-[2.5] ${
                      isRtl ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>
              </div>

              <motion.div
                variants={containerVariants}
                className="space-y-4"
              >
                {roles.map((role) => (
                  <motion.div
                    key={role.nameKey}
                    variants={rowVariants}
                    whileHover={{
                      y: -2,
                    }}
                  >
                    <div className="flex justify-between text-sm font-medium mb-1.5">
                      <span className="text-[#1e293b]">
                        {t(
                          role.nameKey,
                          role.nameDefault,
                        )}
                      </span>

                      <span className="text-[#475569] font-normal">
                        {role.count}
                      </span>
                    </div>

                    <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${role.percentage}%`,
                        }}
                        transition={{
                          duration: 0.9,
                          ease: "easeOut",
                        }}
                        className={`${role.color} h-full rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Refresh Overlay */}
      <AnimatePresence>
        {isRefreshing && (
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
            className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center"
          >
            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
              }}
              className="bg-white rounded-2xl shadow-xl border border-[#e2e8f0] px-5 py-4 flex items-center gap-3"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <FiRefreshCw className="w-5 h-5 text-[#3f7d5a]" />
              </motion.div>

              <span className="text-sm font-medium text-[#334e68]">
                {t(
                  "adminDashboard.refreshing",
                  "Refreshing data...",
                )}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-5 ${
              isRtl ? "left-5" : "right-5"
            } z-[120] flex items-center gap-3 rounded-xl border border-[#d9e2ec] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(16,42,67,0.12)]`}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[#e8f3eb] text-[#3f7d5a]">
              <FiCheckCircle size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#243B53]">
                {toast.title}
              </p>

              <p className="mt-0.5 text-xs text-[#829ab1]">
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
            className="fixed inset-0 z-[110] bg-slate-950/30 backdrop-blur-[2px] flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#eef2f7]">
                <div>
                  <h3 className="text-base font-bold text-[#1e293b]">
                    {modal.title}
                  </h3>

                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    {modal.type === "roles"
                      ? t(
                          "adminDashboard.rolesSubtitle",
                          "Users by assigned role",
                        )
                      : modal.type === "activity"
                        ? t(
                            "adminDashboard.recentActivitySubtitle",
                            "Latest changes in your workspace",
                          )
                        : t(
                            "adminDashboard.attentionSubtitle",
                            "Items that need your review",
                          )}
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.92,
                  }}
                  onClick={closeModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]"
                >
                  <FiX className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {modal.type === "roles" && (
                  <div className="space-y-4">
                    {modal.items.map((role) => (
                      <div
                        key={role.nameKey}
                        className="rounded-xl border border-[#e2e8f0] p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#1e293b]">
                            {t(
                              role.nameKey,
                              role.nameDefault,
                            )}
                          </span>

                          <span className="text-sm font-medium text-[#475569]">
                            {role.count} users
                          </span>
                        </div>

                        <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${role.percentage}%`,
                            }}
                            transition={{
                              duration: 0.7,
                            }}
                            className={`${role.color} h-full rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {modal.type === "activity" && (
                  <div className="space-y-3">
                    {modal.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          className="flex items-start gap-3 p-3 rounded-xl border border-[#e2e8f0]"
                        >
                          <div
                            className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-[#1e293b]">
                              {t(
                                item.titleKey,
                                item.titleDefault,
                              )}
                            </h4>

                            <p className="text-xs text-[#64748b] mt-1">
                              {t(
                                item.descKey,
                                item.descDefault,
                              )}
                            </p>

                            <span className="inline-block text-[11px] text-[#94a3b8] mt-1.5">
                              {t(
                                item.timeKey,
                                item.timeDefault,
                              )}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {modal.type === "attention" && (
                  <div className="space-y-3">
                    {modal.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{
                            opacity: 0,
                            x: isRtl ? 10 : -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[#e2e8f0]"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-[#1e293b]">
                              {t(
                                item.titleKey,
                                item.titleDefault,
                              )}
                            </h4>

                            <p className="text-xs text-[#64748b] mt-0.5">
                              {t(
                                item.descKey,
                                item.descDefault,
                              )}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-4 border-t border-[#eef2f7] flex justify-end">
                <motion.button
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-[#3f7d5a] text-white text-xs font-semibold hover:bg-[#356c4d] transition"
                >
                  {t("common.close", "Close")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminDashboard;