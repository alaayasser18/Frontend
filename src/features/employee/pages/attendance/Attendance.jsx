import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiRefreshCw,
} from "react-icons/fi";

import { useTodayAttendance } from "../../hooks/useTodayAttendance";
import { useAttendanceHistory } from "../../hooks/useAttendanceHistory";
import {
  checkIn,
  checkOut,
} from "../../api/attendanceApi";

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Geolocation is not supported by this browser.",
        ),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
};

export default function Attendance() {
  const { t } = useTranslation();

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const todayQuery = useTodayAttendance();

  const {
    data: attendanceResponse,
    isLoading: todayLoading,
    isError: todayError,
    error: todayErrorObject,
    refetch: refetchToday,
  } = todayQuery;

  const attendance = attendanceResponse?.data;

  const now = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    now.getMonth() + 1,
  );

  const [selectedYear, setSelectedYear] = useState(
    now.getFullYear(),
  );

  const {
    data: historyResponse,
    isLoading: historyLoading,
    isError: historyError,
    error: historyErrorObject,
    refetch: refetchHistory,
  } = useAttendanceHistory({
    month: selectedMonth,
    year: selectedYear,
    perPage: 15,
  });

  const history =
    historyResponse?.data?.history || [];

  const historyMeta =
    historyResponse?.data?.meta;

  /*
   * ============================
   * Loading
   * ============================
   */

  if (todayLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e2e8f0] border-t-[#1c364f]" />

          <p className="text-sm font-semibold text-[#64748b]">
            {t(
              "employee.attendancePage.loading",
              "Loading attendance...",
            )}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================
   * Today API Error
   * ============================
   */

  if (todayError) {
    return (
      <div className="w-full rounded-2xl border border-red-100 bg-red-50 p-6">
        <h3 className="text-base font-bold text-red-700">
          {t(
            "employee.attendancePage.errorTitle",
            "Unable to load attendance",
          )}
        </h3>

        <p className="mt-2 text-sm text-red-600">
          {todayErrorObject?.response?.data?.message ||
            todayErrorObject?.message ||
            t(
              "employee.attendancePage.errorMessage",
              "Something went wrong while loading your attendance.",
            )}
        </p>

        <button
          type="button"
          onClick={() => refetchToday()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1c364f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#24425f]"
        >
          <FiRefreshCw className="h-3.5 w-3.5" />

          {t("common.retry", "Retry")}
        </button>
      </div>
    );
  }

  /*
   * ============================
   * Date
   * ============================
   */

  const todayDate = new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date());

  /*
   * ============================
   * Status
   * ============================
   */

  const statusText =
    attendance?.status ||
    t(
      "employee.attendancePage.noStatus",
      "No attendance status",
    );

  const isInsideRadius =
    attendance?.is_inside_radius === true;

  const canCheckIn =
    attendance?.can_check_in === true;

  const canCheckOut =
    attendance?.can_check_out === true;

  const isOnShift =
    canCheckOut ||
    statusText.toLowerCase() === "on shift";

  const locationStatus = isInsideRadius
    ? t(
        "employee.attendancePage.insideRadius",
        "Inside workplace radius",
      )
    : t(
        "employee.attendancePage.outsideRadius",
        "Outside workplace radius",
      );

  const distance =
    attendance?.distance_meters != null
      ? `${attendance.distance_meters}m from office`
      : "—";

  /*
   * ============================
   * Check In
   * ============================
   */

  const handleCheckIn = async () => {
    if (actionLoading) return;

    setActionLoading(true);
    setActionError("");

    try {
      const location = await getCurrentLocation();

      await checkIn({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      await refetchToday();
      await refetchHistory();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        t(
          "employee.attendancePage.checkInError",
          "Unable to check in.",
        );

      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ============================
   * Check Out
   * ============================
   */

  const handleCheckOut = async () => {
    if (actionLoading) return;

    setActionLoading(true);
    setActionError("");

    try {
      await checkOut();

      await refetchToday();
      await refetchHistory();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        t(
          "employee.attendancePage.checkOutError",
          "Unable to check out.",
        );

      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ============================
   * Refresh
   * ============================
   */

  const handleRefresh = async () => {
    setActionError("");

    await Promise.all([
      refetchToday(),
      refetchHistory(),
    ]);
  };

  /*
   * ============================
   * Render
   * ============================
   */

  return (
    <div className="w-full space-y-6">
      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
            {t(
              "employee.attendancePage.label",
              "Attendance",
            )}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#1c364f]">
            {t(
              "employee.attendancePage.title",
              "Attendance & Time",
            )}
          </h1>

          <p className="mt-1 text-sm text-[#64748b]">
            {t(
              "employee.attendancePage.subtitle",
              "Track your attendance, working hours and workplace location.",
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={actionLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-semibold text-[#1c364f] shadow-sm transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiRefreshCw
            className={`h-3.5 w-3.5 ${
              actionLoading ? "animate-spin" : ""
            }`}
          />

          {t("common.refresh", "Refresh")}
        </button>
      </div>

      {/* =========================================
          ACTION ERROR
      ========================================== */}

      {actionError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold text-red-700">
            {actionError}
          </p>
        </div>
      )}

      {/* =========================================
          MAIN ATTENDANCE CARD
      ========================================== */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-[#e8edf2] bg-white shadow-sm"
      >
        {/* Top */}

        <div className="relative overflow-hidden bg-[#f8fafc] px-6 py-7 sm:px-8">
          {/* Radar */}

          <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-56 w-56">
            <div className="absolute inset-0 rounded-full border border-[#1c364f]/10" />
            <div className="absolute inset-7 rounded-full border border-[#1c364f]/10" />
            <div className="absolute inset-14 rounded-full border border-[#1c364f]/10" />
            <div className="absolute inset-[82px] rounded-full bg-[#1c364f]/5" />
          </div>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Status */}

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <FiClock className="h-5 w-5 text-[#1c364f]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[#1c364f]">
                    {statusText}
                  </h2>

                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      isOnShift
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        isOnShift
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    {isOnShift
                      ? t(
                          "employee.attendancePage.active",
                          "Active",
                        )
                      : t(
                          "employee.attendancePage.inactive",
                          "Inactive",
                        )}
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#64748b]">
                  {t(
                    "employee.attendancePage.workplace",
                    "Workplace attendance",
                  )}
                </p>
              </div>
            </div>

            {/* Location */}

            <div className="flex items-center gap-3 rounded-2xl border border-[#e8edf2] bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff7e0]">
                <FiMapPin className="h-4 w-4 text-[#f59e0b]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  {t(
                    "employee.attendancePage.location",
                    "Location",
                  )}
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#1c364f]">
                  {locationStatus}
                </p>

                <p className="mt-0.5 text-[11px] text-[#64748b]">
                  {distance}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            CHECK SECTION
        ========================================== */}

        <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
              {t(
                "employee.attendancePage.today",
                "Today",
              )}
            </p>

            <h3 className="mt-2 text-xl font-bold text-[#1c364f]">
              {canCheckOut
                ? t(
                    "employee.attendancePage.checkedInTitle",
                    "You're checked in",
                  )
                : canCheckIn
                  ? t(
                      "employee.attendancePage.notCheckedInTitle",
                      "You're not checked in",
                    )
                  : t(
                      "employee.attendancePage.attendanceStatus",
                      "Attendance status",
                    )}
            </h3>

            <p className="mt-1 text-sm text-[#64748b]">
              {attendance?.check_in_time
                ? `${t(
                    "employee.attendancePage.checkedInAt",
                    "Checked in at",
                  )} ${attendance.check_in_time}`
                : t(
                    "employee.attendancePage.noCheckIn",
                    "No check-in recorded yet.",
                  )}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-[#f8fafc] px-3 py-2">
                <FiNavigation className="h-3.5 w-3.5 text-[#1c364f]" />

                <span className="text-xs font-semibold text-[#475569]">
                  {locationStatus}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-[#f8fafc] px-3 py-2">
                <FiMapPin className="h-3.5 w-3.5 text-[#1c364f]" />

                <span className="text-xs font-semibold text-[#475569]">
                  {distance}
                </span>
              </div>
            </div>
          </div>

          {/* Action */}

          <div className="flex flex-col justify-between rounded-2xl border border-[#edf1f5] bg-[#fafbfc] p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                {t(
                  "employee.attendancePage.workedToday",
                  "Worked today",
                )}
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-[#1c364f]">
                {attendance?.worked_time ||
                  "00:00:00"}
              </p>
            </div>

            {canCheckIn && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c364f] px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#24425f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    {t(
                      "common.loading",
                      "Loading...",
                    )}
                  </>
                ) : (
                  <>
                    {t(
                      "employee.attendancePage.checkIn",
                      "Check in",
                    )}

                    <FiArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}

           <button
  type="button"
  onClick={canCheckOut ? handleCheckOut : handleCheckIn}
  disabled={
    todayLoading ||
    actionLoading ||
    (!canCheckIn && !canCheckOut)
  }
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c364f] px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#24425f] disabled:cursor-not-allowed disabled:opacity-50"
>
  {actionLoading ? (
    <>
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

      {t("common.loading", "Loading...")}
    </>
  ) : canCheckOut ? (
    <>
      {t(
        "employee.attendancePage.checkOut",
        "Check out",
      )}

      <FiArrowRight className="h-3.5 w-3.5" />
    </>
  ) : (
    <>
      {t(
        "employee.attendancePage.checkIn",
        "Check in",
      )}

      <FiArrowRight className="h-3.5 w-3.5" />
    </>
  )}
</button>
          </div>
        </div>
      </motion.div>

      {/* =========================================
          TODAY DETAILS
      ========================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Date */}

        <motion.div className="rounded-2xl border border-[#e8edf2] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8fafc]">
              <FiCalendar className="h-4 w-4 text-[#1c364f]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t(
                "employee.attendancePage.date",
                "Date",
              )}
            </span>
          </div>

          <p className="mt-4 text-sm font-bold text-[#1c364f]">
            {todayDate}
          </p>
        </motion.div>

        {/* Check In */}

        <motion.div className="rounded-2xl border border-[#e8edf2] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8fafc]">
              <FiClock className="h-4 w-4 text-[#1c364f]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t(
                "employee.attendancePage.checkIn",
                "Check in",
              )}
            </span>
          </div>

          <p className="mt-4 text-lg font-bold text-[#1c364f]">
            {attendance?.check_in_time || "—"}
          </p>
        </motion.div>

        {/* Check Out */}

        <motion.div className="rounded-2xl border border-[#e8edf2] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8fafc]">
              <FiClock className="h-4 w-4 text-[#1c364f]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t(
                "employee.attendancePage.checkOut",
                "Check out",
              )}
            </span>
          </div>

          <p className="mt-4 text-lg font-bold text-[#1c364f]">
            {attendance?.check_out_time || "—"}
          </p>
        </motion.div>

        {/* Worked */}

        <motion.div className="rounded-2xl border border-[#e8edf2] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8fafc]">
              <FiClock className="h-4 w-4 text-[#1c364f]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
              {t(
                "employee.attendancePage.worked",
                "Worked",
              )}
            </span>
          </div>

          <p className="mt-4 text-lg font-bold text-[#1c364f]">
            {attendance?.worked_time ||
              "00:00:00"}
          </p>
        </motion.div>
      </div>

      {/* =========================================
          LOCATION DETAILS
      ========================================== */}

      <div className="rounded-2xl border border-[#e8edf2] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isInsideRadius
                  ? "bg-emerald-50"
                  : "bg-red-50"
              }`}
            >
              <FiMapPin
                className={`h-5 w-5 ${
                  isInsideRadius
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#1c364f]">
                {t(
                  "employee.attendancePage.locationCheck",
                  "Workplace location check",
                )}
              </h3>

              <p className="mt-1 text-xs text-[#64748b]">
                {locationStatus}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl bg-[#f8fafc] px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                {t(
                  "employee.attendancePage.distance",
                  "Distance",
                )}
              </p>

              <p className="mt-1 text-xs font-bold text-[#1c364f]">
                {distance}
              </p>
            </div>

            <div className="rounded-xl bg-[#f8fafc] px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                {t(
                  "employee.attendancePage.inside",
                  "Inside radius",
                )}
              </p>

              <p
                className={`mt-1 text-xs font-bold ${
                  isInsideRadius
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {isInsideRadius
                  ? t("common.yes", "Yes")
                  : t("common.no", "No")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ATTENDANCE HISTORY
      ========================================== */}

      <div className="rounded-2xl border border-[#e8edf2] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1c364f]">
              {t(
                "employee.attendancePage.historyTitle",
                "Attendance history",
              )}
            </h3>

            <p className="mt-1 text-xs text-[#64748b]">
              {t(
                "employee.attendancePage.historyDescription",
                "View your previous attendance records.",
              )}
            </p>
          </div>

          {/* Filters */}

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(
                  Number(event.target.value),
                )
              }
              className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#475569] outline-none focus:border-[#1c364f]"
            >
              {Array.from(
                { length: 12 },
                (_, index) => {
                  const month = index + 1;

                  return (
                    <option
                      key={month}
                      value={month}
                    >
                      {new Intl.DateTimeFormat(
                        "en-US",
                        {
                          month: "long",
                        },
                      ).format(
                        new Date(
                          2026,
                          index,
                          1,
                        ),
                      )}
                    </option>
                  );
                },
              )}
            </select>

            <select
              value={selectedYear}
              onChange={(event) =>
                setSelectedYear(
                  Number(event.target.value),
                )
              }
              className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#475569] outline-none focus:border-[#1c364f]"
            >
              {[
                now.getFullYear() - 1,
                now.getFullYear(),
                now.getFullYear() + 1,
              ].map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => refetchHistory()}
              disabled={historyLoading}
              className="inline-flex items-center justify-center rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-[#1c364f] transition hover:bg-[#f8fafc] disabled:opacity-50"
            >
              <FiRefreshCw
                className={`h-3.5 w-3.5 ${
                  historyLoading
                    ? "animate-spin"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* History Error */}

        {historyError && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold text-red-700">
              {historyErrorObject?.response?.data
                ?.message ||
                historyErrorObject?.message ||
                t(
                  "employee.attendancePage.historyError",
                  "Unable to load attendance history.",
                )}
            </p>
          </div>
        )}

        {/* Loading */}

        {historyLoading && (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#e2e8f0] border-t-[#1c364f]" />

              <p className="text-xs font-semibold text-[#64748b]">
                {t(
                  "employee.attendancePage.loadingHistory",
                  "Loading history...",
                )}
              </p>
            </div>
          </div>
        )}

        {/* Table */}

        {!historyLoading &&
          !historyError && (
            <>
              {history.length > 0 ? (
                <div className="mt-5 overflow-x-auto rounded-2xl border border-[#edf1f5]">
                  <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#edf1f5] bg-[#fafbfc]">
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                          {t(
                            "employee.attendancePage.day",
                            "Day",
                          )}
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                          {t(
                            "employee.attendancePage.date",
                            "Date",
                          )}
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                          {t(
                            "employee.attendancePage.checkIn",
                            "Check in",
                          )}
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                          {t(
                            "employee.attendancePage.checkOut",
                            "Check out",
                          )}
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                          {t(
                            "employee.attendancePage.worked",
                            "Worked",
                          )}
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                          {t(
                            "employee.attendancePage.status",
                            "Status",
                          )}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {history.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#f1f5f9] last:border-b-0"
                        >
                          <td className="px-4 py-4 text-xs font-semibold text-[#1c364f]">
                            {item.day_name || "—"}
                          </td>

                          <td className="px-4 py-4 text-xs text-[#64748b]">
                            {item.date || "—"}
                          </td>

                          <td className="px-4 py-4 text-xs font-semibold text-[#475569]">
                            {item.check_in || "—"}
                          </td>

                          <td className="px-4 py-4 text-xs font-semibold text-[#475569]">
                            {item.check_out || "—"}
                          </td>

                          <td className="px-4 py-4 text-xs font-semibold text-[#475569]">
                            {item.worked_time || "—"}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                item.status
                                  ?.toLowerCase()
                                  .includes("late")
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {item.status || "—"}
                            </span>

                            {item.is_exception && (
                              <span className="ml-2 inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
                                {t(
                                  "employee.attendancePage.exception",
                                  "Exception",
                                )}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#e2e8f0] bg-[#fafbfc]">
                  <div className="text-center">
                    <FiCalendar className="mx-auto h-7 w-7 text-[#cbd5e1]" />

                    <p className="mt-3 text-sm font-semibold text-[#64748b]">
                      {t(
                        "employee.attendancePage.noHistory",
                        "No attendance records found.",
                      )}
                    </p>

                    <p className="mt-1 text-xs text-[#94a3b8]">
                      {t(
                        "employee.attendancePage.tryAnotherMonth",
                        "Try another month or year.",
                      )}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

        {/* Pagination info */}

        {!historyLoading &&
          !historyError &&
          historyMeta && (
            <div className="mt-4 flex items-center justify-between text-xs text-[#94a3b8]">
              <span>
                {t(
                  "employee.attendancePage.total",
                  "Total",
                )}{" "}
                {historyMeta.total ?? 0}
              </span>

              <span>
                {t(
                  "employee.attendancePage.page",
                  "Page",
                )}{" "}
                {historyMeta.current_page ?? 1}{" "}
                {t(
                  "employee.attendancePage.of",
                  "of",
                )}{" "}
                {historyMeta.last_page ?? 1}
              </span>
            </div>
          )}
      </div>
    </div>
  );
}