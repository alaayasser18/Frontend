import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  AlertTriangle,
  Loader2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// =====================================================
// API LAYER
// =====================================================

const API_BASE = "https://hr-system.iptvdemo.serv5group.com/api";

// لو عندك توكن (Sanctum / JWT) ضيفه في localStorage باسم token
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include", // مهم لو Sanctum cookies
    headers: { ...getAuthHeaders(), ...(options.headers || {}) },
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(
      data?.message || data?.error || `Request failed (${res.status})`
    );
    err.status = res.status;
    throw err;
  }

  return data;
}

// ⚠️ عدّل المسارات دي بس لو الـ routes عندك مختلفة
const holidaysApi = {
  list: () => apiRequest("/holidays"),
  create: (payload) =>
    apiRequest("/holidays", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  remove: (id) => apiRequest(`/holidays/${id}`, { method: "DELETE" }),
};

// =====================================================
// HELPERS
// =====================================================

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateRange(start, end) {
  if (!start && !end) return null;
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  return formatDate(start || end);
}

function computeDays(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const diff = Math.round((e.getTime() - s.getTime()) / DAY_MS) + 1;
  return diff > 0 ? diff : null;
}

// توحيد شكل البيانات القادمة من الـ API
function normalizeHoliday(raw, index = 0) {
  const start = raw.start_date ?? raw.startDate ?? null;
  const end = raw.end_date ?? raw.endDate ?? null;

  return {
    id: raw.id ?? `row-${index}`,
    isStatic: false,
    name: raw.name ?? raw.title ?? raw.holiday_name ?? null,
    nameKey: null,
    dateRange: formatDateRange(start, end),
    totalDays: raw.total_days ?? raw.totalDays ?? computeDays(start, end),
    totalDaysKey: null,
    status: raw.status ?? null,
  };
}

// بيانات ثابتة تظهر لو الـ API فشل (من غير أي إشعار للمستخدم)
const fallbackHolidays = [
  {
    id: "eid-al-fitr",
    isStatic: true,
    name: null,
    nameKey: "eidAlFitr",
    dateRange: "Apr 10 – Apr 12, 2026",
    totalDays: null,
    totalDaysKey: "threeDays",
    status: null,
  },
  {
    id: "revolution-day",
    isStatic: true,
    name: null,
    nameKey: "revolutionDay",
    dateRange: "Jul 23, 2026",
    totalDays: null,
    totalDaysKey: "oneDay",
    status: null,
  },
  {
    id: "new-years-day",
    isStatic: true,
    name: null,
    nameKey: "newYearsDay",
    dateRange: "Jan 01, 2027",
    totalDays: null,
    totalDaysKey: "oneDay",
    status: null,
  },
];

// =====================================================
// MOTION
// =====================================================

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.18 } },
};

// =====================================================
// TOAST
// =====================================================

function Toast({ toast, onClose }) {
  const isSuccess = toast?.type === "success";

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="
            fixed bottom-5 end-5 z-[60]
            flex items-center gap-3
            rounded-xl border px-4 py-3 shadow-lg
            bg-white
          "
        >
          {isSuccess ? (
            <CheckCircle2 className="h-4 w-4 text-[#047857]" />
          ) : (
            <AlertCircle className="h-4 w-4 text-[#dc2626]" />
          )}

          <p
            className={`
              text-xs font-semibold
              ${isSuccess ? "text-[#047857]" : "text-[#dc2626]"}
            `}
          >
            {toast.message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#94a3b8] transition hover:bg-[#f8fafc]"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =====================================================
// SCHEDULE HOLIDAY MODAL
// =====================================================

function ScheduleHolidayModal({ onClose, onSave }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    total_days: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // حساب عدد الأيام تلقائيًا من التاريخين
  useEffect(() => {
    const days = computeDays(form.start_date, form.end_date);
    setForm((f) =>
      days && String(days) !== f.total_days
        ? { ...f, total_days: String(days) }
        : f
    );
  }, [form.start_date, form.end_date]);

  const updateField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setFormError(t("holidays.errors.nameRequired"));
      return;
    }
    if (!form.start_date || !form.end_date) {
      setFormError(t("holidays.errors.datesRequired"));
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      // الـ parent بيقفل المودال لو الحفظ نجح
      await onSave({
        name: form.name.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
        total_days: form.total_days ? Number(form.total_days) : null,
        status: "active",
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-[#0f172a]/40 p-4 backdrop-blur-[2px]
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="
          w-full max-w-xl overflow-hidden rounded-2xl
          border border-[#e2e8f0]/80 bg-white shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}

        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[#1e293b]">
              {t("holidays.modal.title")}
            </h2>
            <p className="mt-1 text-xs text-[#64748b]">
              {t("holidays.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#94a3b8] transition hover:bg-[#f8fafc] hover:text-[#475569]"
            aria-label={t("holidays.modal.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM */}

        <div className="space-y-5 p-5">
          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#dc2626]" />
              <p className="text-xs font-semibold text-[#dc2626]">
                {formError}
              </p>
            </div>
          )}

          {/* HOLIDAY NAME */}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              {t("holidays.modal.holidayName")}
            </label>

            <input
              type="text"
              value={form.name}
              onChange={updateField("name")}
              placeholder={t("holidays.modal.holidayNamePlaceholder")}
              className="mt-1.5 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9]"
            />
          </div>

          {/* START / END DATE */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {t("holidays.modal.startDate")}
              </label>

              <input
                type="date"
                value={form.start_date}
                onChange={updateField("start_date")}
                className="mt-1.5 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#1e293b] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {t("holidays.modal.endDate")}
              </label>

              <input
                type="date"
                value={form.end_date}
                onChange={updateField("end_date")}
                className="mt-1.5 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#1e293b] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9]"
              />
            </div>
          </div>

          {/* TOTAL DAYS (auto-calculated) */}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              {t("holidays.modal.totalDays")}
            </label>

            <input
              type="number"
              min="1"
              value={form.total_days}
              onChange={updateField("total_days")}
              placeholder={t("holidays.modal.totalDaysPlaceholder")}
              className="mt-1.5 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-xs text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#94a3b8] focus:ring-2 focus:ring-[#f1f5f9] sm:w-1/2"
            />
          </div>

          {/* MODAL ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#475569] transition hover:bg-[#f8fafc] disabled:opacity-50"
            >
              {t("holidays.modal.cancel")}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1c2f42] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>
                {submitting
                  ? t("holidays.modal.saving")
                  : t("holidays.modal.save")}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =====================================================
// HOLIDAYS & SEASONS PAGE
// =====================================================

export default function HolidaysSeasons() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // إخفاء الـ toast تلقائيًا
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // =====================================================
  // LOAD HOLIDAYS FROM API
  // =====================================================

  const loadHolidays = useCallback(async () => {
    setLoading(true);

    try {
      const res = await holidaysApi.list();

      // بيدعم: مصفوفة مباشرة أو { data: [...] } (Laravel pagination)
      const list = Array.isArray(res) ? res : res?.data ?? res?.holidays ?? [];

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response shape from API");
      }

      setHolidays(list.map(normalizeHoliday));
    } catch (err) {
      // الخطأ يظهر في الـ console بس — والصفحة تعرض البيانات الثابتة عادي
      console.error("[Holidays] Failed to load:", err.message);
      setHolidays(fallbackHolidays);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

  // =====================================================
  // SAVE NEW HOLIDAY (POST → DATABASE)
  // =====================================================

  const handleSaveHoliday = async (payload) => {
    const res = await holidaysApi.create(payload);

    const created = res?.data ?? res?.holiday ?? res;

    if (created?.id || created?.name) {
      // استخدم السجل الراجع من الداتابيز (بالـ id الحقيقي)
      setHolidays((prev) => [
        ...prev,
        normalizeHoliday(created, prev.length),
      ]);
    } else {
      // الـ API م رجعش السجل → اعمل refetch
      await loadHolidays();
    }

    setIsModalOpen(false);
    setToast({ type: "success", message: t("holidays.toast.saved") });
  };

  // =====================================================
  // DELETE HOLIDAY
  // =====================================================

  const handleDelete = async (holiday) => {
    if (!window.confirm(t("holidays.deleteConfirm"))) return;

    setDeletingId(holiday.id);

    try {
      await holidaysApi.remove(holiday.id);
      setHolidays((prev) => prev.filter((h) => h.id !== holiday.id));
      setToast({ type: "success", message: t("holidays.toast.deleted") });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <motion.div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* HEADER */}

        <motion.header
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
              HR / HOLIDAYS & SEASONS
            </p>

            <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
              {t("holidays.title")}
            </h1>

            <p className="mt-1 text-sm font-normal text-[#64748b]">
              {t("holidays.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2f42]"
          >
            <Plus className="h-4 w-4" />
            <span>{t("holidays.scheduleHoliday")}</span>
          </button>
        </motion.header>

        {/* PEAK ALERT BANNER */}

        <motion.div
          variants={itemVariants}
          className="flex items-start gap-3 rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#f97316]">
            <AlertTriangle className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-[#1e293b]">
              {t("holidays.peakAlert.title")}
            </p>
            <p className="mt-1 text-xs font-normal leading-5 text-[#64748b] sm:text-sm">
              {t("holidays.peakAlert.description")}
            </p>
          </div>
        </motion.div>

        {/* HOLIDAYS TABLE */}

        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-2xl border border-[#e2e8f0]/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          {/* TABLE HEADER */}

          <div className="border-b border-[#f1f5f9] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  HR CALENDAR
                </p>
                <h2 className="mt-1 text-base font-bold text-[#1e293b]">
                  {t("holidays.calendarTitle")}
                </h2>
              </div>

              <button
                type="button"
                onClick={loadHolidays}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#3b82f6] transition hover:bg-[#dbeafe] disabled:opacity-60"
                aria-label={t("holidays.refresh")}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* TABLE */}

          <div>
            <table className="w-full table-fixed text-start">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="w-[28%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.holidayName")}
                  </th>

                  <th className="w-[24%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.dateRange")}
                  </th>

                  <th className="w-[14%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.totalDays")}
                  </th>

                  <th className="w-[20%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.status")}
                  </th>

                  <th className="w-[14%] px-5 py-3 text-end text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.actions")}
                  </th>
                </tr>
              </thead>

              {/* LOADING SKELETON */}

              {loading ? (
                <tbody>
                  {[0, 1, 2].map((row) => (
                    <tr key={row} className="border-b border-[#f1f5f9] last:border-b-0">
                      {["w-28", "w-24", "w-14", "w-20", "w-8"].map((w, cell) => (
                        <td key={cell} className="px-5 py-4 sm:px-6">
                          <div
                            className={`h-4 ${w} animate-pulse rounded bg-[#f1f5f9] ${
                              cell === 4 ? "ms-auto" : ""
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ) : holidays.length === 0 ? (
                /* EMPTY STATE */

                <tbody>
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-[#94a3b8] sm:px-6"
                    >
                      {t("holidays.empty")}
                    </td>
                  </tr>
                </tbody>
              ) : (
                /* DATA ROWS */

                <tbody>
                  {holidays.map((holiday, index) => (
                    <motion.tr
                      key={holiday.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-[#f1f5f9] transition last:border-b-0 hover:bg-[#f8fafc]"
                    >
                      {/* HOLIDAY NAME */}

                      <td className="px-5 py-4 text-start text-sm font-bold text-[#1e293b] sm:px-6">
                        {holiday.name ??
                          (holiday.nameKey &&
                            t(`holidays.items.${holiday.nameKey}.name`))}
                      </td>

                      {/* DATE RANGE */}

                      <td className="px-5 py-4 text-start text-sm font-normal text-[#64748b] sm:px-6">
                        <span dir="auto" className="inline-block">
                          {holiday.dateRange ?? "—"}
                        </span>
                      </td>

                      {/* TOTAL DAYS */}

                      <td className="px-5 py-4 text-start text-sm font-normal text-[#64748b] sm:px-6">
                        {holiday.totalDays ??
                          (holiday.totalDaysKey &&
                            t(`holidays.${holiday.totalDaysKey}`)) ??
                          "—"}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4 text-start sm:px-6">
                        <span className="inline-block rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-3 py-1 text-[11px] font-bold text-[#047857]">
                          {holiday.status
                            ? t(`holidays.status.${holiday.status}`, {
                                defaultValue: holiday.status,
                              })
                            : t("holidays.status.activeOfficialLeave")}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4 text-end sm:px-6">
                        {!holiday.isStatic && (
                          <button
                            type="button"
                            onClick={() => handleDelete(holiday)}
                            disabled={deletingId === holiday.id}
                            className="rounded-lg p-2 text-[#94a3b8] transition hover:bg-[#fef2f2] hover:text-[#dc2626] disabled:opacity-50"
                            aria-label={t("holidays.delete")}
                          >
                            {deletingId === holiday.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* MODAL + TOAST */}

      <AnimatePresence>
        {isModalOpen && (
          <ScheduleHolidayModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveHoliday}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}