import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiLogIn,
  FiLogOut,
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { checkIn, checkOut, getTodayAttendance } from "../features/employee/api/attendanceApi";
import { useTodayAttendance } from "../features/employee/hooks/useTodayAttendance";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getCurrentLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Geolocation not supported — proceed without coords
      resolve({ latitude: null, longitude: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      // On denial/error — proceed without coords (API may still allow it)
      () => resolve({ latitude: null, longitude: null }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });

const parseWorkedTime = (timeString) => {
  if (!timeString) return 0;
  const parts = timeString.split(":").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
  const [h, m, s] = parts;
  return h * 3600 + m * 60 + s;
};

const formatTime = (totalSeconds) => {
  const s = Math.max(0, Number(totalSeconds) || 0);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

// ─────────────────────────────────────────────
// CheckInOutWidget
// ─────────────────────────────────────────────

/**
 * Reusable Check-in / Check-out widget.
 * Works for Employee, HR, and Manager roles.
 * Uses the shared /attendance/check-in and /attendance/check-out endpoints.
 *
 * Props:
 *  - compact: boolean — if true, renders a smaller inline version (for dashboards)
 *  - className: extra wrapper classNames
 */
export default function CheckInOutWidget({ compact = false, className = "" }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: attendanceResponse,
    isLoading: attendanceLoading,
    refetch: refetchAttendance,
  } = useTodayAttendance();

  const attendance = attendanceResponse?.data;
  const canCheckIn = attendance?.can_check_in === true;
  const canCheckOut = attendance?.can_check_out === true;
  const isCheckedIn = attendance?.can_check_out === true;

  // Live timer
  const [secondsWorked, setSecondsWorked] = useState(0);

  useEffect(() => {
    setSecondsWorked(parseWorkedTime(attendance?.worked_time));
  }, [attendance?.worked_time, attendance?.check_in_time, attendance?.check_out_time]);

  useEffect(() => {
    if (!isCheckedIn) return;
    const timer = setInterval(() => setSecondsWorked((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  // ── Check-in mutation ──────────────────────
  const { mutate: doCheckIn, isPending: checkInLoading } = useMutation({
    mutationFn: async () => {
      const location = await getCurrentLocation();
      return checkIn(location);
    },
    onSuccess: () => {
      toast.success(t("attendance.checkedInSuccess", "Checked in successfully!"));
      refetchAttendance();
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("attendance.checkInError", "Unable to check in."),
      );
    },
  });

  // ── Check-out mutation ─────────────────────
  const { mutate: doCheckOut, isPending: checkOutLoading } = useMutation({
    mutationFn: checkOut,
    onSuccess: () => {
      toast.success(t("attendance.checkedOutSuccess", "Checked out successfully!"));
      refetchAttendance();
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("attendance.checkOutError", "Unable to check out."),
      );
    },
  });

  const isLoading = checkInLoading || checkOutLoading || attendanceLoading;
  const isDisabled = isLoading || (!canCheckIn && !canCheckOut);
  const isCheckOutMode = canCheckOut || (Boolean(attendance?.check_in_time) && !canCheckIn);

  const handleAction = () => {
    if (canCheckIn) {
      doCheckIn();
    } else if (canCheckOut) {
      doCheckOut();
    }
  };

  // ── COMPACT MODE (for dashboards) ──────────
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleAction}
          disabled={isDisabled}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
            isDisabled
              ? "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : canCheckOut
                ? "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          }`}
        >
          {isLoading ? (
            <FiLoader className="h-3.5 w-3.5 animate-spin" />
          ) : isCheckOutMode ? (
            <FiLogOut className="h-3.5 w-3.5" />
          ) : (
            <FiLogIn className="h-3.5 w-3.5" />
          )}
          {isLoading
            ? t("attendance.loading", "Please wait...")
            : isCheckOutMode
              ? t("attendance.checkOut", "Check Out")
              : t("attendance.checkIn", "Check In")}
        </button>

        {isCheckedIn && (
          <span className="font-mono text-[11px] text-slate-500">
            {formatTime(secondsWorked)}
          </span>
        )}
      </div>
    );
  }

  // ── FULL MODE (for dedicated pages) ────────
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1c364f]">
              {t("attendance.todayStatus", "Today's Attendance")}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Live badge */}
          {isCheckedIn && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {attendanceLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FiLoader className="h-4 w-4 animate-spin" />
            Loading attendance status...
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Check-in
                </p>
                <p className="mt-1 text-sm font-bold text-[#1c364f]">
                  {attendance?.check_in_time || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Check-out
                </p>
                <p className="mt-1 text-sm font-bold text-[#1c364f]">
                  {attendance?.check_out_time || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Worked
                </p>
                <p className="mt-1 font-mono text-sm font-bold text-[#1c364f]">
                  {isCheckedIn ? formatTime(secondsWorked) : (attendance?.worked_time || "—")}
                </p>
              </div>
            </div>

            {/* Location */}
            {attendance?.distance_meters !== undefined && attendance?.distance_meters !== null && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium ${
                  attendance?.is_inside_radius
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <FiMapPin className="h-3.5 w-3.5 shrink-0" />
                {attendance?.is_inside_radius
                  ? `Inside workplace radius · ${Number(attendance.distance_meters).toFixed(0)}m from office`
                  : `Outside workplace radius · ${Number(attendance.distance_meters).toFixed(0)}m from office`}
              </div>
            )}

            {/* Action button */}
            <motion.button
              type="button"
              onClick={handleAction}
              disabled={isDisabled}
              whileTap={!isDisabled ? { scale: 0.98 } : undefined}
              className={`w-full rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition ${
                isDisabled
                  ? "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : canCheckOut
                    ? "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : isCheckOutMode ? (
                  <FiLogOut className="h-4 w-4" />
                ) : (
                  <FiLogIn className="h-4 w-4" />
                )}
                {isLoading
                  ? t("attendance.loading", "Please wait...")
                  : isCheckOutMode
                    ? t("attendance.checkOut", "Check Out")
                    : t("attendance.checkIn", "Check In")}
              </span>
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
