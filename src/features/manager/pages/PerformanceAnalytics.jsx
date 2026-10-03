import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// =========================
// API CONFIG — رابط مباشر وصريح
// =========================
const API_ROOT = "https://nontelepathically-pamphletary-cyndi.ngrok-free.dev/api";

const PerformanceAnalytics = () => {
  const { t } = useTranslation();

  // =========================
  // STATES
  // =========================
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Competencies (ثابتة — لعدم توفرها في استجابة الـ API الحالية)
  const competencies = [
    { id: 1, nameKey: "technicalExecution", defaultName: "Technical execution", value: 82 },
    { id: 2, nameKey: "communication", defaultName: "Communication", value: 74 },
    { id: 3, nameKey: "ownership", defaultName: "Ownership", value: 68 },
    { id: 4, nameKey: "mentorship", defaultName: "Mentorship", value: 56 },
  ];

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          per_page: "10",
        });

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_ROOT}/manager/team-performance?${params.toString()}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "Accept-Language": localStorage.getItem("lang") || "en",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.message || `Failed to load (${response.status})`);
        }

        const json = await response.json();
        setData(json?.data ?? null);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [page]);

  // =========================
  // DERIVED DATA
  // =========================
  const membersMeta = data?.team_members ?? {};
  const members = membersMeta.data ?? [];

  const currentPage = membersMeta.current_page ?? 1;
  const lastPage = membersMeta.last_page ?? 1;
  const hasPagination = lastPage > 1;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* PAGE HEADER */}
      <motion.div variants={fadeUp} transition={{ duration: 0.2, ease: "easeOut" }}>
        <p className="text-[11px] font-bold tracking-wider text-[#6b879f] uppercase">
          {t("portal.managerPortal", "MANAGER PORTAL")} /{" "}
          {t("portal.performanceAnalytics", "PERFORMANCE ANALYTICS")}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-lg md:text-[21px] font-bold text-[#1e293b] tracking-tight">
            {t("portal.performanceAnalytics", "Performance Analytics")}
          </h1>
          {data?.period_name && (
            <span className="rounded-full bg-[#eef5f1] px-3 py-1 text-[11px] font-semibold text-[#2f6f4d]">
              {data.period_name}
            </span>
          )}
        </div>
        <p className="text-sm text-[#829ab1] mt-1 font-normal">
          {t(
            "managerDashboard.subtitle",
            "Keep your team aligned, supported, and moving forward.",
          )}
        </p>
      </motion.div>

      {/* ERROR */}
      {error && (
        <motion.div variants={fadeUp} className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-5">
          <p className="text-sm font-semibold text-[#dc2626]">{error}</p>
        </motion.div>
      )}

      {/* LOADING */}
      {loading && !data && (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#e2e8f0] border-t-[#334e68] rounded-full animate-spin" />
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: Competencies */}
        <motion.section
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        >
          <h2 className="text-base font-bold text-[#102a43] mb-6">
            {t(
              "managerPerformanceAnalytics.departmentCompetencyDistribution",
              "Department competency distribution",
            )}
          </h2>

          <div className="space-y-5">
            {competencies.map((competency, index) => {
              const label = t(
                `managerPerformanceAnalytics.competencies.${competency.nameKey}`,
                competency.defaultName,
              );
              return (
                <div key={competency.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="font-medium text-[#334155]">{label}</span>
                    <span className="font-bold text-[#102a43]">{competency.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${competency.value}%` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 + index * 0.05 }}
                      className="h-full rounded-full bg-[#334e68]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* RIGHT: Team Performance Index — من الـ API */}
        <motion.section
          variants={fadeUp}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        >
          <h2 className="text-base font-bold text-[#102a43] mb-4">
            {t("managerPerformanceAnalytics.teamPerformanceIndex", "Team Performance Index")}
          </h2>

          {members.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#94a3b8]">
              {t("managerPerformanceAnalytics.noMembers", "No team members found")}
            </p>
          ) : (
            <div className="divide-y divide-[#f1f5f9]">
              {members.map((member) => {
                const score = Number(member.overall_score ?? 0);
                const rating = (score / 20).toFixed(1);

                return (
                  <div
                    key={member.user_id ?? member.employee_id}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="w-1/3 min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-[#1e293b] truncate">
                        {member.name}
                      </p>
                    </div>

                    <div className="w-1/3 text-center">
                      <span className="text-xs md:text-sm text-[#64748b]">
                        {score.toFixed(1).replace(/\.0$/, "")}%{" "}
                        {t("managerPerformanceAnalytics.velocity", "velocity")}
                      </span>
                    </div>

                    <div className="w-1/3 text-right rtl:text-left">
                      <span className="text-xs md:text-sm font-bold text-[#059669]">
                        {rating}/5
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION */}
          {hasPagination && !loading && (
            <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-4">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#334155] transition hover:bg-[#f8fafc] disabled:opacity-40"
              >
                {t("common.prev", "Prev")}
              </button>
              <span className="text-xs text-[#94a3b8]">
                {currentPage} / {lastPage}
              </span>
              <button
                type="button"
                disabled={currentPage >= lastPage}
                onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#334155] transition hover:bg-[#f8fafc] disabled:opacity-40"
              >
                {t("common.next", "Next")}
              </button>
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default PerformanceAnalytics;