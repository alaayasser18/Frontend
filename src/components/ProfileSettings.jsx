import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  FiUsers,
  FiMapPin,
  FiMessageSquare,
  FiActivity,
  FiSettings,
  FiX,
} from "react-icons/fi";

import { profileSettingsConfig } from "../config/profileSettingsConfig";
import { useAuth } from "../context/AuthContext";
import { getEmployeeById } from "../features/employee/api";

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "U";

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const ProfileSettings = ({ role = "employee" }) => {
  const { t, i18n } = useTranslation();
  const { logout, currentUser } = useAuth();

  /*
   * Keep the existing config as fallback
   * for non-employee roles.
   */
  const initialData =
    profileSettingsConfig[role] || profileSettingsConfig.employee;

  /*
   * Get logged-in employee ID.
   */
  const employeeId = currentUser?.id ?? currentUser?.userId;

  /*
   * Backend expects only "ar" or "en".
   */
  const language = i18n.language?.startsWith("ar") ? "ar" : "en";

  /*
   * Fetch employee profile from backend.
   *
   * GET /employees/{id}?lang=ar|en
   */
  const {
    data: employee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employee", employeeId, language],

    queryFn: () => getEmployeeById(employeeId, language),

    enabled: role === "employee" && Boolean(employeeId),
  });

  /*
   * Convert backend employee response
   * into the structure already used by the UI.
   *
   * For non-employee roles, keep the existing config.
   */
  const employeeProfileData =
    role === "employee" && employee
      ? {
          fullName: employee.name || "",
          jobTitle: employee.job_title || "",
          employeeId: employee.employee_code || "",
          directManager: employee.manager?.name || "-",
          workLocation: employee.company_location?.name || "-",
          workEmail: employee.email || "",
          phone: employee.phone || "-",
        }
      : initialData;

  /*
   * Local edited values.
   *
   * This is only for the current UI session.
   * It does NOT update the backend yet because
   * we currently only have the GET profile endpoint.
   */
  const [editedProfile, setEditedProfile] = useState(null);

  /*
   * The profile displayed by the UI.
   *
   * API data is the source of truth.
   * If the user edits the profile locally,
   * editedProfile temporarily overrides those fields.
   */
  const data = editedProfile
    ? {
        ...employeeProfileData,
        ...editedProfile,
      }
    : employeeProfileData;

  const [biometricLogin, setBiometricLogin] = useState(
    initialData?.biometricLogin ?? false,
  );

  const [pushNotifications, setPushNotifications] = useState(
    initialData?.pushNotifications ?? false,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: "",
    jobTitle: "",
    directManager: "",
    workLocation: "",
    workEmail: "",
    phone: "",
  });

  /*
   * Open Edit Profile modal.
   */
  const handleOpenEditModal = () => {
    setEditForm({
      fullName: data?.fullName || "",
      jobTitle: data?.jobTitle || "",
      directManager: data?.directManager || "",
      workLocation: data?.workLocation || "",
      workEmail: data?.workEmail || "",
      phone: data?.phone || "",
    });

    setIsEditModalOpen(true);
  };

  /*
   * Close Edit Profile modal.
   */
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  /*
   * Save profile locally.
   *
   * IMPORTANT:
   * This does NOT update the backend.
   * We only have GET /employees/{id} at the moment.
   */
  const handleSaveProfile = () => {
    setEditedProfile(editForm);
    setIsEditModalOpen(false);
  };

  /*
   * Confirm logout.
   */
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  /*
   * Loading state for employee profile.
   */
  if (role === "employee" && isLoading) {
    return (
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div>
          <p className="text-xs font-bold tracking-wider text-[#3f7d5a] uppercase mb-1">
            {t("profileSettingsPage.eyebrow", "Account")}
          </p>

          <h1 className="text-2xl md:text-[28px] font-bold text-[#1e293b] tracking-tight">
            {t("profileSettingsPage.title", "Profile & settings")}
          </h1>

          <p className="text-sm text-[#64748b] mt-1 font-normal">
            {t(
              "profileSettingsPage.subtitle",
              "Manage your employee profile and preferences.",
            )}
          </p>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Skeleton */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="h-24 bg-[#f1f5f9] animate-pulse" />

            <div className="px-6 pb-6">
              <div className="flex items-start justify-between -mt-8">
                <div className="size-16 rounded-full bg-[#e2e8f0] animate-pulse ring-4 ring-white" />

                <div className="mt-10 h-9 w-28 rounded-lg bg-[#f1f5f9] animate-pulse" />
              </div>

              <div className="mt-5 space-y-3">
                <div className="h-5 w-40 rounded bg-[#f1f5f9] animate-pulse" />
                <div className="h-4 w-32 rounded bg-[#f1f5f9] animate-pulse" />
                <div className="h-3 w-28 rounded bg-[#f1f5f9] animate-pulse" />
              </div>

              <div className="mt-5 pt-5 border-t border-[#f1f5f9] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 rounded bg-[#f8fafc] animate-pulse" />
                <div className="h-12 rounded bg-[#f8fafc] animate-pulse" />
                <div className="h-12 rounded bg-[#f8fafc] animate-pulse" />
                <div className="h-12 rounded bg-[#f8fafc] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Settings Skeleton */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="space-y-5">
              <div className="h-5 w-40 rounded bg-[#f1f5f9] animate-pulse" />

              <div className="h-4 w-56 rounded bg-[#f1f5f9] animate-pulse" />

              <div className="h-16 rounded bg-[#f8fafc] animate-pulse" />

              <div className="h-16 rounded bg-[#f8fafc] animate-pulse" />

              <div className="h-12 rounded bg-[#f8fafc] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state.
   */
  if (role === "employee" && isError) {
    return (
      <div className="w-full space-y-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#3f7d5a] uppercase mb-1">
            {t("profileSettingsPage.eyebrow", "Account")}
          </p>

          <h1 className="text-2xl md:text-[28px] font-bold text-[#1e293b] tracking-tight">
            {t("profileSettingsPage.title", "Profile & settings")}
          </h1>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-base font-bold text-red-700">
            {t(
              "profileSettingsPage.loadErrorTitle",
              "Unable to load your profile",
            )}
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error?.response?.data?.message ||
              error?.message ||
              t(
                "profileSettingsPage.loadError",
                "Something went wrong while loading your profile.",
              )}
          </p>
        </div>
      </div>
    );
  }

  /*
   * If there is no profile data at all,
   * don't render the profile section.
   */
  if (!data) return null;

  return (
    <>
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div>
          <p className="text-xs font-bold tracking-wider text-[#3f7d5a] uppercase mb-1">
            {t("profileSettingsPage.eyebrow", "Account")}
          </p>

          <h1 className="text-2xl md:text-[28px] font-bold text-[#1e293b] tracking-tight">
            {t("profileSettingsPage.title", "Profile & settings")}
          </h1>

          <p className="text-sm text-[#64748b] mt-1 font-normal">
            {t(
              "profileSettingsPage.subtitle",
              "Manage your employee profile and preferences.",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* =====================================================
              Left Card: Profile
          ====================================================== */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#102a43] to-[#486581]" />

            <div className="px-6 pb-6">
              <div className="flex items-start justify-between -mt-8">
                <div className="flex items-end gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-[#d9eee7] text-[#3f7d5a] text-lg font-bold ring-4 ring-white">
                    {getInitials(data.fullName)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="mt-10 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition"
                >
                  {t("profileSettingsPage.editProfile", "Edit profile")}
                </button>
              </div>

              <div className="mt-3">
                <h2 className="text-base font-bold text-[#1e293b]">
                  {data.fullName}
                </h2>

                <p className="text-sm text-[#64748b] mt-0.5">{data.jobTitle}</p>

                <p className="text-xs font-semibold text-[#3f7d5a] mt-1">
                  {data.employeeId}
                </p>
              </div>

              <div className="mt-5 pt-5 border-t border-[#f1f5f9] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Direct Manager */}
                <div className="flex items-start gap-3">
                  <FiUsers className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs text-[#64748b]">
                      {t("profileSettingsPage.directManager", "Direct manager")}
                    </p>

                    <p className="text-sm font-semibold text-[#1e293b] mt-0.5">
                      {data.directManager}
                    </p>
                  </div>
                </div>

                {/* Work Location */}
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs text-[#64748b]">
                      {t("profileSettingsPage.workLocation", "Work location")}
                    </p>

                    <p className="text-sm font-semibold text-[#1e293b] mt-0.5">
                      {data.workLocation}
                    </p>
                  </div>
                </div>

                {/* Work Email */}
                <div className="flex items-start gap-3">
                  <FiMessageSquare className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs text-[#64748b]">
                      {t("profileSettingsPage.workEmail", "Work email")}
                    </p>

                    <p className="text-sm font-semibold text-[#1e293b] mt-0.5">
                      {data.workEmail}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <FiActivity className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs text-[#64748b]">
                      {t("profileSettingsPage.phone", "Phone")}
                    </p>

                    <p className="text-sm font-semibold text-[#1e293b] mt-0.5">
                      {data.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              Right Card: Account Settings
          ====================================================== */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1e293b]">
                  {t("profileSettingsPage.accountSettings", "Account settings")}
                </h2>

                <p className="text-xs text-[#64748b] mt-0.5 font-normal">
                  {t(
                    "profileSettingsPage.accountSettingsSubtitle",
                    "Personalize how WiseWork works for you.",
                  )}
                </p>
              </div>

              <FiSettings className="w-5 h-5 text-[#94a3b8] shrink-0" />
            </div>

            <div className="divide-y divide-[#f1f5f9]">
              {/* Biometric Login */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-[#1e293b]">
                    {t("profileSettingsPage.biometricLogin", "Biometric login")}
                  </p>

                  <p className="text-xs text-[#64748b] mt-0.5">
                    {t(
                      "profileSettingsPage.biometricLoginDesc",
                      "Use device biometrics for a faster sign in.",
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={biometricLogin}
                  onClick={() => setBiometricLogin((prev) => !prev)}
                  className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${
                    biometricLogin ? "bg-[#12B76A]" : "bg-[#e2e8f0]"
                  }`}
                >
                  <span
                    className={`inline-block size-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                      biometricLogin
                        ? "translate-x-2.5 rtl:-translate-x-2.5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-[#1e293b]">
                    {t(
                      "profileSettingsPage.pushNotifications",
                      "Push notifications",
                    )}
                  </p>

                  <p className="text-xs text-[#64748b] mt-0.5">
                    {t(
                      "profileSettingsPage.pushNotificationsDesc",
                      "Receive updates about tasks and requests.",
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={pushNotifications}
                  onClick={() => setPushNotifications((prev) => !prev)}
                  className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${
                    pushNotifications ? "bg-[#12B76A]" : "bg-[#e2e8f0]"
                  }`}
                >
                  <span
                    className={`inline-block size-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                      pushNotifications
                        ? "translate-x-2.5 rtl:-translate-x-2.5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Language */}
              <div className="py-4">
                <p className="text-xs font-semibold text-[#1e293b] mb-2">
                  {t("profileSettingsPage.language", "Language")}
                </p>

                <select
                  value={i18n.language?.startsWith("ar") ? "ar" : "en"}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                >
                  <option value="en">{t("common.english", "English")}</option>

                  <option value="ar">{t("common.arabic", "العربية")}</option>
                </select>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="mt-5 w-full rounded-lg bg-[#fee2e2] px-4 py-3 text-sm font-semibold text-[#dc2626] hover:bg-[#fecaca] transition"
            >
              {t("profileSettingsPage.logout", "Log out")}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          Edit Profile Modal
      ========================================================= */}
      {isEditModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 !m-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4"
            style={{ margin: 0 }}
          >
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1e293b]">
                  {t("profileSettingsPage.editProfileTitle", "Edit profile")}
                </h3>

                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="text-[#94a3b8] hover:text-[#1e293b] transition"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                    {t("profileSettingsPage.fullNameLabel", "Full name")}
                  </label>

                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                    {t("profileSettingsPage.jobTitleLabel", "Job title")}
                  </label>

                  <input
                    type="text"
                    value={editForm.jobTitle}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        jobTitle: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  />
                </div>

                {/* Direct Manager */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                    {t("profileSettingsPage.directManager", "Direct manager")}
                  </label>

                  <input
                    type="text"
                    value={editForm.directManager}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        directManager: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  />
                </div>

                {/* Work Location */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                    {t("profileSettingsPage.workLocation", "Work location")}
                  </label>

                  <input
                    type="text"
                    value={editForm.workLocation}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        workLocation: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  />
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                    {t("profileSettingsPage.workEmail", "Work email")}
                  </label>

                  <input
                    type="email"
                    value={editForm.workEmail}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        workEmail: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                    {t("profileSettingsPage.phone", "Phone")}
                  </label>

                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#486581]/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="rounded-lg border border-[#e2e8f0] px-4 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition"
                >
                  {t("profileSettingsPage.cancelEdit", "Cancel")}
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="rounded-lg bg-[#243B53] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1c2f42] transition"
                >
                  {t("profileSettingsPage.saveChanges", "Save changes")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* =========================================================
          Logout Confirmation Modal
      ========================================================= */}
      {isLogoutModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 !m-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4"
            style={{ margin: 0 }}
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1e293b]">
                  {t(
                    "profileSettingsPage.logoutConfirmTitle",
                    "Confirm Logout",
                  )}
                </h3>

                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="text-[#94a3b8] hover:text-[#1e293b] transition"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-[#64748b] mb-6">
                {t(
                  "profileSettingsPage.logoutConfirmMessage",
                  "Are you sure you want to log out of your account?",
                )}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="rounded-lg border border-[#e2e8f0] px-4 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition"
                >
                  {t("profileSettingsPage.cancelLogout", "Cancel")}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="rounded-lg bg-[#dc2626] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b91c1c] transition"
                >
                  {t("profileSettingsPage.confirmLogout", "Log out")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProfileSettings;
