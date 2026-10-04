import axiosInstance from "../../../utils/axiosInstance";

// =====================================================
// GET EMPLOYEES
// Supports Arabic / English
// =====================================================
export const getEmployees = async (params = {}) => {
  const { lang, ...filters } = params;
  const response = await axiosInstance.get("/employees", {
    params: filters,
    headers: lang ? { "Accept-Language": lang } : undefined,
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
    headers: {
      "Accept-Language": lang,
    },
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
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// UPDATE EMPLOYEE HR FIELDS
// PATCH /employees/{id}/hr-fields
// Owner / HR only
// =====================================================
export const updateEmployeeHRFields = async (id, employeeData, lang = "en") => {
  const response = await axiosInstance.patch(
    `/employees/${id}/hr-fields`,
    employeeData,
    {
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
    undefined,
    {
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

// =====================================================
// ALIASES FOR COMPATIBILITY
// =====================================================
export const updateEmployeeHrFields = updateEmployeeHRFields;

// =====================================================
// GET DEPARTMENTS
// Supports Arabic / English
// =====================================================
export const getDepartments = async (lang = "en", params = {}) => {
  const response = await axiosInstance.get("/departments", {
    params,
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// CREATE DEPARTMENT
// =====================================================
export const createDepartment = async (departmentData, lang = "en") => {
  const response = await axiosInstance.post("/departments", departmentData, {
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// GET DEPARTMENT MANAGERS
// =====================================================
export const getDepartmentManagers = async (lang = "en") => {
  const response = await axiosInstance.get("/departments/managers-dropdown", {
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// GET HR PENDING LEAVE REQUESTS
// =====================================================
export const getHrPendingLeaveRequests = async (lang = "en") => {
  const response = await axiosInstance.get("/leaves/leave-requests/hr/pending", {
    params: { lang },
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// APPROVE LEAVE REQUEST
// =====================================================
export const approveLeaveRequest = async (id, lang = "en") => {
  const response = await axiosInstance.patch(
    `/leaves/leave-requests/${id}/approve`,
    undefined,
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
// REJECT LEAVE REQUEST
// =====================================================
export const rejectLeaveRequest = async (id, rejectionReason, lang = "en") => {
  const response = await axiosInstance.patch(
    `/leaves/leave-requests/${id}/reject`,
    { rejection_reason: rejectionReason },
    {
      params: { lang },
      headers: {
        "Accept-Language": lang,
      },
    },
  );

  return response.data;
};
