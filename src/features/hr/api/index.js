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
// Supports Arabic / English
// =====================================================
export const updateEmployeeHrFields = async (id, hrData, lang = "en") => {
  const response = await axiosInstance.patch(`/employees/${id}/hr-fields`, hrData, {
    params: { lang },
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};
