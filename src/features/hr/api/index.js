
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

// =====================================================
// GET HR DAILY ATTENDANCE
// GET /hr/attendance/daily
// HR / Owner only
// =====================================================
export const getHrDailyAttendance = async ({
  date,
  departmentId,
  managerId,
  status,
  search,
  perPage = 15,
  page = 1,
}) => {
  const response = await axiosInstance.get("/hr/attendance/daily", {
    params: {
      date,
      department_id: departmentId,
      manager_id: managerId,
      status,
      search,
      per_page: perPage,
      page,
    },
  });

  return response.data;
};

// =====================================================
// GET HR ATTENDANCE EXCEPTIONS
// GET /hr/attendance/exceptions
// HR / Owner only
// =====================================================
export const getHrAttendanceExceptions = async ({
  date,
  departmentId,
  perPage = 15,
  page = 1,
}) => {
  const response = await axiosInstance.get(
    "/hr/attendance/exceptions",
    {
      params: {
        date,
        department_id: departmentId,
        per_page: perPage,
        page,
      },
    },
  );

  return response.data;
};

// =====================================================
// GET HR MONTHLY ATTENDANCE SUMMARY
// GET /hr/attendance/monthly-summary
// HR / Owner only
// =====================================================
export const getHrMonthlySummary = async ({
  month,
  year,
  departmentId,
  search,
  perPage = 15,
  page = 1,
}) => {
  const response = await axiosInstance.get(
    "/hr/attendance/monthly-summary",
    {
      params: {
        month,
        year,
        department_id: departmentId || undefined,
        search: search || undefined,
        per_page: perPage,
        page,
      },
    },
  );

  return response.data;
};

// =====================================================
// EXPORT HR MONTHLY ATTENDANCE SUMMARY (Excel)
// GET /hr/attendance/export
// HR / Owner only
// Returns a binary Excel file — triggers download
// =====================================================
export const exportHrMonthlySummary = async ({
  month,
  year,
  departmentId,
  search,
  perPage,
}) => {
  const response = await axiosInstance.get(
    "/hr/attendance/export",
    {
      params: {
        month,
        year,
        department_id: departmentId || undefined,
        search: search || undefined,
        per_page: perPage || undefined,
      },
      responseType: "blob",
    },
  );

  // Build a filename from Content-Disposition or a default
  const disposition = response.headers?.["content-disposition"] || "";
  let filename = `attendance-${year}-${String(month).padStart(2, "0")}.xlsx`;

  const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]+)\1/);
  if (match?.[2]) {
    filename = match[2].trim();
  }

  // Trigger browser download
  const url = URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return { success: true, filename };
};

// =====================================================
// UPDATE ATTENDANCE EXCEPTION STATUS
// PATCH /hr/attendance/exceptions/{attendanceId}
// HR / Owner only
// Body: { status: "approved" | "rejected", admin_note?: string }
// =====================================================
export const updateAttendanceExceptionStatus = async ({
  attendanceId,
  status,
  adminNote,
}) => {
  const response = await axiosInstance.patch(
    `/hr/attendance/exceptions/${attendanceId}`,
    {
      status,
      ...(adminNote ? { admin_note: adminNote } : {}),
    },
  );

  return response.data;
};