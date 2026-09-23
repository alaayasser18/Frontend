import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import "../../../styles/auth/VerifyOTP.css";
import MainAuthForm from "../components/MainAuthForm";

import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendOTP } from "../hooks/useResendOTP";

export default function VerifyOTP() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  const verifyOTPMutation = useVerifyEmail();

  const resendOTPMutation = useResendOTP();

  // Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP input
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    // Get email saved from Forgot Password page
    const email = sessionStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Email not found. Please request a new OTP.");

      navigate("/ForgotPassword");

      return;
    }

    verifyOTPMutation.mutate(
      {
        email: email,
        otp: otpValue,
      },
      {
        onSuccess: (data) => {
          console.log("Verify OTP response:", data);

          const resetToken = data?.data?.reset_token;

          if (!resetToken) {
            toast.error("Reset token was not received.");

            return;
          }

          // Save reset token for Reset Password page
          sessionStorage.setItem("resetToken", resetToken);

          toast.success(data?.message || "Email verified successfully!");

          setTimeout(() => {
            navigate("/ResetPassword");
          }, 1000);
        },

        onError: (error) => {
          console.log("Verify OTP error:", error);

          toast.error(
            error?.response?.data?.message ||
              "Invalid verification code. Please try again.",
          );
        },
      },
    );
  };

  // Resend OTP
  const handleResend = () => {
    const email = sessionStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Email not found. Please request a new OTP.");

      navigate("/ForgotPassword");

      return;
    }

    resendOTPMutation.mutate(
      {
        email: email,
      },
      {
        onSuccess: (data) => {
          console.log("Resend OTP response:", data);

          setOtp(["", "", "", "", "", ""]);

          setTimer(60);

          inputRefs.current[0]?.focus();

          toast.success(data?.message || "OTP resent successfully.");
        },

        onError: (error) => {
          console.log("Resend OTP error:", error);

          toast.error(
            error?.response?.data?.message ||
              "Unable to resend OTP. Please try again.",
          );
        },
      },
    );
  };

  return (
    <MainAuthForm>
      <h1 className="title">{t("auth.verifyOtp.title")}</h1>

      <p className="subtitle">{t("auth.verifyOtp.subtitle")}</p>

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label>{t("auth.verifyOtp.codeLabel")}</label>

          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="sign-in"
          disabled={verifyOTPMutation.isPending}
        >
          {verifyOTPMutation.isPending
            ? "Verifying..."
            : t("auth.verifyOtp.verifyButton")}
        </button>
      </form>

      <div className="resend-code">
        {timer > 0 ? (
          <span>
            {t("auth.verifyOtp.resendPrompt")}{" "}
            <strong>
              {t("auth.verifyOtp.resendIn", {
                time: `00:${timer.toString().padStart(2, "0")}`,
              })}
            </strong>
          </span>
        ) : (
          <>
            <span>{t("auth.verifyOtp.didntReceive")}</span>

            <button
              type="button"
              className="verify-btn"
              onClick={handleResend}
              disabled={resendOTPMutation.isPending}
            >
              {resendOTPMutation.isPending
                ? "Sending..."
                : t("auth.verifyOtp.resend")}
            </button>
          </>
        )}
      </div>

      <div className="back-login">
        <a href="/login">{t("auth.verifyOtp.backToSignIn")}</a>
      </div>
    </MainAuthForm>
  );
}
