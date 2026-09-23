import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FiUsers,
  FiClock,
  FiFileText,
  FiDollarSign,
  FiAlertTriangle,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";

const HrDashboard = () => {
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language?.toLowerCase().startsWith("ar");

  // ======================== Stat Cards Data ========================
  const statCards = useMemo(
    () => [
      {
        id: "totalEmployees",
        labelKey: "hrDashboard.totalEmployees",
        labelDefault: "TOTAL EMPLOYEES",
        value: "142",
        subtitleKey: "hrDashboard.totalEmployeesSub",
        subtitleDefault: "+6% month over month",
        icon: FiUsers,
        iconBg: "bg-[#eff6ff]",
        iconColor: "text-[#3b82f6]",
      },
      {
        id: "presentToday",
        labelKey: "hrDashboard.presentToday",
        labelDefault: "PRESENT TODAY",
        value: "128",
        subtitleKey: "hrDashboard.presentTodaySub",
        subtitleDefault: "90.1% workforce present",
        icon: FiClock,
        iconBg: "bg-[#ecfdf5]",
        iconColor: "text-[#10b981]",
      },
      {
        id: "pendingReviews",
        labelKey: "hrDashboard.pendingReviews",
        labelDefault: "PENDING REVIEWS",
        value: "7",
        subtitleKey: "hrDashboard.pendingReviewsSub",
        subtitleDefault: "4 leaves · 3 advances",
        icon: FiFileText,
        iconBg: "bg-[#fff7ed]",
        iconColor: "text-[#f97316]",
      },
      {
        id: "projectedPayroll",
        labelKey: "hrDashboard.projectedPayroll",
        labelDefault: "PROJECTED PAYROLL",
        value: "$184,500",
        subtitleKey: "hrDashboard.projectedPayrollSub",
        subtitleDefault: "September execution",
        icon: FiDollarSign,
        iconBg: "bg-[#f5f3ff]",
        iconColor: "text-[#8b5cf6]",
      },
    ],
    [],
  );

  // ======================== Employee Attention Signals ========================
  const attentionSignals = useMemo(
    () => [
      {
        id: 1,
        nameKey: "hrDashboard.signal1Name",
        nameDefault: "Youssef Lotfy",
        badgeKey: "hrDashboard.signal1Badge",
        badgeDefault: "High attention",
        descKey: "hrDashboard.signal1Desc",
        descDefault: "Lateness spike across the past 3 weeks",
        badgeColor: "bg-[#fef2f2] text-[#dc2626]",
      },
      {
        id: 2,
        nameKey: "hrDashboard.signal2Name",
        nameDefault: "Karim Ashraf",
        badgeKey: "hrDashboard.signal2Badge",
        badgeDefault: "Medium attention",
        descKey: "hrDashboard.signal2Desc",
        descDefault: "Task velocity declined 18% across two sprints",
        badgeColor: "bg-[#fff7ed] text-[#ea580c]",
      },
      {
        id: 3,
        nameKey: "hrDashboard.signal3Name",
        nameDefault: "Alexandria Hub",
        badgeKey: "hrDashboard.signal3Badge",
        badgeDefault: "Low attention",
        descKey: "hrDashboard.signal3Desc",
        descDefault: "Attendance improved 9% after shift adjustment",
        badgeColor: "bg-[#ecfdf5] text-[#16a34a]",
      },
    ],
    [],
  );

  // ======================== Operational Readiness ========================
  const readinessItems = useMemo(
    () => [
      {
        id: 1,
        labelKey: "hrDashboard.readiness1",
        labelDefault: "Attendance verification",
        value: 90,
        color: "bg-[#16a34a]",
      },
      {
        id: 2,
        labelKey: "hrDashboard.readiness2",
        labelDefault: "Leave approvals",
        value: 76,
        color: "bg-[#ca8a04]",
      },
      {
        id: 3,
        labelKey: "hrDashboard.readiness3",
        labelDefault: "Q3 evaluations",
        value: 68,
        color: "bg-[#2563eb]",
      },
      {
        id: 4,
        labelKey: "hrDashboard.readiness4",
        labelDefault: "Payroll reconciliation",
        value: 94,
        color: "bg-[#4d7c0f]",
      },
    ],
    [],
  );

  // ======================== Animations ========================
  const containerVariants = {
    hidden: {},
    show: {
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
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const cardHover = {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  };

  return (
    <motion.div
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* ==================== Header ==================== */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          {/* تم إضافة الـ Breadcrumb بنفس مقاسات ولون الصفحة السابقة */}
          <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
            {t("hrDashboard.breadcrumb", "HR Portal / Command Center")}
          </p>
          <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight mt-1">
            {t("hrDashboard.title", "HR Command Center")}
          </h1>
          <p className="text-sm text-[#64748b] mt-1 font-normal">
            {t(
              "hrDashboard.subtitle",
              "A live operational view of workforce health, approvals, and payroll readiness.",
            )}
          </p>
        </div>

        {/* تم تعديل الزر ليطابق الزر الكحلي في التصميم الأساسي */}
        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
        >
          <FiStar className="h-4 w-4" />
          <span>{t("hrDashboard.explainToday", "Explain today")}</span>
        </motion.button>
      </motion.div>

      {/* ==================== 4 Stat Cards ==================== */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={cardHover}
              className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0]/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                {/* تم تعديل الخط ليكون 11px ولونه #94a3b8 */}
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  {t(card.labelKey, card.labelDefault)}
                </p>
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.08 }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </motion.div>
              </div>

              <div className="mt-2">
                {/* تم تعديل حجم الرقم لـ 27px */}
                <p className="text-[27px] font-bold tracking-tight text-[#0f172a]">
                  {card.value}
                </p>
                {/* تم تعديل الوصف السفلي */}
                <p className="mt-1 text-xs font-normal text-[#64748b]">
                  {t(card.subtitleKey, card.subtitleDefault)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ==================== Bottom Section ==================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ================= Employee Attention Signals ================= */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#1e293b]">
              {t(
                "hrDashboard.attentionSignalsTitle",
                "Employee attention signals",
              )}
            </h2>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#f0fdf4] px-3 py-1.5 text-xs font-semibold text-[#16a34a] transition hover:bg-[#dcfce7]"
            >
              <FiStar className="h-3.5 w-3.5" />
              <span>
                {t("hrDashboard.groundedMetrics", "Grounded metrics")}
              </span>
            </motion.button>
          </div>

          <motion.div
            variants={containerVariants}
            className="divide-y divide-[#f1f5f9]"
          >
            {attentionSignals.map((signal) => (
              <motion.div
                key={signal.id}
                variants={itemVariants}
                whileHover={{ x: isRtl ? -3 : 3 }}
                className="group flex items-center justify-between py-3.5 first:pt-0 last:pb-0 transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fef9c3] text-[#ca8a04]"
                  >
                    <FiAlertTriangle className="h-4 w-4" />
                  </motion.div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[#1e293b]">
                        {t(signal.nameKey, signal.nameDefault)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${signal.badgeColor}`}
                      >
                        {t(signal.badgeKey, signal.badgeDefault)}
                      </span>
                    </div>
                    {/* تم توحيد لون النص الفرعي ليطابق الهيكل */}
                    <p className="mt-0.5 text-xs text-[#64748b]">
                      {t(signal.descKey, signal.descDefault)}
                    </p>
                  </div>
                </div>

                {/* تم تغيير شكل زر Review ليطابق زر النص الأخضر في صفحة Manager */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="text-sm font-semibold text-[#2f6f4d] hover:text-[#23583c] transition shrink-0 ms-3"
                >
                  {t("hrDashboard.review", "Review")}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ================= Operational Readiness ================= */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#e2e8f0]/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1e293b]">
              {t("hrDashboard.operationalReadiness", "Operational readiness")}
            </h2>
          </div>

          <motion.div variants={containerVariants} className="space-y-5">
            {readinessItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span className="text-sm font-semibold text-[#1e293b]">
                    {t(item.labelKey, item.labelDefault)}
                  </span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + item.id * 0.1, duration: 0.3 }}
                    className="font-semibold text-[#1e293b]"
                  >
                    {item.value}%
                  </motion.span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{
                      duration: 0.9,
                      delay: 0.25 + item.id * 0.1,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HrDashboard;
