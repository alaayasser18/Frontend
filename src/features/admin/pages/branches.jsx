import { useState, useEffect } from "react";
import {
  LuBuilding2,
  LuChevronRight,
  LuArrowUpRight,
  LuPlus,
  LuX,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";

export default function Branches() {
  const { t } = useTranslation();

  // =========================
  // Branches Data
  // =========================
  const [branches, setBranches] = useState([
    {
      id: "cairo",
      name: "Cairo HQ",
      coordinates: "30.0444° N, 31.2357° E",
      radius: "100m",
      gpsEnforced: true,
    },
    {
      id: "alexandria",
      name: "Alexandria Hub",
      coordinates: "31.2001° N, 29.9187° E",
      radius: "100m",
      gpsEnforced: true,
    },
  ]);

  // =========================
  // Modal State
  // =========================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // =========================
  // Form State
  // =========================
  const [branchName, setBranchName] = useState("");

  const [gpsCoordinates, setGpsCoordinates] = useState(
    "30.0444° N, 31.2357° E",
  );

  const [geofenceRadius, setGeofenceRadius] = useState("100");

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

  // =========================
  // Toggle GPS
  // =========================
  const handleToggleGps = (branchId) => {
    setBranches((previousBranches) =>
      previousBranches.map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              gpsEnforced: !branch.gpsEnforced,
            }
          : branch,
      ),
    );
  };

  // =========================
  // Add New Branch
  // =========================
  const handleAddBranchSubmit = (event) => {
    event.preventDefault();

    if (!branchName.trim()) {
      return;
    }

    const newBranch = {
      id: `branch-${Date.now()}`,
      name: branchName.trim(),
      coordinates: gpsCoordinates.trim() || "30.0444° N, 31.2357° E",
      radius: `${geofenceRadius.trim() || "100"}m`,
      gpsEnforced: true,
    };

    setBranches((previousBranches) => [...previousBranches, newBranch]);

    setBranchName("");
    setGpsCoordinates("30.0444° N, 31.2357° E");
    setGeofenceRadius("100");
    setIsAddModalOpen(false);
  };

  // =========================
  // Export Branches Config
  // =========================
  const handleExportConfig = () => {
    const data =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(branches, null, 2));

    const downloadAnchor = document.createElement("a");

    downloadAnchor.href = data;
    downloadAnchor.download = "wisework_branches_config.json";

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      {/* =====================================================
          BRANCHES PAGE
      ===================================================== */}

      <div className="w-full max-w-[1400px] mx-auto box-border">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex justify-between items-end mb-[28px] gap-4 flex-wrap">
          {/* Header Left */}
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#829ab1] mb-2">
              <span>{t("branchesPage.breadcrumbApp")}</span>

              <LuChevronRight size={14} className="text-[#9fb3c8]" />

              <span className="text-[#486581]">
                {t("branchesPage.breadcrumbPage")}
              </span>
            </div>

            {/* Page Title */}
            <h1 className="text-[28px] font-bold leading-[1.2] text-[#243b53] tracking-[-0.02em]">
              {t("branchesPage.title")}
            </h1>

            {/* Page Subtitle */}
            <p className="text-[14px] text-[#627d98] mt-[6px] leading-[1.4]">
              {t("branchesPage.subtitle")}
            </p>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportConfig}
            className="
              inline-flex items-center justify-center
              gap-2
              h-10
              px-4
              bg-white
              border border-[#bcccdc]
              rounded-lg
              text-[#486581]
              text-[14px]
              font-semibold
              cursor-pointer
              shadow-[0_1px_2px_rgba(16,42,67,0.04)]
              transition-all duration-150 ease-in-out
              whitespace-nowrap
              hover:bg-[#f0f4f7]
              hover:border-[#9fb3c8]
            "
          >
            <LuArrowUpRight size={17} />

            <span>{t("branchesPage.exportConfig")}</span>
          </button>
        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <div
          className="
            bg-white
            border border-[#d9e2ec]
            rounded-[14px]
            py-6
            px-7
            shadow-[0_1px_3px_rgba(16,42,67,0.03)]
            box-border
          "
        >
          {/* Card Header */}
          <div
            className="
              flex justify-between items-start
              mb-6
              gap-4
              flex-wrap
            "
          >
            {/* Card Information */}
            <div>
              <h2 className="text-[18px] font-bold text-[#243b53] m-0 leading-[1.3]">
                {t("branchesPage.cardTitle")}
              </h2>

              <p className="text-[14px] text-[#829ab1] mt-1 leading-[1.4]">
                {t("branchesPage.cardSubtitle")}
              </p>
            </div>

            {/* Add Branch Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="
                inline-flex items-center justify-center
                gap-2
                h-10
                px-[18px]
                bg-[#243b53]
                border-0
                rounded-lg
                text-white
                text-[14px]
                font-semibold
                cursor-pointer
                shadow-[0_1px_3px_rgba(16,42,67,0.12)]
                transition-colors duration-150 ease-in-out
                whitespace-nowrap
                hover:bg-[#334e68]
              "
            >
              <LuPlus size={17} />

              <span>{t("branchesPage.addBranch")}</span>
            </button>
          </div>

          {/* =====================================================
              BRANCHES GRID
          ===================================================== */}

          <div
            className="
              grid
              grid-cols-1
              min-[901px]:grid-cols-2
              gap-4
            "
          >
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="
                  bg-white
                  border border-[#d9e2ec]
                  rounded-xl
                  py-5
                  px-[22px]
                  flex flex-col
                  justify-between
                  min-h-[154px]
                  box-border
                  transition-colors duration-150 ease-in-out
                  hover:border-[#bcccdc]
                "
              >
                {/* =================================================
                    TOP ROW
                ================================================= */}

                <div className="flex justify-between items-start gap-3">
                  {/* Branch Information */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Branch Icon */}
                    <div
                      className="
                        w-[42px]
                        h-[42px]
                        rounded-lg
                        bg-[#e7eef5]
                        text-[#486581]
                        flex items-center justify-center
                        shrink-0
                      "
                    >
                      <LuBuilding2 size={21} />
                    </div>

                    {/* Branch Name + Coordinates */}
                    <div className="min-w-0">
                      <h3
                        className="
                          text-[16px]
                          font-bold
                          text-[#243b53]
                          m-0
                          leading-[1.2]
                        "
                      >
                        {branch.name}
                      </h3>

                      <p
                        className="
                          text-[12px]
                          text-[#829ab1]
                          mt-1
                          leading-normal
                          whitespace-nowrap
                        "
                      >
                        {branch.coordinates}
                      </p>
                    </div>
                  </div>

                  {/* Radius Badge */}
                  <div
                    className="
                      inline-flex items-center
                      gap-[6px]
                      h-[26px]
                      px-[10px]
                      bg-[#e7eef5]
                      text-[#486581]
                      rounded-full
                      text-[12px]
                      font-semibold
                      shrink-0
                      whitespace-nowrap
                    "
                  >
                    <span
                      className="
                        w-[6px]
                        h-[6px]
                        rounded-full
                        bg-[#486581]
                      "
                    />

                    <span>
                      {branch.radius} {t("branchesPage.radiusSuffix")}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    BOTTOM GPS ROW
                ================================================= */}

                <div
                  className="
                    flex justify-between items-center
                    mt-[18px]
                    pt-[14px]
                    border-t border-[#eef1f4]
                    gap-3
                  "
                >
                  {/* GPS Information */}
                  <div>
                    <p
                      className="
                        text-[14px]
                        font-semibold
                        text-[#486581]
                        m-0
                        leading-[1.2]
                      "
                    >
                      {t("branchesPage.gpsEnforcement")}
                    </p>

                    <p
                      className="
                        text-[12px]
                        text-[#829ab1]
                        mt-[2px]
                        m-0
                        leading-[1.3]
                      "
                    >
                      {t("branchesPage.gpsEnforcementDesc")}
                    </p>
                  </div>

                  {/* GPS Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleGps(branch.id)}
                    aria-label={t("branchesPage.toggleGpsAriaLabel", {
                      name: branch.name,
                    })}
                    aria-pressed={branch.gpsEnforced}
                    className={`
                      relative
                      w-11
                      h-6
                      rounded-full
                      border-0
                      cursor-pointer
                      shrink-0
                      p-0
                      outline-none
                      transition-colors duration-200 ease-in-out
                      ${branch.gpsEnforced ? "bg-[#5b8c6a]" : "bg-[#bcccdc]"}
                    `}
                  >
                    <span
                      className={`
                        absolute
                        top-1
                        w-4
                        h-4
                        rounded-full
                        bg-white
                        shadow-[0_1px_3px_rgba(0,0,0,0.18)]
                        transition-[left] duration-200 ease-in-out
                        ${branch.gpsEnforced ? "left-6" : "left-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          ADD BRANCH MODAL
      ===================================================== */}

      {isAddModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[60]
            flex items-center justify-center
            bg-[rgba(16,42,67,0.5)]
            p-4
            box-border
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsAddModalOpen(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-[512px]
              bg-white
              rounded-2xl
              p-6
              shadow-[0_20px_30px_rgba(16,42,67,0.2)]
              box-border
            "
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
                flex justify-between items-center
                mb-5
              "
            >
              <h2
                className="
                  text-[18px]
                  font-bold
                  text-[#243b53]
                  m-0
                "
              >
                {t("branchesPage.modalTitle")}
              </h2>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                aria-label={t("branchesPage.closeModal")}
                className="
                  bg-transparent
                  border-0
                  text-[#627d98]
                  p-[6px]
                  rounded-md
                  cursor-pointer
                  flex items-center justify-center
                  transition-all duration-150
                  hover:bg-[#f0f4f7]
                  hover:text-[#243b53]
                "
              >
                <LuX size={20} />
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleAddBranchSubmit}
              className="
                flex flex-col
                gap-4
              "
            >
              {/* BRANCH NAME */}

              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="branch-name"
                  className="
                    text-[14px]
                    font-medium
                    text-[#486581]
                  "
                >
                  {t("branchesPage.branchNameLabel")}
                </label>

                <input
                  id="branch-name"
                  type="text"
                  placeholder={t("branchesPage.branchNamePlaceholder")}
                  value={branchName}
                  onChange={(event) => setBranchName(event.target.value)}
                  required
                  className="
                    h-[42px]
                    w-full
                    border
                    border-[#bcccdc]
                    rounded-lg
                    bg-white
                    px-3
                    text-[14px]
                    text-[#243b53]
                    outline-none
                    box-border
                    transition-all duration-150
                    placeholder:text-[#829ab1]
                    focus:border-[#486581]
                    focus:shadow-[0_0_0_2px_#d9e2ec]
                  "
                />
              </div>

              {/* GPS COORDINATES */}

              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="gps-coordinates"
                  className="
                    text-[14px]
                    font-medium
                    text-[#486581]
                  "
                >
                  {t("branchesPage.gpsCoordinatesFieldLabel")}
                </label>

                <input
                  id="gps-coordinates"
                  type="text"
                  placeholder="30.0444° N, 31.2357° E"
                  value={gpsCoordinates}
                  onChange={(event) => setGpsCoordinates(event.target.value)}
                  className="
                    h-[42px]
                    w-full
                    border
                    border-[#bcccdc]
                    rounded-lg
                    bg-white
                    px-3
                    text-[14px]
                    text-[#243b53]
                    outline-none
                    box-border
                    transition-all duration-150
                    placeholder:text-[#829ab1]
                    focus:border-[#486581]
                    focus:shadow-[0_0_0_2px_#d9e2ec]
                  "
                />
              </div>

              {/* GEOFENCE RADIUS */}

              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="geofence-radius"
                  className="
                    text-[14px]
                    font-medium
                    text-[#486581]
                  "
                >
                  {t("branchesPage.geofenceRadiusLabel")}
                </label>

                <input
                  id="geofence-radius"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={geofenceRadius}
                  onChange={(event) => setGeofenceRadius(event.target.value)}
                  className="
                    h-[42px]
                    w-full
                    border
                    border-[#bcccdc]
                    rounded-lg
                    bg-white
                    px-3
                    text-[14px]
                    text-[#243b53]
                    outline-none
                    box-border
                    transition-all duration-150
                    placeholder:text-[#829ab1]
                    focus:border-[#486581]
                    focus:shadow-[0_0_0_2px_#d9e2ec]
                  "
                />
              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <div
                className="
                  flex justify-end
                  gap-[10px]
                  mt-2
                "
              >
                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="
                    h-10
                    px-[18px]
                    bg-white
                    border
                    border-[#bcccdc]
                    rounded-lg
                    text-[#486581]
                    text-[14px]
                    font-semibold
                    cursor-pointer
                    transition-all duration-150
                    hover:bg-[#f0f4f7]
                  "
                >
                  {t("branchesPage.cancel")}
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    h-10
                    px-[18px]
                    bg-[#243b53]
                    border-0
                    rounded-lg
                    text-white
                    text-[14px]
                    font-semibold
                    cursor-pointer
                    transition-colors duration-150
                    hover:bg-[#334e68]
                  "
                >
                  {t("branchesPage.addBranch")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
