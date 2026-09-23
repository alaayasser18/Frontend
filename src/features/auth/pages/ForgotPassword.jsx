import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { FiMail } from "react-icons/fi";

import { toast } from "react-hot-toast";

import MainAuthForm from "../components/MainAuthForm";

import { useForgotPassword } from "../hooks/useForgotPassword";

import "../../../styles/auth/ForgotPassword.css";

export default function ForgotPassword() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPassword();

  const [email, setEmail] = useState("");

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // =====================================================
    // FRONTEND VALIDATION
    // =====================================================

    if (!trimmedEmail) {
      toast.error(t("auth.forgotPassword.emailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error(t("auth.forgotPassword.invalidEmail"));
      return;
    }

    // =====================================================
    // REQUEST DATA
    // =====================================================

    /*
      Swagger:

      POST /api/auth/forget-password

      Body:
      {
        "email": "john@example.com"
      }

      هذا الـ endpoint لا يحتوي على lang
    */

    const forgotPasswordData = {
      email: trimmedEmail,
    };

    console.log("=================================");
    console.log("Forgot Password");
    console.log("Forgot Password data:", forgotPasswordData);
    console.log("=================================");

    // =====================================================
    // SEND REQUEST
    // =====================================================

    forgotPasswordMutation.mutate(forgotPasswordData, {
      // ===================================================
      // SUCCESS
      // ===================================================

      onSuccess: (data) => {
        console.log("=================================");
        console.log("FORGOT PASSWORD SUCCESS");
        console.log("Forgot Password response:", data);
        console.log("=================================");

        /*
          Expected backend response:

          {
            success: true,
            message: "OTP sent successfully.",
            data: {
              email: "john@example.com"
            }
          }
        */

        const returnedEmail = data?.data?.email || trimmedEmail;

        // =================================================
        // SAVE EMAIL
        // =================================================

        sessionStorage.setItem("resetEmail", returnedEmail);

        console.log("Reset email saved:", sessionStorage.getItem("resetEmail"));

        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        toast.success(t("auth.forgotPassword.otpSent"));

        // =================================================
        // GO TO VERIFY OTP
        // =================================================

        navigate("/VerifyOTP");
      },

      // ===================================================
      // ERROR
      // ===================================================

      onError: (error) => {
        console.log("=================================");
        console.log("FORGOT PASSWORD ERROR");
        console.log("Error:", error);
        console.log("Status:", error?.response?.status);
        console.log("Backend response:", error?.response?.data);
        console.log("=================================");

        const status = error?.response?.status;

        const responseData = error?.response?.data;

        const backendMessage = responseData?.message;

        // =================================================
        // 422 VALIDATION
        // =================================================

        if (status === 422) {
          sessionStorage.removeItem("resetEmail");

          // نستخدم ترجمة الـ frontend بدل رسالة الـ backend
          toast.error(t("auth.forgotPassword.emailNotFound"));

          // الرجوع إلى Login بعد ظهور الرسالة
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 1500);

          return;
        }

        // =================================================
        // 429 TOO MANY REQUESTS
        // =================================================

        if (status === 429) {
          toast.error(
            backendMessage || t("auth.forgotPassword.tooManyRequests"),
          );

          return;
        }

        // =================================================
        // OTHER BACKEND ERROR
        // =================================================

        if (backendMessage) {
          toast.error(backendMessage);
          return;
        }

        // =================================================
        // GENERIC ERROR
        // =================================================

        toast.error(t("auth.forgotPassword.errorGeneric"));
      },
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <MainAuthForm>
      <div className="forgot-password-card">
        {/* =================================================
            TITLE
        ================================================= */}

        <h1 className="title">{t("auth.forgotPassword.title")}</h1>

        {/* =================================================
            SUBTITLE
        ================================================= */}

        <p className="subtitle">{t("auth.forgotPassword.subtitle")}</p>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t("auth.forgotPassword.workEmail")}</label>

            <div className="input-wrapper">
              <FiMail className="input-icon" />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t("auth.forgotPassword.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={forgotPasswordMutation.isPending}
              />
            </div>
          </div>

          {/* =================================================
              SEND CODE BUTTON
          ================================================= */}

          <button
            type="submit"
            className="sign-in"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending
              ? t("auth.forgotPassword.sending")
              : t("auth.forgotPassword.sendCode")}
          </button>
        </form>

        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <Link to="/login" className="back-to-login">
          {t("auth.forgotPassword.backToSignIn")}
        </Link>
      </div>
    </MainAuthForm>
  );
}
