import { useState } from "react";
import { Plus, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// =====================================================
// MOTION
// =====================================================

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
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
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

// =====================================================
// DATA
// =====================================================

const initialHolidays = [
  {
    id: "eid-al-fitr",
    nameKey: "eidAlFitr",
    dateRange: "Apr 10 – Apr 12, 2026",
    totalDaysKey: "threeDays",
    statusKey: "activeOfficialLeave",
  },
  {
    id: "revolution-day",
    nameKey: "revolutionDay",
    dateRange: "Jul 23, 2026",
    totalDaysKey: "oneDay",
    statusKey: "activeOfficialLeave",
  },
  {
    id: "new-years-day",
    nameKey: "newYearsDay",
    dateRange: "Jan 01, 2027",
    totalDaysKey: "oneDay",
    statusKey: "activeOfficialLeave",
  },
];

// =====================================================
// SCHEDULE HOLIDAY MODAL
// =====================================================

function ScheduleHolidayModal({ onClose, onSave }) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [totalDays, setTotalDays] = useState("");

  // =====================================================
  // SAVE HOLIDAY
  // =====================================================

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name,
      dateRange,
      totalDays,
    });
  };

  return (
    <motion.div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[#0f172a]/40
        p-4
        backdrop-blur-[2px]
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
          w-full
          max-w-xl
          overflow-hidden
          rounded-2xl
          border
          border-[#e2e8f0]/80
          bg-white
          shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* =================================================
            MODAL HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#f1f5f9]
            px-5
            py-4
          "
        >
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
            className="
              rounded-lg
              p-2
              text-[#94a3b8]
              transition
              hover:bg-[#f8fafc]
              hover:text-[#475569]
            "
            aria-label={t("holidays.modal.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <div className="space-y-5 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* HOLIDAY NAME */}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {t("holidays.modal.holidayName")}
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("holidays.modal.holidayNamePlaceholder")}
                className="
                  mt-1.5
                  w-full
                  rounded-lg
                  border
                  border-[#e2e8f0]
                  bg-white
                  px-3
                  py-2.5
                  text-xs
                  text-[#1e293b]
                  outline-none
                  transition
                  placeholder:text-[#94a3b8]
                  focus:border-[#94a3b8]
                  focus:ring-2
                  focus:ring-[#f1f5f9]
                "
              />
            </div>

            {/* DATE RANGE */}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {t("holidays.modal.dateRange")}
              </label>

              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder={t("holidays.modal.dateRangePlaceholder")}
                className="
                  mt-1.5
                  w-full
                  rounded-lg
                  border
                  border-[#e2e8f0]
                  bg-white
                  px-3
                  py-2.5
                  text-xs
                  text-[#1e293b]
                  outline-none
                  transition
                  placeholder:text-[#94a3b8]
                  focus:border-[#94a3b8]
                  focus:ring-2
                  focus:ring-[#f1f5f9]
                "
              />
            </div>
          </div>

          {/* TOTAL DAYS */}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              {t("holidays.modal.totalDays")}
            </label>

            <input
              type="text"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              placeholder={t("holidays.modal.totalDaysPlaceholder")}
              className="
                mt-1.5
                w-full
                rounded-lg
                border
                border-[#e2e8f0]
                bg-white
                px-3
                py-2.5
                text-xs
                text-[#1e293b]
                outline-none
                transition
                placeholder:text-[#94a3b8]
                focus:border-[#94a3b8]
                focus:ring-2
                focus:ring-[#f1f5f9]
              "
            />
          </div>

          {/* =================================================
              MODAL ACTIONS
          ================================================= */}

          <div
            className="
              flex
              justify-end
              gap-3
              border-t
              border-[#f1f5f9]
              pt-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                border
                border-[#e2e8f0]
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-[#475569]
                transition
                hover:bg-[#f8fafc]
              "
            >
              {t("holidays.modal.cancel")}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                rounded-lg
                bg-[#243B53]
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#1c2f42]
              "
            >
              {t("holidays.modal.save")}
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

  const [holidays, setHolidays] = useState(initialHolidays);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =====================================================
  // SAVE NEW HOLIDAY
  // =====================================================

  const handleSaveHoliday = ({ name, dateRange, totalDays }) => {
    setHolidays((prev) => [
      ...prev,
      {
        id: `${name.toLowerCase().replace(/\s+/g, "-")}-${prev.length}`,
        customName: name,
        customDateRange: dateRange || "—",
        customTotalDays: totalDays || "—",
        statusKey: "activeOfficialLeave",
      },
    ]);

    setIsModalOpen(false);
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
        {/* =================================================
            HEADER
        ================================================= */}

        <motion.header
          variants={itemVariants}
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
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

          {/* SCHEDULE HOLIDAY */}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-[#243B53]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#1c2f42]
            "
          >
            <Plus className="h-4 w-4" />

            <span>{t("holidays.scheduleHoliday")}</span>
          </button>
        </motion.header>

        {/* =================================================
            PEAK ALERT BANNER
        ================================================= */}

        <motion.div
          variants={itemVariants}
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-[#fed7aa]
            bg-[#fff7ed]
            p-5
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white
              text-[#f97316]
            "
          >
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

        {/* =================================================
            HOLIDAYS TABLE
        ================================================= */}

        <motion.div
          variants={itemVariants}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#e2e8f0]/80
            bg-white
            shadow-[0_1px_3px_rgba(0,0,0,0.03)]
          "
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

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#eff6ff]
                  text-[#3b82f6]
                "
              >
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] table-fixed text-start">
              {/* =================================================
                  TABLE HEAD
              ================================================= */}

              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="w-[30%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.holidayName")}
                  </th>

                  <th className="w-[25%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.dateRange")}
                  </th>

                  <th className="w-[20%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.totalDays")}
                  </th>

                  <th className="w-[25%] px-5 py-3 text-start text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] sm:px-6">
                    {t("holidays.table.status")}
                  </th>
                </tr>
              </thead>

              {/* =================================================
                  TABLE BODY
              ================================================= */}

              <tbody>
                {holidays.map((holiday, index) => (
                  <motion.tr
                    key={holiday.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: 0.15 + index * 0.06,
                    }}
                    className="
                      border-b
                      border-[#f1f5f9]
                      transition
                      last:border-b-0
                      hover:bg-[#f8fafc]
                    "
                  >
                    {/* HOLIDAY NAME */}

                    <td className="px-5 py-4 text-start text-sm font-bold text-[#1e293b] sm:px-6">
                      {holiday.customName ||
                        t(`holidays.items.${holiday.nameKey}.name`)}
                    </td>

                    {/* DATE RANGE */}

                    <td className="px-5 py-4 text-start text-sm font-normal text-[#64748b] sm:px-6">
                      <span dir="auto" className="inline-block">
                        {holiday.customDateRange || holiday.dateRange}
                      </span>
                    </td>

                    {/* TOTAL DAYS */}

                    <td className="px-5 py-4 text-start text-sm font-normal text-[#64748b] sm:px-6">
                      {holiday.customTotalDays ||
                        t(`holidays.${holiday.totalDaysKey}`)}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4 text-start sm:px-6">
                      <span
                        className="
                          inline-block
                          rounded-full
                          border
                          border-[#a7f3d0]
                          bg-[#ecfdf5]
                          px-3
                          py-1
                          text-[11px]
                          font-bold
                          text-[#047857]
                        "
                      >
                        {t(`holidays.status.${holiday.statusKey}`)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* =================================================
          SCHEDULE HOLIDAY MODAL
      ================================================= */}

      <AnimatePresence>
        {isModalOpen && (
          <ScheduleHolidayModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveHoliday}
          />
        )}
      </AnimatePresence>
    </>
  );
}
