import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getEmployees, createEmployee, updateEmployeeHrFields } from "../api";

// =====================================================
// GET EMPLOYEES
// =====================================================
export const useEmployees = (params = {}, lang = "en") => {
  return useQuery({
    queryKey: ["employees", params, lang],

    queryFn: () =>
      getEmployees({
        ...params,
        lang,
      }),

    placeholderData: (previousData) => previousData,

    staleTime: 30 * 1000,

    retry: 2,
  });
};

// =====================================================
// CREATE EMPLOYEE
// =====================================================
export const useCreateEmployee = (lang = "en") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeData) => createEmployee(employeeData, lang),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};

// =====================================================
// UPDATE EMPLOYEE HR FIELDS
// =====================================================
export const useUpdateEmployeeHrFields = (lang = "en") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hrData }) => updateEmployeeHrFields(id, hrData, lang),

    onSuccess: (data, variables) => {
      // Invalidate employees list to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      // Optionally invalidate specific employee query if it exists
      queryClient.invalidateQueries({
        queryKey: ["employee", variables.id],
      });
    },
  });
};
