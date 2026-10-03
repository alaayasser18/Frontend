import axiosInstance from "../../../utils/axiosInstance";

/* =========================================================
   GOALS
========================================================= */

/**
 * GET /api/goals
 * List Own Goals (Employee)
 */
export const getGoals = async (params = {}, lang = "en") => {
  const response = await axiosInstance.get("/goals", {
    params,
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

/**
 * GET /api/goals/{id}
 * View Own Goal Details (Employee)
 */
export const getGoalDetails = async (id, lang = "en") => {
  const response = await axiosInstance.get(`/goals/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

/**
 * PATCH /api/goals/{id}/complete
 * Mark Own Goal as Completed (Employee)
 */
export const markGoalCompleted = async (id, lang = "en") => {
  const response = await axiosInstance.patch(`/goals/${id}/complete`, null, {
    headers: {
      "Accept-Language": lang,
    },
  });

  return response.data;
};

/* =========================================================
   EMPLOYEES
========================================================= */

/**
 * GET /api/employees/{id}
 * Get Employee By ID
 */
export const getEmployeeById = async (id, lang = "en") => {
  if (!id) {
    throw new Error("Employee ID is required");
  }

  const response = await axiosInstance.get(`/employees/${id}`, {
    params: {
      lang,
    },
  });

  return response.data.data;
};