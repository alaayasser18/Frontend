import { useMemo, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  FiSearch,
  FiArrowUpRight,
  FiChevronRight,
  FiFileText,
  FiRefreshCw,
  FiEye,
  FiX,
  FiUser,
  FiCalendar,
  FiLayers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getAuditLogs } from "../../../api/auditsApi";

const ActivityLog = ({ role }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const isRtl = i18n.language?.startsWith("ar");
  const isHrPath = location.pathname.startsWith("/hr") || role === "HR" || role === "hr";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // "All" | "create" | "update" | "delete"
  const [selectedLog, setSelectedLog] = useState(null); // For detail modal

  // =========================
  // Fetch audit logs from API
  // =========================
  const fetchLogs = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
      const response = await getAuditLogs({ lang });

      if (response && response.success && Array.isArray(response.data)) {
        setLogs(response.data);
      } else if (Array.isArray(response?.data)) {
        setLogs(response.data);
      } else if (Array.isArray(response)) {
        setLogs(response);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      const msg = err.response?.data?.message || err.message || "Failed to load audit logs";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // =========================
  // Helper: Format Action Label
  // =========================
  const formatAction = (rawAction) => {
    if (!rawAction) return t("auditLogs.filterInfo", "Event");
    // If translation key exists
    const translationKey = `auditLogs.actions.${rawAction}`;
    const translated = t(translationKey);
    if (translated !== translationKey) {
      return translated;
    }
    // Convert e.g. "leave_created" -> "Leave Created"
    return rawAction
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // =========================
  // Helper: Format Entity Type
  // =========================
  const formatEntityType = (entityType) => {
    if (!entityType) return "System";
    const parts = entityType.split("\\");
    return parts[parts.length - 1] || entityType;
  };

  // =========================
  // Helper: Action Severity Badge
  // =========================
  const getActionBadge = (action = "") => {
    const act = String(action).toLowerCase();
    if (act.includes("create") || act.includes("store") || act.includes("add") || act.includes("invite")) {
      return {
        bg: "bg-[#ecfdf5]",
        text: "text-[#10b981]",
        dot: "bg-[#10b981]",
        type: "create",
        label: t("auditLogs.filterSuccess", "Created"),
      };
    }
    if (act.includes("update") || act.includes("change") || act.includes("edit") || act.includes("approve")) {
      return {
        bg: "bg-[#fffbeb]",
        text: "text-[#d97706]",
        dot: "bg-[#d97706]",
        type: "update",
        label: t("auditLogs.filterWarning", "Updated"),
      };
    }
    if (act.includes("delete") || act.includes("destroy") || act.includes("remove") || act.includes("reject")) {
      return {
        bg: "bg-[#fef2f2]",
        text: "text-[#ef4444]",
        dot: "bg-[#ef4444]",
        type: "delete",
        label: isRtl ? "حذف" : "Deleted",
      };
    }
    return {
      bg: "bg-[#f1f5f9]",
      text: "text-[#64748b]",
      dot: "bg-[#64748b]",
      type: "info",
      label: t("auditLogs.filterInfo", "Info"),
    };
  };

  // =========================
  // Format Date & Time
  // =========================
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleString(isRtl ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // =========================
  // Filter logs
  // =========================
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const badge = getActionBadge(log.action);

      const matchesFilter =
        activeFilter === "All" ||
        badge.type.toLowerCase() === activeFilter.toLowerCase();

      const actionText = formatAction(log.action).toLowerCase();
      const entityText = formatEntityType(log.entity_type).toLowerCase();
      const userIdText = String(log.user_id || "").toLowerCase();
      const dateText = String(log.created_at || "").toLowerCase();
      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !search ||
        actionText.includes(search) ||
        entityText.includes(search) ||
        userIdText.includes(search) ||
        dateText.includes(search) ||
        JSON.stringify(log.new_values || "").toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [logs, activeFilter, searchQuery, isRtl]);

  // =========================
  // Export Audit Logs
  // =========================
  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast.error(isRtl ? "لا توجد سجلات للتصدير" : "No logs available to export");
      return;
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      filters: {
        search: searchQuery || null,
        filter: activeFilter === "All" ? null : activeFilter,
      },
      totalLogs: filteredLogs.length,
      logs: filteredLogs.map((log) => ({
        id: log.id,
        action: formatAction(log.action),
        entityType: formatEntityType(log.entity_type),
        entityId: log.entity_id,
        userId: log.user_id,
        createdAt: log.created_at,
        oldValues: log.old_values,
        newValues: log.new_values,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `wisework_audit_logs_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    toast.success(
      t("auditLogs.exportSuccess", "Activity log exported successfully."),
      { duration: 3000, icon: "✓" }
    );
  };

  // =========================
  // Filter options
  // =========================
  const filterOptions = [
    { key: "All", label: t("auditLogs.filterAll", "All") },
    { key: "create", label: t("auditLogs.filterSuccess", "Created") },
    { key: "update", label: t("auditLogs.filterWarning", "Updated") },
    { key: "delete", label: isRtl ? "محذوف" : "Deleted" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full space-y-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* =========================
          Breadcrumb
      ========================= */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#64748b]">
        <span>
          {isHrPath
            ? t("portal.hrPortal", "HR Portal")
            : t("auditLogs.breadcrumbAdmin", "Administration")}
        </span>
        <FiChevronRight
          className={`w-3.5 h-3.5 text-[#94a3b8] ${isRtl ? "rotate-180" : ""}`}
        />
        <span className="text-[#334e68] font-semibold">
          {t("auditLogs.title", "Audit Logs")}
        </span>
      </div>

      {/* =========================
          Page Header
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-[#1e293b] tracking-tight">
            {t("auditLogs.title", "Audit Logs")}
          </h1>
          <p className="text-sm text-[#64748b] mt-1 font-normal">
            {t(
              "auditLogs.subtitle",
              "A searchable record of administrative actions and system events."
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <motion.button
            type="button"
            onClick={() => fetchLogs(true)}
            disabled={loading || isRefreshing}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-xs sm:text-sm font-semibold text-[#1e293b] hover:bg-[#f8fafc] hover:border-[#cbd5e1] shadow-2xs transition disabled:opacity-50 cursor-pointer"
            title={isRtl ? "تحديث" : "Refresh"}
          >
            <FiRefreshCw
              className={`w-4 h-4 text-[#475569] ${
                isRefreshing ? "animate-spin text-[#3f7d5a]" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {isRtl ? "تحديث" : "Refresh"}
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleExport}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-xs sm:text-sm font-semibold text-[#1e293b] hover:bg-[#f8fafc] hover:border-[#cbd5e1] shadow-2xs transition cursor-pointer"
          >
            <FiArrowUpRight className="w-4 h-4 text-[#475569]" />
            <span>{t("auditLogs.exportConfig", "Export JSON")}</span>
          </motion.button>
        </div>
      </div>

      {/* =========================
          Main Table Card
      ========================= */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6"
      >
        {/* Card Header & Counter */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base md:text-lg font-bold text-[#1e293b]">
              {t("auditLogs.cardTitle", "Audit logs")}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5 font-normal">
              {t(
                "auditLogs.cardSubtitle",
                "Review administrative actions and system events."
              )}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#475569]">
            {filteredLogs.length} {isRtl ? "سجل" : "records"}
          </span>
        </div>

        {/* =========================
            Filter & Search Toolbar
        ========================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <FiSearch
              className={`absolute ${
                isRtl ? "right-3.5" : "left-3.5"
              } top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                "auditLogs.searchPlaceholder",
                "Search by action, user ID, or entity..."
              )}
              className={`w-full ${
                isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2 border border-[#e2e8f0] rounded-xl text-xs sm:text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#3f7d5a] focus:ring-1 focus:ring-[#3f7d5a]/20 transition bg-white`}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <motion.button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  whileTap={{ scale: 0.96 }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#243b53] text-white shadow-2xs"
                      : "bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]"
                  }`}
                >
                  {filter.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* =========================
            Table Content
        ========================= */}
        {loading && !isRefreshing ? (
          <div className="py-16 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-slate-100/80 animate-pulse rounded-xl w-full"
              />
            ))}
          </div>
        ) : error && logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#94a3b8] space-y-3">
            <FiFileText className="w-10 h-10 mx-auto text-red-300" />
            <p className="text-red-600 font-medium">{error}</p>
            <button
              type="button"
              onClick={() => fetchLogs()}
              className="px-4 py-2 bg-[#243b53] text-white rounded-lg text-xs font-semibold hover:bg-[#1a2d3f] transition"
            >
              {isRtl ? "إعادة المحاولة" : "Try Again"}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-[#f1f5f9] text-[11px] font-bold text-[#94a3b8] tracking-wider uppercase">
                  <th className="pb-3.5 px-2">#</th>
                  <th className="pb-3.5 px-3">
                    {t("auditLogs.colAction", "ACTION")}
                  </th>
                  <th className="pb-3.5 px-3">
                    {isRtl ? "الكيان المتأثر" : "ENTITY"}
                  </th>
                  <th className="pb-3.5 px-3">
                    {t("auditLogs.colActor", "USER ID")}
                  </th>
                  <th className="pb-3.5 px-3">
                    {t("auditLogs.colTimestamp", "TIMESTAMP")}
                  </th>
                  <th className="pb-3.5 px-2 text-center">
                    {isRtl ? "التفاصيل" : "DETAILS"}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f8fafc]">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => {
                    const badge = getActionBadge(log.action);
                    const hasValues = Boolean(log.new_values || log.old_values);

                    return (
                      <motion.tr
                        key={log.id || index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="hover:bg-[#f8fafc]/80 transition group"
                      >
                        {/* ID */}
                        <td className="py-4 px-2 text-xs font-mono text-[#94a3b8]">
                          #{log.id}
                        </td>

                        {/* Action with Badge */}
                        <td className="py-4 px-3 text-sm font-semibold text-[#1e293b]">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${badge.bg} ${badge.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                              />
                              <span>{formatAction(log.action)}</span>
                            </span>
                          </div>
                        </td>

                        {/* Entity */}
                        <td className="py-4 px-3 text-xs text-[#475569] font-medium">
                          <span className="font-semibold text-[#1e293b]">
                            {formatEntityType(log.entity_type)}
                          </span>
                          {log.entity_id && (
                            <span className="text-[#94a3b8] ml-1 rtl:ml-0 rtl:mr-1">
                              (#{log.entity_id})
                            </span>
                          )}
                        </td>

                        {/* User / Actor */}
                        <td className="py-4 px-3 text-xs text-[#475569]">
                          <span className="inline-flex items-center gap-1.5 bg-[#f8fafc] px-2 py-1 rounded-md text-[#334e68] font-mono">
                            <FiUser className="w-3 h-3 text-[#94a3b8]" />
                            {log.user_id ? `User #${log.user_id}` : "System"}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="py-4 px-3 text-xs text-[#64748b] font-normal whitespace-nowrap">
                          {formatDateTime(log.created_at)}
                        </td>

                        {/* Details Button */}
                        <td className="py-4 px-2 text-center whitespace-nowrap">
                          {hasValues ? (
                            <button
                              type="button"
                              onClick={() => setSelectedLog(log)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#2f6f4d] hover:bg-[#ecfdf5] rounded-lg transition cursor-pointer"
                            >
                              <FiEye className="w-3.5 h-3.5" />
                              <span>{isRtl ? "عرض" : "View"}</span>
                            </button>
                          ) : (
                            <span className="text-xs text-[#cbd5e1]">—</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-xs text-[#94a3b8]"
                    >
                      <FiFileText className="w-8 h-8 mx-auto mb-2 text-[#cbd5e1]" />
                      <p>
                        {t("auditLogs.noLogsFound", "No logs found matching your criteria.")}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* =========================
          Detail Modal for old/new values
      ========================= */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLog(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#e2e8f0] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <div>
                  <h3 className="text-base font-bold text-[#1e293b]">
                    {isRtl ? "تفاصيل سجل التدقيق" : "Audit Log Record"} #{selectedLog.id}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {formatAction(selectedLog.action)} · {formatDateTime(selectedLog.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#1e293b] transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Entity & Actor summary */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#f8fafc] p-3 rounded-xl">
                <div>
                  <span className="text-[#94a3b8] block">
                    {isRtl ? "الكيان:" : "Entity:"}
                  </span>
                  <span className="font-semibold text-[#1e293b]">
                    {formatEntityType(selectedLog.entity_type)} (#{selectedLog.entity_id})
                  </span>
                </div>
                <div>
                  <span className="text-[#94a3b8] block">
                    {isRtl ? "المنفذ:" : "Actor / User:"}
                  </span>
                  <span className="font-semibold text-[#1e293b]">
                    {selectedLog.user_id ? `User #${selectedLog.user_id}` : "System"}
                  </span>
                </div>
              </div>

              {/* New Values */}
              {selectedLog.new_values && (
                <div>
                  <h4 className="text-xs font-bold text-[#059669] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    {isRtl ? "القيم الجديدة (New Values):" : "New Values:"}
                  </h4>
                  <pre className="text-xs bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl overflow-x-auto text-[#1e293b] font-mono leading-relaxed">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}

              {/* Old Values */}
              {selectedLog.old_values && (
                <div>
                  <h4 className="text-xs font-bold text-[#d97706] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d97706]" />
                    {isRtl ? "القيم السابقة (Old Values):" : "Previous Values:"}
                  </h4>
                  <pre className="text-xs bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl overflow-x-auto text-[#1e293b] font-mono leading-relaxed">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-3 border-t border-[#f1f5f9] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-[#243b53] text-white rounded-xl text-xs font-semibold hover:bg-[#1a2d3f] transition cursor-pointer"
                >
                  {isRtl ? "إغلاق" : "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivityLog;