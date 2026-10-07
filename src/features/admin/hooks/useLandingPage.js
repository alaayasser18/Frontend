import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLandingSections,
  updateLandingSection,
  getLandingFeatures,
  createLandingFeature,
  updateLandingFeature,
} from "../api";

export const useLandingSections = (lang = "en") =>
  useQuery({
    queryKey: ["landing-sections", lang],
    queryFn: () => getLandingSections(lang),
  });

export const useLandingFeatures = (lang = "en") =>
  useQuery({
    queryKey: ["landing-features", lang],
    queryFn: () => getLandingFeatures(lang),
  });

export const useUpdateLandingSection = (lang = "en") => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, content }) => updateLandingSection(key, content, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landing-sections"] }),
  });
};

export const useCreateLandingFeature = (lang = "en") => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createLandingFeature(payload, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landing-features"] }),
  });
};

export const useUpdateLandingFeature = (lang = "en") => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateLandingFeature(id, payload, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landing-features"] }),
  });
};