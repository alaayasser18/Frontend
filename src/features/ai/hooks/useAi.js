import { useMutation } from "@tanstack/react-query";
import {
  generateCareerCoach,
  generatePerformanceInsight,
  generateSkillGap,
  askPolicyAssistant,
  generateEvaluationDraft,
  generateAttentionSignal,
  generateTeamInsight,
} from "../api";

// "Generate" actions (POST) -> useMutation. Nothing runs until the user clicks.
const makeAiHook = (fn) => (lang = "en") =>
  useMutation({ mutationFn: (body) => fn(body, lang) });

export const useCareerCoach = makeAiHook(generateCareerCoach);
export const usePerformanceInsight = makeAiHook(generatePerformanceInsight);
export const useSkillGap = makeAiHook(generateSkillGap);
export const usePolicyAssistant = makeAiHook(askPolicyAssistant);
export const useEvaluationDraft = makeAiHook(generateEvaluationDraft);
export const useAttentionSignal = makeAiHook(generateAttentionSignal);
export const useTeamInsight = makeAiHook(generateTeamInsight);