import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FiArrowUpRight,
    FiPlus,
    FiX,
    FiChevronDown,
} from "react-icons/fi";
import DepartmentTable from "../../../components/DepartmentTable";

const PerformancePage = () => {
    const { t, i18n } = useTranslation();

    const isRtl = i18n.language?.startsWith("ar");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Evaluation Cycle Form
    const [cycleTitle, setCycleTitle] = useState("Q4 2026 Review");
    const [startDate, setStartDate] = useState("2026-10-01");
    const [endDate, setEndDate] = useState("2026-12-31");
    const [targetAudience, setTargetAudience] = useState("All Company");

    const [weightage, setWeightage] = useState({
        technical: 30,
        goals: 35,
        leadership: 20,
        attendance: 15,
    });

    // Open Modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close Modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Update Weightage
    const handleWeightageChange = (key, value) => {
        setWeightage((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Save Cycle
    const handleSaveCycle = () => {
        const totalWeightage = Object.values(weightage).reduce(
            (sum, value) => sum + Number(value || 0),
            0
        );

        if (!cycleTitle.trim()) {
            alert(
                t(
                    "performance.enterCycleTitle",
                    "Please enter a cycle title."
                )
            );
            return;
        }

        if (!startDate || !endDate) {
            alert(
                t(
                    "performance.selectDates",
                    "Please select start and end dates."
                )
            );
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert(
                t(
                    "performance.invalidDates",
                    "Start date must be before end date."
                )
            );
            return;
        }

        if (totalWeightage !== 100) {
            alert(
                t(
                    "performance.weightageMustBe100",
                    "Total weightage must equal 100%."
                )
            );
            return;
        }

        console.log("Evaluation Cycle:", {
            cycleTitle,
            startDate,
            endDate,
            targetAudience,
            weightage,
        });

        setIsModalOpen(false);
    };

    return (
        <div
            dir={isRtl ? "rtl" : "ltr"}
            className="w-full"
        >
            {/* Page Header */}
            <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#243B53] sm:text-[28px]">
                        {t(
                            "performance.title",
                            "Performance & Goals"
                        )}
                    </h1>

                    <p className="mt-2 text-sm text-[#627d98]">
                        {t(
                            "performance.subtitle",
                            "Configure and manage your WiseWork performance & goals."
                        )}
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#bcccdc] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#486581] transition-colors hover:bg-[#f0f4f7]"
                >
                    <FiArrowUpRight className="h-4 w-4" />

                    {t(
                        "performance.exportConfiguration",
                        "Export configuration"
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-6">
                {/* Top Cards */}
                <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                    {/* Goals & Evaluation Governance */}
                    <section className="rounded-xl border border-[#d9e2ec] bg-white p-5 sm:p-6">
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#243B53]">
                                    {t(
                                        "performance.governanceTitle",
                                        "Goals & evaluation governance"
                                    )}
                                </h2>

                                <p className="mt-1 text-sm text-[#829ab1]">
                                    {t(
                                        "performance.governanceSubtitle",
                                        "System-wide criteria and review cycle controls."
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openModal}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#243B53] px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#334e68]"
                            >
                                <FiPlus className="h-4 w-4" />

                                {t(
                                    "performance.createEvaluation",
                                    "Create Evaluation Cycle"
                                )}
                            </button>
                        </div>

                        {/* Active Cycle */}
                        <div className="rounded-xl border border-[#d9e2ec] bg-[#f7fafb] p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3eb] px-2.5 py-1 text-xs font-semibold text-[#3f7d5a]">
                                        <span className="size-1.5 rounded-full bg-current" />

                                        {t(
                                            "performance.activeCycle",
                                            "Active cycle"
                                        )}
                                    </span>

                                    <h3 className="mt-3 text-lg font-bold text-[#243B53]">
                                        {t("performance.activeCycleTitle", "Q3 2026 Review")}
                                    </h3>

                                    <p className="mt-1 text-sm text-[#627d98]">
                                        {t(
                                            "performance.activeCycleDetails",
                                            "Jul 01 – Sep 30, 2026 · 1,248 employees"
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#bcccdc] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#486581] transition-colors hover:bg-[#f0f4f7]"
                                >
                                    {t(
                                        "performance.editCycle",
                                        "Edit cycle"
                                    )}
                                </button>
                            </div>

                            {/* Completion */}
                            <div className="mt-6">
                                <div className="mb-2 flex justify-between text-xs font-semibold text-[#627d98]">
                                    <span>
                                        {t(
                                            "performance.reviewCompletion",
                                            "Review completion"
                                        )}
                                    </span>

                                    <span>64%</span>
                                </div>

                                <div className="h-2 rounded-full bg-[#d9e2ec]">
                                    <div className="h-full w-[64%] rounded-full bg-[#5b8c6a]" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Criteria Weightage */}
                    <section className="rounded-xl border border-[#d9e2ec] bg-white p-5 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-[#243B53]">
                                {t(
                                    "performance.criteriaWeightage",
                                    "Criteria weightage"
                                )}
                            </h2>

                            <p className="mt-1 text-sm text-[#829ab1]">
                                {t(
                                    "performance.criteriaSubtitle",
                                    "The score composition for the active cycle."
                                )}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Technical */}
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-[#486581]">
                                        {t(
                                            "performance.technicalCompetency",
                                            "Technical competency"
                                        )}
                                    </span>

                                    <span className="font-bold text-[#243B53]">
                                        30%
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-[#eef1f4]">
                                    <div
                                        className="h-full rounded-full bg-[#486581]"
                                        style={{ width: "30%" }}
                                    />
                                </div>
                            </div>

                            {/* Goals */}
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-[#486581]">
                                        {t(
                                            "performance.goalsDelivery",
                                            "Goals delivery"
                                        )}
                                    </span>

                                    <span className="font-bold text-[#243B53]">
                                        35%
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-[#eef1f4]">
                                    <div
                                        className="h-full rounded-full bg-[#486581]"
                                        style={{ width: "35%" }}
                                    />
                                </div>
                            </div>

                            {/* Leadership */}
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-[#486581]">
                                        {t(
                                            "performance.leadershipCulture",
                                            "Leadership & culture"
                                        )}
                                    </span>

                                    <span className="font-bold text-[#243B53]">
                                        20%
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-[#eef1f4]">
                                    <div
                                        className="h-full rounded-full bg-[#486581]"
                                        style={{ width: "20%" }}
                                    />
                                </div>
                            </div>

                            {/* Attendance */}
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium text-[#486581]">
                                        {t(
                                            "performance.attendanceReliability",
                                            "Attendance & reliability"
                                        )}
                                    </span>

                                    <span className="font-bold text-[#243B53]">
                                        15%
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-[#eef1f4]">
                                    <div
                                        className="h-full rounded-full bg-[#486581]"
                                        style={{ width: "15%" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Department Table */}
                <DepartmentTable />
            </div>

            {/* ================================================== */}
            {/* CREATE EVALUATION CYCLE MODAL */}
            {/* ================================================== */}

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#243B53]/55 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        dir={isRtl ? "rtl" : "ltr"}
                        className="relative max-h-[90vh] w-full max-w-[604px] overflow-y-auto rounded-[20px] bg-white p-6 shadow-2xl sm:p-7"
                    >
                        {/* Modal Header */}
                        <div className="mb-7 flex items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-[#243B53]">
                                {t(
                                    "performance.createCycleTitle",
                                    "Create Evaluation Cycle"
                                )}
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#627d98] transition hover:bg-[#f0f4f7] hover:text-[#243B53]"
                                aria-label={t(
                                    "performance.close",
                                    "Close"
                                )}
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Cycle Title */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-[#486581]">
                                {t(
                                    "performance.cycleTitle",
                                    "Cycle Title"
                                )}
                            </label>

                            <input
                                type="text"
                                value={cycleTitle}
                                onChange={(event) =>
                                    setCycleTitle(event.target.value)
                                }
                                placeholder={t(
                                    "performance.cycleTitlePlaceholder",
                                    "Q4 2026 Review"
                                )}
                                className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3.5 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                            />
                        </div>

                        {/* Start Date & End Date */}
                        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Start Date */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#486581]">
                                    {t(
                                        "performance.startDate",
                                        "Start Date"
                                    )}
                                </label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(event) =>
                                        setStartDate(event.target.value)
                                    }
                                    className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#486581]">
                                    {t(
                                        "performance.endDate",
                                        "End Date"
                                    )}
                                </label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
                                    className="h-12 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                                />
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-semibold text-[#486581]">
                                {t(
                                    "performance.targetAudience",
                                    "Target Audience"
                                )}
                            </label>

                            <div className="relative">
                                <select
                                    value={targetAudience}
                                    onChange={(event) =>
                                        setTargetAudience(event.target.value)
                                    }
                                    className="h-12 w-full appearance-none rounded-xl border border-[#bcccdc] bg-white px-3.5 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                                >
                                    <option value="All Company">
                                        {t(
                                            "performance.allCompany",
                                            "All Company"
                                        )}
                                    </option>

                                    <option value="Engineering">
                                        {t(
                                            "performance.engineering",
                                            "Engineering"
                                        )}
                                    </option>

                                    <option value="HR">
                                        {t(
                                            "performance.hr",
                                            "HR"
                                        )}
                                    </option>

                                    <option value="Finance">
                                        {t(
                                            "performance.finance",
                                            "Finance"
                                        )}
                                    </option>

                                    <option value="Sales">
                                        {t(
                                            "performance.sales",
                                            "Sales"
                                        )}
                                    </option>
                                </select>

                                <FiChevronDown
                                    className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#486581] ${isRtl ? "left-3.5" : "right-3.5"
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Dynamic Weightage */}
                        <div className="mb-7">
                            <h3 className="mb-5 text-base font-semibold text-[#486581]">
                                {t(
                                    "performance.dynamicWeightage",
                                    "Dynamic weightage"
                                )}
                            </h3>

                            <div className="flex flex-col gap-4">
                                {/* Technical Competency */}
                                <div className="flex items-center justify-between gap-4">
                                    <label className="text-sm font-medium text-[#627d98]">
                                        {t(
                                            "performance.technicalCompetency",
                                            "Technical competency"
                                        )}
                                    </label>

                                    <div className="relative w-[94px] shrink-0">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={weightage.technical}
                                            onChange={(event) =>
                                                handleWeightageChange(
                                                    "technical",
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                                        />

                                        <span
                                            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs text-[#829ab1] ${isRtl ? "left-3" : "right-3"
                                                }`}
                                        >
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Goals Delivery */}
                                <div className="flex items-center justify-between gap-4">
                                    <label className="text-sm font-medium text-[#627d98]">
                                        {t(
                                            "performance.goalsDelivery",
                                            "Goals delivery"
                                        )}
                                    </label>

                                    <div className="relative w-[94px] shrink-0">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={weightage.goals}
                                            onChange={(event) =>
                                                handleWeightageChange(
                                                    "goals",
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                                        />

                                        <span
                                            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs text-[#829ab1] ${isRtl ? "left-3" : "right-3"
                                                }`}
                                        >
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Leadership & Culture */}
                                <div className="flex items-center justify-between gap-4">
                                    <label className="text-sm font-medium text-[#627d98]">
                                        {t(
                                            "performance.leadershipCulture",
                                            "Leadership & culture"
                                        )}
                                    </label>

                                    <div className="relative w-[94px] shrink-0">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={weightage.leadership}
                                            onChange={(event) =>
                                                handleWeightageChange(
                                                    "leadership",
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                                        />

                                        <span
                                            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs text-[#829ab1] ${isRtl ? "left-3" : "right-3"
                                                }`}
                                        >
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Attendance & Reliability */}
                                <div className="flex items-center justify-between gap-4">
                                    <label className="text-sm font-medium text-[#627d98]">
                                        {t(
                                            "performance.attendanceReliability",
                                            "Attendance & reliability"
                                        )}
                                    </label>

                                    <div className="relative w-[94px] shrink-0">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={weightage.attendance}
                                            onChange={(event) =>
                                                handleWeightageChange(
                                                    "attendance",
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 w-full rounded-xl border border-[#bcccdc] bg-white px-3 text-sm font-medium text-[#486581] outline-none transition focus:border-[#486581] focus:ring-2 focus:ring-[#486581]/10"
                                        />

                                        <span
                                            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs text-[#829ab1] ${isRtl ? "left-3" : "right-3"
                                                }`}
                                        >
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Weightage */}
                            <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f7fafb] px-4 py-3 text-sm">
                                <span className="font-semibold text-[#486581]">
                                    {t(
                                        "performance.totalWeightage",
                                        "Total weightage"
                                    )}
                                </span>

                                <span
                                    className={`font-bold ${Object.values(weightage).reduce(
                                        (sum, value) =>
                                            sum + Number(value || 0),
                                        0
                                    ) === 100
                                            ? "text-[#3f7d5a]"
                                            : "text-[#d97706]"
                                        }`}
                                >
                                    {Object.values(weightage).reduce(
                                        (sum, value) =>
                                            sum + Number(value || 0),
                                        0
                                    )}
                                    %
                                </span>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div
                            className={`flex flex-col-reverse gap-3 sm:flex-row ${isRtl
                                    ? "sm:justify-start"
                                    : "sm:justify-end"
                                }`}
                        >
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#bcccdc] bg-white px-5 text-sm font-semibold text-[#486581] transition-colors hover:bg-[#f0f4f7]"
                            >
                                {t(
                                    "performance.cancel",
                                    "Cancel"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveCycle}
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#243B53] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#334e68]"
                            >
                                {t(
                                    "performance.saveCycle",
                                    "Save cycle"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformancePage;