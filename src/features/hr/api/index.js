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
// =====================================================
export const updateEmployeeHRFields = async (id, employeeData, lang = "en") => {
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
// HR GOALS
// =====================================================

// GET HR COMPANY GOALS
// GET /hr/goals
//
// Supported params:
// status
// department_id
// employee_id
// page
// per_page
export const getHrGoals = async (params = {}, lang = "en") => {
  const response = await axiosInstance.get("/hr/goals", {
    params: {
      ...params,
      lang,
    },
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// CREATE GOAL
// POST /goals
// Owner / HR / Manager
// =====================================================
export const createGoal = async (goalData, lang = "en") => {
  const response = await axiosInstance.post("/goals", goalData, {
    params: {
      lang,
    },
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// UPDATE GOAL
// PUT /goals/{id}
// Owner / HR / Manager
// =====================================================
export const updateGoal = async (id, goalData, lang = "en") => {
  if (!id) {
    throw new Error("Goal ID is required");
  }

  const response = await axiosInstance.put(`/goals/${id}`, goalData, {
    params: {
      lang,
    },
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
  });

  return response.data;
};

// =====================================================
// ALIASES
// =====================================================
export const updateEmployeeHrFields = updateEmployeeHRFields;

// =====================================================
// HR FINANCIALS
// =====================================================

/**
 * GET /api/financial/advances
 * List salary advance requests (HR / Owner / All Roles)
 */
export const getFinancialAdvances = async (params = {}, lang = "en") => {
  const response = await axiosInstance.get("/financial/advances", {
    params,
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
  });

  return response.data;
};

/**
 * PUT /api/financial/advances/{advance}/status
 * Update salary advance request status (HR / Owner)
 * @param {number|string} advanceId
 * @param {string} status 'approved' | 'rejected'
 * @param {string} lang
 */
export const updateAdvanceStatus = async (advanceId, status, lang = "en") => {
  if (!advanceId) {
    throw new Error("Advance ID is required");
  }

  const response = await axiosInstance.put(
    `/financial/advances/${advanceId}/status`,
    { status },
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": lang,
      },
    },
  );

  return response.data;
};

/**
 * GET /api/financial/deductions
 * List deductions and penalties (HR / Owner / All Roles)
 */
export const getFinancialDeductions = async (params = {}, lang = "en") => {
  const response = await axiosInstance.get("/financial/deductions", {
    params,
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
  });

  return response.data;
};

/**
 * GET /api/financial/payroll
 * Calculates or retrieves company payroll for a given month (Owner / HR)
 * @param {Object} params - { month_year, page, per_page }
 * @param {string} lang - 'ar' | 'en'
 */
export const getFinancialPayroll = async (params = {}, lang = "en") => {
  const response = await axiosInstance.get("/financial/payroll", {
    params,
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
  });

  return response.data;
};

/**
 * POST /api/financial/payroll/finalize
 * Finalize and close monthly payroll (Owner / HR)
 * @param {Object} data - { month_year }
 * @param {string} lang - 'ar' | 'en'
 */
export const finalizeFinancialPayroll = async (data = {}, lang = "en") => {
  const response = await axiosInstance.post("/financial/payroll/finalize", data, {
    headers: {
      Accept: "application/json",
      "Accept-Language": lang,
    },
  });

  return response.data;
};

/**
 * GET /api/financial/payroll/{payroll}/payslip
 * Download employee payslip PDF (Owner / HR)
 * @param {number|string} payrollId - Unique ID of finalized payroll record
 * @param {string} lang - 'ar' | 'en'
 */
export const downloadFinancialPayslip = async (payrollId, lang = "en") => {
  if (!payrollId) {
    throw new Error("Payroll ID is required");
  }

  const response = await axiosInstance.get(
    `/financial/payroll/${payrollId}/payslip`,
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
        "Accept-Language": lang,
      },
    },
  );

  return response;
};

