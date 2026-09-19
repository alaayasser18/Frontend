import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import "../../../styles/auth/ForgotPassword.css";
import MainAuthForm from "../components/mainAuthForm";
import { useForgotPassword } from "../hooks/useForgotPassword";
export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const forgotPasswordMutation = useForgotPassword();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    forgotPasswordMutation.mutate(
      {
        email,
      },
      {
        onSuccess: (data) => {
          console.log("Forgot Password response:", data);

          toast.success("OTP sent successfully!");

          setTimeout(() => {
            navigate("/VerifyOTP");
          }, 1000);
        },

        onError: (error) => {
          console.log("Forgot Password error:", error);

          toast.error(
            error?.response?.data?.message ||
              "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  return (
    <MainAuthForm>
      <h1 className="title">{t("auth.forgotPassword.title")}</h1>

      <p className="subtitle">{t("auth.forgotPassword.subtitle")}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{t("auth.forgotPassword.workEmail")}</label>

          <div className="input-wrapper">
            <FiMail className="input-icon" />

            <input
              id="email"
              type="email"
              placeholder={t("auth.forgotPassword.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="sign-in"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending
            ? "Sending..."
            : t("auth.forgotPassword.sendCode")}
        </button>
      </form>
    </MainAuthForm>
  );
}
