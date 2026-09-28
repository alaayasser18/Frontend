
import axiosInstance from "../../../utils/axiosInstance";

// =====================================================
// GET EMPLOYEES
// Supports Arabic / English
// =====================================================
export const getEmployees = async (params = {}) => {
  const response = await axiosInstance.get("/employees", {
    params,
  });

  return response.data;
};

// =====================================================
// CREATE EMPLOYEE
// Supports Arabic / English
// =====================================================
export const createEmployee = async (employeeData, lang = "en") => {
  const response = await axiosInstance.post("/employees", employeeData, {
    params: { lang },
  });

  return response.data;
};

// =====================================================
// GET PERMISSIONS
// Supports Arabic / English
// =====================================================
export const getPermissions = async (lang = "en") => {
  const response = await axiosInstance.get("/permissions", {
    params: { lang },
  });

  return response.data;
};

// =====================================================
// UPDATE EMPLOYEE HR FIELDS
// PATCH /employees/{id}/hr-fields
// Owner / HR only
// =====================================================
export const updateEmployeeHRFields = async (
  id,
  employeeData,
  lang = "en",
) => {
  const response = await axiosInstance.patch(
    `/employees/${id}/hr-fields`,
    employeeData,
    {
      params: { lang },
      headers: {
        "Accept-Language": lang,
      },
    },
  );

  return response.data;
};

// =====================================================
// CHANGE EMPLOYEE ACCOUNT STATUS
// PATCH /employees/{id}/change-account-status
// Owner / HR only
// No request body
// =====================================================
export const changeEmployeeAccountStatus = async (id, lang = "en") => {
  const response = await axiosInstance.patch(
    `/employees/${id}/change-account-status`,
    null,
    {
      params: { lang },
      headers: {
        "Accept-Language": lang,
      },
    },
  );

  return response.data;
};

// =====================================================
// GET EMPLOYEE BY ID
// GET /employees/{id}
// Allowed for all roles
// =====================================================
export const getEmployeeById = async (id, lang = "en") => {
  if (!id) {
    throw new Error("Employee ID is required");
  }

  const response = await axiosInstance.get(`/employees/${id}`, {
    params: { lang },
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data?.data || response.data;
};

// Aliases for compatibility
export const updateEmployeeHrFields = updateEmployeeHRFields;

