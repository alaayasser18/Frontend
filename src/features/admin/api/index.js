import axiosInstance from "../../../utils/axiosInstance";

// Retrieve all permissions (Owner & HR)
export const getPermissions = async (lang) => {
  const response = await axiosInstance.get("/permissions", {
    params: lang ? { lang } : undefined,
  });
  return response.data;
};

// List all employees (Owner & HR)
export const getEmployees = async (params = {}) => {
  const response = await axiosInstance.get("/employees", {
    params,
  });
  return response.data;
};

// Create a new employee (Owner & HR)
export const createEmployee = async (employeeData, lang) => {
  const response = await axiosInstance.post("/employees", employeeData, {
    params: lang ? { lang } : undefined,
  });
  return response.data;
};
// Get all departments
export const getDepartments = async (params = {}) => {
  const response = await axiosInstance.get("/departments", {
    params,
  });

  return response.data;
};

// =====================================================
// GET PENDING LEAVE REQUESTS
// Owner access is served by the general leave request history endpoint.
// =====================================================
export const getOwnerPendingLeaveRequests = async (lang = "en") => {
  const response = await axiosInstance.get("/leaves/leave-requests", {
    params: { lang, status: "Pending" },
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};
