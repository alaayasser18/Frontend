import axiosInstance from "../../../utils/axiosInstance";

// =====================================================
// PERMISSIONS
// =====================================================

// Retrieve all permissions (Owner & HR)
export const getPermissions = async (lang) => {
  const response = await axiosInstance.get("/permissions", {
    params: lang ? { lang } : undefined,
  });
  return response.data;
};

// =====================================================
// EMPLOYEES
// =====================================================

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

// =====================================================
// DEPARTMENTS
// =====================================================

// Get all departments
export const getDepartments = async (params = {}) => {
  const response = await axiosInstance.get("/departments", {
    params,
  });
  return response.data;
};

// =====================================================
// GOALS
// =====================================================

// List goals (supports page, per_page, status, employee_id, department_id)
// List company goals overview (HR)
export const getGoals = async (params = {}, lang) => {
  const response = await axiosInstance.get("/hr/goals", {
    params: lang ? { ...params, lang } : params,
  });
  return response.data;
};

// Create a new goal
export const createGoal = async (goalData, lang) => {
  const response = await axiosInstance.post("/goals", goalData, {
    params: lang ? { lang } : undefined,
  });
  return response.data;
};

// Update an existing goal
export const updateGoal = async (id, goalData, lang) => {
  const response = await axiosInstance.put(`/goals/${id}`, goalData, {
    params: lang ? { lang } : undefined,
  });
  return response.data;
};
