import { useState, useEffect } from "react";
import {
  LuBuilding2,
  LuChevronRight,
  LuArrowUpRight,
  LuPlus,
  LuX,
  LuCheck,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// =========================
// API CONFIG
// =========================
const getApiRoot = () => {
  const raw = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    ""
  ).replace(/\/+$/, "");

  if (!raw) return "/api";
  return raw.endsWith("/api") ? raw : `${raw}/api`;
};

const API_ROOT = getApiRoot();

// 🛠 تعديل مسارات الـ API بناءً على الـ Routes في الدكيومينتيشن
const ENDPOINT_MUTATE = "/locations/company/location"; 
const ENDPOINT_GET = "/locations/company/location/active"; 

// تحويل الإحداثيات من أرقام لنص العرض
const formatCoordinates = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return "—";
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(
    lng
  ).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18 },
  },
};

const modalPanel = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 18,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: {
      duration: 0.18,
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

export default function Branches() {
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language?.startsWith("ar");

  // =========================
  // Branches Data — من الـ API
  // =========================
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // =========================
  // Modal State
  // =========================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // =========================
  // Toast State
  // =========================
  const [toast, setToast] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // =========================
  // Form State
  // =========================
  const [branchName, setBranchName] = useState("");
  const [latitude, setLatitude] = useState("30.0444");
  const [longitude, setLongitude] = useState("31.2357");
  const [geofenceRadius, setGeofenceRadius] = useState("350");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // دالة مساعدة لتجهيز الرابط صح بدون تكرار الـ api
  const buildUrl = (path) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return API_ROOT.endsWith("/api") && cleanPath.startsWith("/api")
      ? `${API_ROOT.replace(/\/api$/, "")}${cleanPath}`
      : `${API_ROOT}${cleanPath}`;
  };

  // =====================================================
  // FETCH — GET API
  // =====================================================
  useEffect(() => {
    const controller = new AbortController();

    const fetchBranches = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const token = localStorage.getItem("token");
        const lang = i18n.language?.startsWith("ar") ? "ar" : "en";

        const finalUrl = buildUrl(ENDPOINT_GET);
        console.log("Full Request URL being fetched:", finalUrl);

        const response = await fetch(finalUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Accept-Language": lang,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.message || `Failed to load (${response.status})`);
        }

        const json = await response.json();

        let list = [];
        if (Array.isArray(json?.data)) {
          list = json.data;
        } else if (Array.isArray(json?.data?.data)) {
          list = json.data.data;
        } else if (Array.isArray(json)) {
          list = json;
        }

        setBranches(list);
      } catch (e) {
        if (e.name === "AbortError") return;
        setApiError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // Show Toast
  // =========================
  const showSuccessToast = (title, message) => {
    setToast({
      visible: true,
      title,
      message,
    });

    window.setTimeout(() => {
      setToast((previousToast) => ({
        ...previousToast,
        visible: false,
      }));
    }, 3000);
  };

  // =========================
  // Close Modal with Escape
  // =========================
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAddModalOpen(false);
      }
    };

    if (isAddModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddModalOpen]);

  // =====================================================
  // Toggle GPS — PUT على السيرفر
  // =====================================================
  const handleToggleGps = async (branch) => {
    const previousState = !!branch.is_active;
    const newState = !previousState;
    const token = localStorage.getItem("token");

    setBranches((previousBranches) =>
      previousBranches.map((item) =>
        item.id === branch.id ? { ...item, is_active: newState } : item
      )
    );

    showSuccessToast(
      newState
        ? t("branchesPage.gpsEnabledToastTitle")
        : t("branchesPage.gpsDisabledToastTitle"),
      newState
        ? t("branchesPage.gpsEnabledToastMessage", { name: branch.name })
        : t("branchesPage.gpsDisabledToastMessage", { name: branch.name })
    );

    try {
      const response = await fetch(
        `${buildUrl(ENDPOINT_MUTATE)}/${branch.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            name: branch.name,
            latitude: Number(branch.latitude),
            longitude: Number(branch.longitude),
            radius: Number(branch.radius),
            is_active: newState,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || "Failed to update");
      }
    } catch (e) {
      setBranches((previousBranches) =>
        previousBranches.map((item) =>
          item.id === branch.id ? { ...item, is_active: previousState } : item
        )
      );
      showSuccessToast(
        t("branchesPage.updateFailedTitle", "Error"),
        e.message || t("branchesPage.updateFailed", "Failed to update location.")
      );
    }
  };

  // =====================================================
  // Add New Branch — POST API
  // =====================================================
  const handleAddBranchSubmit = async (event) => {
    event.preventDefault();

    if (!branchName.trim() || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const lang = i18n.language?.startsWith("ar") ? "ar" : "en";

      const response = await fetch(buildUrl(ENDPOINT_MUTATE), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Language": lang,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          name: branchName.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
          radius: Number(geofenceRadius) || 350,
          is_active: isActive,
        }),
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        let firstError = null;
        if (json?.errors && typeof json.errors === "object") {
          const firstKey = Object.keys(json.errors)[0];
          firstError = json.errors[firstKey]?.[0] ?? null;
        }
        throw new Error(
          firstError || json?.message || `Failed (${response.status})`
        );
      }

      const created = json?.data;
      if (created) {
        setBranches((previousBranches) => [...previousBranches, created]);
      }

      setBranchName("");
      setLatitude("30.0444");
      setLongitude("31.2357");
      setGeofenceRadius("350");
      setIsActive(true);
      setIsAddModalOpen(false);

      showSuccessToast(
        json?.message || t("branchesPage.branchAddedToastTitle", "Location added"),
        t(
          "branchesPage.branchAddedToastMessage",
          "The new location was added successfully."
        )
      );
    } catch (e) {
      showSuccessToast(
        t("branchesPage.updateFailedTitle", "Error"),
        e.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Export Branches Config
  // =========================
  const handleExportConfig = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      branches,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");

    downloadAnchor.href = url;
    downloadAnchor.download = "wisework_locations_config.json";

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    showSuccessToast(
      t("branchesPage.exportSuccessTitle", "Export successful"),
      t(
        "branchesPage.exportSuccessMessage",
        "Locations configuration exported successfully."
      )
    );
  };

  return (
    <>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="w-full max-w-[1400px] mx-auto box-border"
      >
        {/* HEADER */}
        <div className="flex justify-between items-end mb-[28px] gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#829ab1] mb-2">
              <span>{t("branchesPage.breadcrumbApp")}</span>

              <LuChevronRight
                size={14}
                className={`text-[#9fb3c8] ${isRtl ? "rotate-180" : ""}`}
              />

              <span className="text-[#486581]">
                {t("branchesPage.breadcrumbPage")}
              </span>
            </div>

            <h1 className="text-[28px] font-bold leading-[1.2] text-[#243b53] tracking-[-0.02em]">
              Locations
            </h1>

            <p className="text-[14px] text-[#627d98] mt-[6px] leading-[1.4]">
              Configure and manage your WiseWork locations.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={handleExportConfig}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#bcccdc] rounded-lg text-[#486581] text-[14px] font-semibold cursor-pointer shadow-[0_1px_2px_rgba(16,42,67,0.04)] transition-all duration-150 ease-in-out whitespace-nowrap hover:bg-[#f0f4f7] hover:border-[#9fb3c8]"
          >
            <LuArrowUpRight size={17} />

            <span>Export Config</span>
          </motion.button>
        </div>

        {/* API ERROR */}
        {apiError && (
          <div className="mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4">
            <p className="text-sm font-semibold text-[#dc2626]">{apiError}</p>
          </div>
        )}

        {/* MAIN CARD */}
        <div className="bg-white border border-[#d9e2ec] rounded-[14px] py-6 px-7 shadow-[0_1px_3px_rgba(16,42,67,0.03)] box-border">
          <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
            <div>
              <h2 className="text-[18px] font-bold text-[#243b53] m-0 leading-[1.3]">
                Branch locations
              </h2>

              <p className="text-[14px] text-[#829ab1] mt-1 leading-[1.4]">
                Configure GPS enforcement for each location
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 h-10 px-[18px] bg-[#243b53] border-0 rounded-lg text-white text-[14px] font-semibold cursor-pointer shadow-[0_1px_3px_rgba(16,42,67,0.12)] transition-colors duration-150 ease-in-out whitespace-nowrap hover:bg-[#334e68]"
            >
              <LuPlus size={17} />

              <span>Add Location</span>
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 min-[901px]:grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className="bg-white border border-[#d9e2ec] rounded-xl py-5 px-[22px] min-h-[154px] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[42px] h-[42px] rounded-lg bg-[#f1f5f9] animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/2 rounded bg-[#f1f5f9] animate-pulse" />
                      <div className="h-3 w-2/3 rounded bg-[#f1f5f9] animate-pulse" />
                    </div>
                  </div>
                  <div className="h-3 w-1/3 rounded bg-[#f1f5f9] animate-pulse" />
                </div>
              ))}
            </div>
          ) : branches.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#829ab1]">
              No locations found
            </p>
          ) : (
            <div className="grid grid-cols-1 min-[901px]:grid-cols-2 gap-4">
              {branches.map((branch) => (
                <motion.div
                  key={branch.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-[#d9e2ec] rounded-xl py-5 px-[22px] flex flex-col justify-between min-h-[154px] box-border transition-colors duration-150 ease-in-out hover:border-[#bcccdc]"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-[42px] h-[42px] rounded-lg bg-[#e7eef5] text-[#486581] flex items-center justify-center shrink-0">
                        <LuBuilding2 size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[16px] font-bold text-[#243b53] m-0 leading-[1.2]">
                          {branch.name}
                        </h3>

                        <p className="text-[12px] text-[#829ab1] mt-1 leading-normal whitespace-nowrap">
                          {formatCoordinates(branch.latitude, branch.longitude)}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-[6px] h-[26px] px-[10px] bg-[#e7eef5] text-[#486581] rounded-full text-[12px] font-semibold shrink-0 whitespace-nowrap">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#486581]" />
                      <span>{branch.radius} m</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-[18px] pt-[14px] border-t border-[#eef1f4] gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-[#486581] m-0 leading-[1.2]">
                        {t("branchesPage.gpsEnforcement")}
                      </p>

                      <p className="text-[12px] text-[#829ab1] mt-[2px] m-0 leading-[1.3]">
                        {t("branchesPage.gpsEnforcementDesc")}
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleToggleGps(branch)}
                      aria-label={`Toggle GPS for ${branch.name}`}
                      aria-pressed={!!branch.is_active}
                      className={`relative w-11 h-6 rounded-full border-0 cursor-pointer shrink-0 p-0 outline-none transition-colors duration-200 ease-in-out ${
                        branch.is_active ? "bg-[#5b8c6a]" : "bg-[#bcccdc]"
                      }`}
                    >
                      <motion.span
                        animate={{ x: 0 }}
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-[left] duration-200 ease-in-out ${
                          branch.is_active ? "left-6" : "left-1"
                        }`}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD LOCATION MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            key="branch-modal-backdrop"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(16,42,67,0.5)] p-4 box-border"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsAddModalOpen(false);
              }
            }}
          >
            <motion.div
              key="branch-modal-panel"
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              dir={isRtl ? "rtl" : "ltr"}
              className="w-full max-w-[512px] bg-white rounded-2xl p-6 shadow-[0_20px_30px_rgba(16,42,67,0.2)] box-border max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[18px] font-bold text-[#243b53] m-0">
                  Add Location
                </h2>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  aria-label="Close modal"
                  className="bg-transparent border-0 text-[#627d98] p-[6px] rounded-md cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-[#f0f4f7] hover:text-[#243b53]"
                >
                  <LuX size={20} />
                </button>
              </div>

              <form onSubmit={handleAddBranchSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="branch-name"
                    className="text-[14px] font-medium text-[#486581]"
                  >
                    Location Name
                  </label>

                  <input
                    id="branch-name"
                    type="text"
                    placeholder="e.g. Cairo Headquarters"
                    value={branchName}
                    onChange={(event) => setBranchName(event.target.value)}
                    required
                    className="h-[42px] w-full border border-[#bcccdc] rounded-lg bg-white px-3 text-[14px] text-[#243b53] outline-none box-border transition-all duration-150 placeholder:text-[#829ab1] focus:border-[#486581] focus:shadow-[0_0_0_2px_#d9e2ec]"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="branch-latitude"
                    className="text-[14px] font-medium text-[#486581]"
                  >
                    Latitude
                  </label>

                  <input
                    id="branch-latitude"
                    type="number"
                    step="any"
                    placeholder="30.0444"
                    value={latitude}
                    onChange={(event) => setLatitude(event.target.value)}
                    required
                    className="h-[42px] w-full border border-[#bcccdc] rounded-lg bg-white px-3 text-[14px] text-[#243b53] outline-none box-border transition-all duration-150 placeholder:text-[#829ab1] focus:border-[#486581] focus:shadow-[0_0_0_2px_#d9e2ec]"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="branch-longitude"
                    className="text-[14px] font-medium text-[#486581]"
                  >
                    Longitude
                  </label>

                  <input
                    id="branch-longitude"
                    type="number"
                    step="any"
                    placeholder="31.2357"
                    value={longitude}
                    onChange={(event) => setLongitude(event.target.value)}
                    required
                    className="h-[42px] w-full border border-[#bcccdc] rounded-lg bg-white px-3 text-[14px] text-[#243b53] outline-none box-border transition-all duration-150 placeholder:text-[#829ab1] focus:border-[#486581] focus:shadow-[0_0_0_2px_#d9e2ec]"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="geofence-radius"
                    className="text-[14px] font-medium text-[#486581]"
                  >
                    Geofence Radius (meters)
                  </label>

                  <input
                    id="geofence-radius"
                    type="number"
                    min="1"
                    placeholder="350"
                    value={geofenceRadius}
                    onChange={(event) => setGeofenceRadius(event.target.value)}
                    className="h-[42px] w-full border border-[#bcccdc] rounded-lg bg-white px-3 text-[14px] text-[#243b53] outline-none box-border transition-all duration-150 placeholder:text-[#829ab1] focus:border-[#486581] focus:shadow-[0_0_0_2px_#d9e2ec]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="branch-is-active"
                    className="text-[14px] font-medium text-[#486581]"
                  >
                    Active
                  </label>

                  <button
                    id="branch-is-active"
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    onClick={() => setIsActive((prev) => !prev)}
                    className={`relative w-11 h-6 rounded-full border-0 cursor-pointer p-0 outline-none transition-colors duration-200 ease-in-out ${
                      isActive ? "bg-[#5b8c6a]" : "bg-[#bcccdc]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-[left] duration-200 ease-in-out ${
                        isActive ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end gap-[10px] mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-10 px-[18px] bg-white border border-[#bcccdc] rounded-lg text-[#486581] text-[14px] font-semibold cursor-pointer transition-all duration-150 hover:bg-[#f0f4f7]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-10 px-[18px] bg-[#243b53] border-0 rounded-lg text-white text-[14px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#334e68] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : "Add Location"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-5 ${
              isRtl ? "left-5" : "right-5"
            } z-[100] flex items-center gap-3 rounded-xl border border-[#d9e2ec] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(16,42,67,0.12)]`}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[#e8f3eb] text-[#3f7d5a]">
              <LuCheck size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#243B53]">{toast.title}</p>
              <p className="mt-0.5 text-xs text-[#829ab1]">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}