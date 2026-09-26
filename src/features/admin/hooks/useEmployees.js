import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../api";

export const useEmployees = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => getEmployees(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

export default useEmployees;
