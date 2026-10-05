import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiLogIn,
  FiLogOut,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { checkIn, checkOut } from "../features/employee/api/attendanceApi";
import {
  useTodayAttendance,
  getCurrentLocation,
} from "../features/employee/hooks/useTodayAttendance";

const parseWorkedTime = (timeString) => {
  if (!timeString) return 0;
  const parts = String(timeString).split(":").map(Number);
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

/**
 * Reusable Check-in / Check-out widget.
 * Works for Employee, HR, and Manager roles.
 * Uses the shared /api/attendance/check-in and /api/attendance/check-out endpoints.
 */
export default function CheckInOutWidget({ compact = false, className = "" }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: attendanceResponse,
    isLoading: attendanceLoading,
    refetch: refetchAttendance,
  } = useTodayAttendance();

  const attendance = attendanceResponse?.data || attendanceResponse;

  // Determine state reliably
  const hasCheckedIn = Boolean(attendance?.check_in_time);
  const hasCheckedOut = Boolean(attendance?.check_out_time);

  const canCheckOut =
    attendance?.can_check_out === true ||
    (hasCheckedIn && !hasCheckedOut);

  const isCheckedIn = canCheckOut;

  const canCheckIn =
    attendance?.can_check_in === true ||
    (!hasCheckedIn && !canCheckOut);

  const isShiftFinished =
    hasCheckedIn && hasCheckedOut && attendance?.can_check_in === false;

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

  // Check-in mutation
  const { mutate: doCheckIn, isPending: checkInLoading } = useMutation({
    mutationFn: async () => {
      const location = await getCurrentLocation();
      return checkIn({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    },
    onSuccess: (res) => {
      toast.success(
        res?.message ||
          t("attendance.checkedInSuccess", "Checked in successfully!")
      );
      refetchAttendance();
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("attendance.checkInError", "Unable to check in.")
      );
    },
  });

  // Check-out mutation
  const { mutate: doCheckOut, isPending: checkOutLoading } = useMutation({
    mutationFn: checkOut,
    onSuccess: (res) => {
      toast.success(
        res?.message ||
          t("attendance.checkedOutSuccess", "Checked out successfully!")
      );
      refetchAttendance();
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("attendance.checkOutError", "Unable to check out.")
      );
    },
  });

  const isActionPending = checkInLoading || checkOutLoading;
  const isCheckOutMode = canCheckOut;

  const handleAction = () => {
    if (isActionPending) return;
    if (isCheckOutMode) {
      doCheckOut();
    } else {
      doCheckIn();
    }
  };

  // ── COMPACT MODE (for dashboards & headers) ──────────
  if (compact) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {isShiftFinished ? (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700">
            <FiCheckCircle className="h-3.5 w-3.5" />
            <span>{t("attendance.shiftFinished", "Shift Completed")}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAction}
            disabled={isActionPending}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60 ${
              isCheckOutMode
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {isActionPending ? (
              <FiLoader className="h-3.5 w-3.5 animate-spin" />
            ) : isCheckOutMode ? (
              <FiLogOut className="h-3.5 w-3.5" />
            ) : (
              <FiLogIn className="h-3.5 w-3.5" />
            )}
            {isActionPending
              ? t("attendance.loading", "Please wait...")
              : isCheckOutMode
              ? t("attendance.checkOut", "Check Out")
              : t("attendance.checkIn", "Check In")}
          </button>
        )}

        {isCheckedIn && (
          <span className="font-mono text-[11px] font-bold text-[#102a43] bg-slate-100 px-2 py-1 rounded-lg">
            {formatTime(secondsWorked)}
          </span>
        )}
      </div>
    );
  }

  // ── FULL MODE (for dedicated attendance pages) ────────
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
              {isCheckedIn
                ? formatTime(secondsWorked)
                : attendance?.worked_time || "—"}
            </p>
          </div>
        </div>

        {/* Location badge */}
        {attendance?.distance_meters !== undefined &&
          attendance?.distance_meters !== null && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium ${
                attendance?.is_inside_radius
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              <FiMapPin className="h-3.5 w-3.5 shrink-0" />
              {attendance?.is_inside_radius
                ? `Inside workplace radius · ${Number(
                    attendance.distance_meters
                  ).toFixed(0)}m from office`
                : `Outside workplace radius · ${Number(
                    attendance.distance_meters
                  ).toFixed(0)}m from office`}
            </div>
          )}

        {/* Action button */}
        {isShiftFinished ? (
          <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-2">
            <FiCheckCircle className="h-4 w-4" />
            <span>
              {t(
                "attendance.shiftFinishedFull",
                "Shift completed for today. Thank you!"
              )}
            </span>
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={handleAction}
            disabled={isActionPending}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition cursor-pointer disabled:opacity-60 ${
              isCheckOutMode
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isActionPending ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : isCheckOutMode ? (
                <FiLogOut className="h-4 w-4" />
              ) : (
                <FiLogIn className="h-4 w-4" />
              )}
              {isActionPending
                ? t("attendance.loading", "Please wait...")
                : isCheckOutMode
                ? t("attendance.checkOut", "Check Out")
                : t("attendance.checkIn", "Check In")}
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
