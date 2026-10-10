import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
   import { useAiTarget } from "../../hooks/useAiTarget";
   import AiEmployeePicker from "../shared/AiEmployeePicker";
import {
  LuSparkles,
  LuCheck,
  LuTarget,
  LuListOrdered,
  LuFlag,
} from "react-icons/lu";
import { useAuth } from "../../../../context/AuthContext";
import { useCareerCoach } from "../../hooks/useAi";
import {
  getAiLang,
  getQuarterOptions,
  getAiErrorMessage,
  formatAiDate,
  isInsufficientData
} from "../../utils/aiHelpers";
import AiSection from "../shared/AiSection";
import { AiLoading, AiError, AiEmpty } from "../shared/AiStates";
   import AiInsufficientData from "../shared/AiInsufficientData";

export default function CareerCoachView() {
  const { t, i18n } = useTranslation();
     const lang = getAiLang(i18n);

   // Employee: own code. Others: the employee entered in the picker.
   const target = useAiTarget();
   const employeeId = target.employeeId;

  const [period, setPeriod] = useState("");
  const periods = useMemo(() => getQuarterOptions(), []);
  const mutation = useCareerCoach(lang);

  const submit = () => {
    if (!employeeId) return;
    mutation.mutate({ employee_id: employeeId, period: period || null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const data = mutation.data?.data;
  console.log("career-coach response:", mutation.data);
     const insufficient = isInsufficientData(data);
   const hasContent =
     !insufficient &&
     data &&
    (data.development_focus ||
      data.strengths?.length ||
      data.development_areas?.length ||
      data.development_plan?.length ||
      data.follow_up?.checkpoint ||
      data.follow_up?.review_focus);

  return (
    <div className="space-y-6">
      {/* Request form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-xs sm:flex-row sm:items-end"
      >
           <AiEmployeePicker target={target} />
        <div className="min-w-0 flex-1">
          <label
            htmlFor="career-period"
            className="mb-1.5 block text-[12px] font-semibold text-[#486581]"
          >
            {t("ai.form.period")}
          </label>
          <select
            id="career-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full rounded-lg border border-[#d9e2ec] bg-white px-3 py-2 text-[13px] text-[#102a43] focus:border-[#486581] focus:outline-none focus:ring-1 focus:ring-[#486581]"
          >
            <option value="">{t("ai.form.noPeriod")}</option>
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || !employeeId}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#102a43] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#243b53] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuSparkles className="text-[15px]" />
          {mutation.isPending ? t("ai.form.generating") : t("ai.form.generate")}
        </button>
      </form>

      {target.isSelf && !employeeId && (
     <AiError message={t("ai.errors.noEmployeeCode")} />
   )}

      {/* Idle */}
      {mutation.isIdle && (
        <p className="text-[13px] text-[#627d98]">
          {t("ai.careerCoach.intro")}
        </p>
      )}

      {mutation.isPending && <AiLoading />}

      {mutation.isError && (
        <AiError
          message={getAiErrorMessage(mutation.error, t)}
          onRetry={submit}
        />
      )}

      {mutation.isSuccess && insufficient && (
     <AiInsufficientData
       message={data.message}
       missingCategories={data.missing_categories}
     />
   )}

   {mutation.isSuccess && !insufficient && !hasContent && (
        <AiEmpty
          title={t("ai.careerCoach.emptyTitle")}
          description={t("ai.careerCoach.emptyDescription")}
        />
      )}

      {mutation.isSuccess && hasContent && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Development focus */}
            {data.development_focus && (
              <div className="relative overflow-hidden rounded-2xl bg-[#102a43] p-6 text-white shadow-xs sm:p-8 lg:col-span-5">
                <div className="pointer-events-none absolute -top-10 end-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative z-10">
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#d1fae5] text-[#065f46]">
                    <LuSparkles className="text-[20px]" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#9fb3c8]">
                    {t("ai.careerCoach.developmentFocus")}
                  </p>
                  <h2 className="mt-2 break-words text-[22px] font-extrabold leading-snug tracking-tight sm:text-[26px]">
                    {data.development_focus}
                  </h2>
                </div>
              </div>
            )}

            <div className="min-w-0 space-y-6 lg:col-span-7">
              {data.strengths?.length > 0 && (
                <AiSection
                  title={t("ai.careerCoach.strengths")}
                  icon={LuCheck}
                >
                  <div className="flex flex-wrap gap-2">
                    {data.strengths.map((item) => (
                      <span
                        key={item}
                        className="inline-flex max-w-full items-center gap-1.5 break-words rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-[12.5px] font-medium text-[#166534]"
                      >
                        <LuCheck className="shrink-0 text-[12px]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </AiSection>
              )}

              {data.development_areas?.length > 0 && (
                <AiSection
                  title={t("ai.careerCoach.developmentAreas")}
                  icon={LuTarget}
                >
                  <ul className="space-y-2.5">
                    {data.development_areas.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[13.5px] text-[#243b53]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f766e]" />
                        <span className="min-w-0 break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AiSection>
              )}
            </div>
          </div>

          {(data.development_plan?.length > 0 ||
            data.follow_up?.checkpoint ||
            data.follow_up?.review_focus) && (
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
              {data.development_plan?.length > 0 && (
                <AiSection
                  title={t("ai.careerCoach.developmentPlan")}
                  icon={LuListOrdered}
                >
                  <ol className="space-y-3">
                    {data.development_plan.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#102a43] text-[12px] font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="min-w-0 break-words pt-0.5 text-[13.5px] text-[#243b53]">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </AiSection>
              )}

              {(data.follow_up?.checkpoint || data.follow_up?.review_focus) && (
                <AiSection
                  title={t("ai.careerCoach.followUp")}
                  icon={LuFlag}
                >
                  <dl className="space-y-4">
                    {data.follow_up.checkpoint && (
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#829ab1]">
                          {t("ai.careerCoach.checkpoint")}
                        </dt>
                        <dd className="mt-1 break-words text-[13.5px] text-[#243b53]">
                          {data.follow_up.checkpoint}
                        </dd>
                      </div>
                    )}
                    {data.follow_up.review_focus && (
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#829ab1]">
                          {t("ai.careerCoach.reviewFocus")}
                        </dt>
                        <dd className="mt-1 break-words text-[13.5px] text-[#243b53]">
                          {data.follow_up.review_focus}
                        </dd>
                      </div>
                    )}
                  </dl>
                </AiSection>
              )}
            </div>
          )}

          {data.created_at && (
            <p className="text-[11.5px] text-[#829ab1]">
              {t("ai.careerCoach.generatedAt")}:{" "}
              {formatAiDate(data.created_at, lang)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}