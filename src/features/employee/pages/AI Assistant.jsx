import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LuTrendingUp,
  LuBookOpen,
  LuSparkles,
  LuArrowRight,
  LuArrowLeft,
  LuCheck,
  LuChevronRight,
  LuChevronLeft,
  LuX,
  LuSearch,
  LuSend,
  LuShieldCheck,
  LuLightbulb,
} from "react-icons/lu";

export default function AIAssistant() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // Active Tab State ("career" | "policy")
  // ==========================================
  const [activeTab, setActiveTab] = useState("career");

  // ==========================================
  // Development Plan Modal State
  // ==========================================
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planSteps, setPlanSteps] = useState([
    { id: "step1", completed: true },
    { id: "step2", completed: true },
    { id: "step3", completed: false },
  ]);

  const toggleStep = (stepId) => {
    setPlanSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step,
      ),
    );
  };

  const completedCount = planSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / planSteps.length) * 100);

  // ==========================================
  // Policy Assistant Chat State
  // ==========================================
  const [policyQuery, setPolicyQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "msg-1",
      qKey: "chatAnnualCarryoverQ",
      aKey: "chatAnnualCarryoverA",
      sKey: "sourceFootnote",
    },
    {
      id: "msg-2",
      qKey: "chatRemoteWorkQ",
      aKey: "chatRemoteWorkA",
      sKey: "sourceFootnote",
    },
    {
      id: "msg-3",
      qKey: "chatSickLeaveQ",
      aKey: "chatSickLeaveA",
      sKey: "sourceFootnote",
    },
  ]);

  const handleAskPolicy = (e) => {
    e.preventDefault();
    if (!policyQuery.trim()) return;

    const queryText = policyQuery.trim();
    const newMsg = {
      id: `msg-${Date.now()}`,
      customQ: queryText,
      customA: isRtl
        ? `إجابة اللائحة مستندة إلى دليل الموظف وسجل الموظف الحالي الخاص بك.`
        : `Your policy answer is grounded in the Employee Handbook and your current employee record.`,
      customS: isRtl
        ? "المصدر: دليل الموظف · قسم 4.2"
        : "Source: Employee Handbook · Sec 4.2",
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setPolicyQuery("");
  };

    // ==========================================
  // Open Policy Assistant automatically when
  // navigated here from a Company Policies card
  // ==========================================
  useEffect(() => {
    if (location.state?.openPolicyAssistant) {
      setActiveTab("policy");

      const policyTitle = location.state.policyTitleKey
        ? t(location.state.policyTitleKey, location.state.policyDefaultTitle)
        : location.state.policyDefaultTitle;

      if (policyTitle) {
        const contextMsg = {
          id: `msg-policy-${Date.now()}`,
          customQ: t("aiAssistant.policyContextQuestion", {
            policy: policyTitle,
            defaultValue: `Tell me about the "${policyTitle}" policy.`,
          }),
          customA: t("aiAssistant.policyContextAnswer", {
            policy: policyTitle,
            defaultValue: `Here's what you need to know about "${policyTitle}", based on the Employee Handbook and current company policies.`,
          }),
          customS: t("aiAssistant.sourceFootnote"),
        };
        setChatMessages((prev) => [...prev, contextMsg]);
      }

      // نمسح الـ state عشان لو المستخدم عمل refresh، الرسالة متتكررش
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendPill = (qKey, aKey) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      qKey: qKey,
      aKey: aKey,
      sKey: "sourceFootnote",
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto box-border font-sans text-[#102a43]">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-6">
        {/* Top Tag */}
        <span className="text-[11px] font-bold tracking-[0.08em] text-[#5b8c6a] uppercase block mb-1">
          {t("aiAssistant.tag")}
        </span>

        {/* Title */}
        <h1 className="text-[26px] sm:text-[30px] font-extrabold text-[#102a43] tracking-tight leading-tight">
          {t("aiAssistant.title")}
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] sm:text-[14px] text-[#627d98] mt-1">
          {t("aiAssistant.subtitle")}
        </p>
      </div>

      {/* =====================================================
          TABS SWITCHER
      ===================================================== */}
      <div className="flex items-center gap-3 mb-7">
        {/* Career Coach Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("career")}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "career"
              ? "bg-[#102a43] text-white shadow-xs"
              : "bg-white border border-[#d9e2ec] hover:border-[#9fb3c8] text-[#486581] hover:bg-[#f8fafc]"
          }`}
        >
          <LuTrendingUp className="text-[16px]" />
          <span>{t("aiAssistant.tabCareerCoach")}</span>
        </button>

        {/* Policy Assistant Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("policy")}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "policy"
              ? "bg-[#102a43] text-white shadow-xs"
              : "bg-white border border-[#d9e2ec] hover:border-[#9fb3c8] text-[#486581] hover:bg-[#f8fafc]"
          }`}
        >
          <LuBookOpen className="text-[16px]" />
          <span>{t("aiAssistant.tabPolicyAssistant")}</span>
        </button>
      </div>

      {/* =====================================================
          TAB 1: CAREER COACH VIEW
      ===================================================== */}
      {activeTab === "career" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ==========================================
              LEFT COLUMN: HERO CARD (6 COLS)
          ========================================== */}
          <div className="lg:col-span-6 bg-[#102a43] text-white rounded-2xl p-7 sm:p-9 flex flex-col justify-between shadow-xs min-h-[440px] relative overflow-hidden">
            {/* Soft background radial glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top section */}
            <div className="relative z-10">
              {/* Mint green sparkle badge */}
              <div className="w-12 h-12 rounded-xl bg-[#d1fae5] text-[#065f46] flex items-center justify-center mb-8 shadow-xs">
                <LuSparkles className="text-[22px]" />
              </div>

              {/* Main Heading */}
              <h2 className="text-[24px] sm:text-[28px] font-extrabold text-white leading-snug tracking-tight max-w-[360px]">
                {t("aiAssistant.heroTitle")}
              </h2>

              {/* Description */}
              <p className="text-[13px] sm:text-[14px] text-[#9fb3c8] mt-3 leading-relaxed max-w-[380px]">
                {t("aiAssistant.heroSubtitle")}
              </p>
            </div>

            {/* Bottom Action Link */}
            <div className="mt-8 relative z-10">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="inline-flex items-center gap-2 text-white font-semibold text-[14px] hover:text-[#d1fae5] transition-colors cursor-pointer group"
              >
                <span>{t("aiAssistant.explorePlan")}</span>
                {isRtl ? (
                  <LuArrowLeft className="text-[16px] group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <LuArrowRight className="text-[16px] group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </div>

          {/* ==========================================
              RIGHT COLUMN: STRENGTHS & FOCUS (6 COLS)
          ========================================== */}
          <div className="lg:col-span-6 space-y-6">
            {/* Card 1: Your Strengths */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="mb-5">
                <h3 className="text-[18px] font-bold text-[#102a43] leading-tight">
                  {t("aiAssistant.strengthsTitle")}
                </h3>
                <p className="text-[13px] text-[#627d98] mt-0.5">
                  {t("aiAssistant.strengthsSubtitle")}
                </p>
              </div>

              <div className="space-y-4">
                {/* Item 1: Data Storytelling */}
                <div
                  onClick={() => setIsPlanModalOpen(true)}
                  className="flex items-start justify-between gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LuCheck className="text-[13px] stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#102a43] leading-tight group-hover:text-[#0f766e] transition-colors">
                        {t("aiAssistant.dataStorytelling")}
                      </h4>
                      <p className="text-[12.5px] text-[#627d98] mt-1 leading-normal">
                        {t("aiAssistant.dataStorytellingQuote")}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#9fb3c8] text-[18px] flex-shrink-0 pt-0.5">
                    {isRtl ? <LuChevronLeft /> : <LuChevronRight />}
                  </div>
                </div>

                <div className="border-t border-[#f0f4f8]" />

                {/* Item 2: Cross-team Reliability */}
                <div
                  onClick={() => setIsPlanModalOpen(true)}
                  className="flex items-start justify-between gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LuCheck className="text-[13px] stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#102a43] leading-tight group-hover:text-[#0f766e] transition-colors">
                        {t("aiAssistant.crossTeamReliability")}
                      </h4>
                      <p className="text-[12.5px] text-[#627d98] mt-1 leading-normal">
                        {t("aiAssistant.crossTeamReliabilityQuote")}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#9fb3c8] text-[18px] flex-shrink-0 pt-0.5">
                    {isRtl ? <LuChevronLeft /> : <LuChevronRight />}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Development Focus */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
              <div className="mb-5">
                <h3 className="text-[18px] font-bold text-[#102a43] leading-tight">
                  {t("aiAssistant.developmentFocusTitle")}
                </h3>
                <p className="text-[13px] text-[#627d98] mt-0.5">
                  {t("aiAssistant.developmentFocusSubtitle")}
                </p>
              </div>

              <div className="space-y-4">
                {/* Item 1: Delegation */}
                <div
                  onClick={() => setIsPlanModalOpen(true)}
                  className="flex items-start justify-between gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LuCheck className="text-[13px] stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#102a43] leading-tight group-hover:text-[#0f766e] transition-colors">
                        {t("aiAssistant.delegation")}
                      </h4>
                      <p className="text-[12.5px] text-[#627d98] mt-1 leading-normal">
                        {t("aiAssistant.delegationQuote")}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#9fb3c8] text-[18px] flex-shrink-0 pt-0.5">
                    {isRtl ? <LuChevronLeft /> : <LuChevronRight />}
                  </div>
                </div>

                <div className="border-t border-[#f0f4f8]" />

                {/* Item 2: Executive Brevity */}
                <div
                  onClick={() => setIsPlanModalOpen(true)}
                  className="flex items-start justify-between gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LuCheck className="text-[13px] stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#102a43] leading-tight group-hover:text-[#0f766e] transition-colors">
                        {t("aiAssistant.executiveBrevity")}
                      </h4>
                      <p className="text-[12.5px] text-[#627d98] mt-1 leading-normal">
                        {t("aiAssistant.executiveBrevityQuote")}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#9fb3c8] text-[18px] flex-shrink-0 pt-0.5">
                    {isRtl ? <LuChevronLeft /> : <LuChevronRight />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 2: POLICY ASSISTANT VIEW
      ===================================================== */}
      {activeTab === "policy" && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs">
          {/* Header inside Card */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#f0f4f8]">
            <div className="w-10 h-10 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center flex-shrink-0">
              <LuSparkles className="text-[20px]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#102a43] leading-snug">
                {t("aiAssistant.policyHeaderTitle", "Policy Assistant")}
              </h3>
              <p className="flex items-center gap-1.5 text-[12px] text-[#627d98] font-medium mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>
                  {t(
                    "aiAssistant.policyHeaderSubtitle",
                    "Grounded in WiseWork policies",
                  )}
                </span>
              </p>
            </div>
          </div>

          {/* Chat Conversation Area */}
          <div className="py-6 space-y-6">
            {chatMessages.map((msg) => {
              const question = msg.customQ || t(`aiAssistant.${msg.qKey}`);
              const answer = msg.customA || t(`aiAssistant.${msg.aKey}`);
              const source = msg.customS || t(`aiAssistant.${msg.sKey}`);

              return (
                <div key={msg.id} className="space-y-4">
                  {/* User Question Bubble */}
                  <div
                    className={`flex ${isRtl ? "justify-start" : "justify-end"}`}
                  >
                    <div className="bg-[#102a43] text-white text-[13.5px] px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] sm:max-w-[75%] font-medium shadow-xs">
                      {question}
                    </div>
                  </div>

                  {/* Assistant Answer Card */}
                  <div
                    className={`flex ${isRtl ? "justify-end" : "justify-start"}`}
                  >
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 max-w-[85%] sm:max-w-[70%] shadow-xs">
                      <p className="text-[13px] sm:text-[13.5px] text-[#243b53] leading-relaxed">
                        {answer}
                      </p>
                      <div className="border-t border-[#f0f4f8] mt-3 pt-2.5">
                        <span className="text-[11.5px] text-[#829ab1] font-medium">
                          {source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Suggestion Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2 mb-3">
            <button
              type="button"
              onClick={() =>
                handleSendPill("chatSickLeaveQ", "chatSickLeaveA")
              }
              className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] hover:bg-[#dcfce7] text-[12px] font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              {t("aiAssistant.pillSickLeave")}
            </button>

            <button
              type="button"
              onClick={() =>
                handleSendPill("chatRemoteWorkQ", "chatRemoteWorkA")
              }
              className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] hover:bg-[#dcfce7] text-[12px] font-medium px-4 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              {t("aiAssistant.pillRemoteWork")}
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleAskPolicy}
            className="border border-[#d9e2ec] rounded-xl p-1.5 flex items-center justify-between bg-white focus-within:border-[#486581] focus-within:ring-1 focus-within:ring-[#486581] transition-all"
          >
            <input
              type="text"
              value={policyQuery}
              onChange={(e) => setPolicyQuery(e.target.value)}
              placeholder={t("aiAssistant.policyPlaceholder")}
              className={`w-full px-3.5 py-2 text-[13px] text-[#102a43] placeholder-[#9fb3c8] bg-transparent focus:outline-none ${isRtl ? "text-right" : "text-left"}`}
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-lg bg-[#102a43] hover:bg-[#243b53] text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            >
              {isRtl ? (
                <LuArrowLeft className="text-[15px]" />
              ) : (
                <LuArrowRight className="text-[15px]" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* =====================================================
          DEVELOPMENT PLAN MODAL
      ===================================================== */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102a43]/50 backdrop-blur-xs transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[620px] border border-[#e2e8f0] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#edf2f7]">
              <div>
                <h3 className="text-[18px] font-bold text-[#102a43]">
                  {t("aiAssistant.planModalTitle")}
                </h3>
                <p className="text-[12px] text-[#627d98] mt-0.5">
                  {t("aiAssistant.planModalSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#627d98] hover:text-[#102a43] hover:bg-[#f0f4f8] transition-colors cursor-pointer"
              >
                <LuX className="text-[18px]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-[12px] font-semibold mb-1.5">
                  <span className="text-[#334e68]">
                    {t("aiAssistant.planProgress")}
                  </span>
                  <span className="text-[#0f766e]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#edf2f7] h-[6px] rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f766e] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Items */}
              <div>
                <h4 className="text-[13px] font-bold text-[#102a43] uppercase tracking-wider mb-3">
                  {t("aiAssistant.actionItems")}
                </h4>
                <div className="space-y-3">
                  {/* Step 1 */}
                  <div
                    onClick={() => toggleStep("step1")}
                    className="p-3.5 rounded-lg border border-[#edf2f7] bg-[#f8fafc] hover:bg-[#f0f4f8] transition-colors flex items-start gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        planSteps.find((s) => s.id === "step1")?.completed
                          ? "bg-[#0f766e] text-white"
                          : "border border-[#cbd5e1] bg-white"
                      }`}
                    >
                      {planSteps.find((s) => s.id === "step1")?.completed && (
                        <LuCheck className="text-[13px]" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-[#102a43]">
                        {t("aiAssistant.step1Title")}
                      </h5>
                      <p className="text-[12px] text-[#627d98] mt-0.5">
                        {t("aiAssistant.step1Desc")}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    onClick={() => toggleStep("step2")}
                    className="p-3.5 rounded-lg border border-[#edf2f7] bg-[#f8fafc] hover:bg-[#f0f4f8] transition-colors flex items-start gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        planSteps.find((s) => s.id === "step2")?.completed
                          ? "bg-[#0f766e] text-white"
                          : "border border-[#cbd5e1] bg-white"
                      }`}
                    >
                      {planSteps.find((s) => s.id === "step2")?.completed && (
                        <LuCheck className="text-[13px]" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-[#102a43]">
                        {t("aiAssistant.step2Title")}
                      </h5>
                      <p className="text-[12px] text-[#627d98] mt-0.5">
                        {t("aiAssistant.step2Desc")}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    onClick={() => toggleStep("step3")}
                    className="p-3.5 rounded-lg border border-[#edf2f7] bg-[#f8fafc] hover:bg-[#f0f4f8] transition-colors flex items-start gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        planSteps.find((s) => s.id === "step3")?.completed
                          ? "bg-[#0f766e] text-white"
                          : "border border-[#cbd5e1] bg-white"
                      }`}
                    >
                      {planSteps.find((s) => s.id === "step3")?.completed && (
                        <LuCheck className="text-[13px]" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-[#102a43]">
                        {t("aiAssistant.step3Title")}
                      </h5>
                      <p className="text-[12px] text-[#627d98] mt-0.5">
                        {t("aiAssistant.step3Desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coach Tip Box */}
              <div className="p-4 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-start gap-3">
                <LuLightbulb className="text-[#15803d] text-[18px] flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[12.5px] font-bold text-[#166534]">
                    {t("aiAssistant.aiTipsTitle")}
                  </h5>
                  <p className="text-[12px] text-[#14532d] mt-0.5 leading-relaxed">
                    {t("aiAssistant.aiTipsContent")}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 bg-[#f8fafc] border-t border-[#edf2f7]">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="px-5 py-2 bg-[#102a43] text-white text-[13px] font-semibold rounded-lg hover:bg-[#243b53] transition-colors cursor-pointer"
              >
                {t("aiAssistant.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
