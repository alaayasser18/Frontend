import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiChevronRight,
} from "react-icons/fi";

import "../../../Styles/auth/Login.css";
import MainAuthForm from "../components/MainAuthForm";

const containerVariants = {
  hidden: {
    opacity: 0,
    x: 40,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function Login() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  /* =========================
     TOGGLE PASSWORD
  ========================= */

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  /* =========================
     LOGIN
  ========================= */

  const handleSignIn = (e) => {
    e.preventDefault();

    /* =========================
       REQUIRED FIELDS
    ========================= */

    if (!email.trim() || !password) {
      toast.error(
        t(
          "auth.login.emailPasswordRequired",
          "Please enter your email and password.",
        ),
      );

      return;
    }

    /* =========================
       CURRENT LANGUAGE
    ========================= */

    // Backend accepts only "ar" or "en"
    const currentLanguage = i18n.language?.startsWith("ar") ? "ar" : "en";

    console.log("=================================");
    console.log("i18n.language:", i18n.language);
    console.log("currentLanguage:", currentLanguage);
    console.log("=================================");
    /* =========================
       LOGIN DATA
    ========================= */

    const loginData = {
      email: email.trim(),
      password,
      lang: currentLanguage,
    };

    console.log("Login data:", loginData);

    /* =========================
       LOGIN REQUEST
    ========================= */

    loginMutation.mutate(loginData, {
      /* =========================
         SUCCESS - 200
      ========================= */

      onSuccess: (data) => {
        console.log("=================================");
        console.log("LOGIN SUCCESS");
        console.log("Login response:", data);
        console.log("=================================");

        const token = data?.data?.access_token;
        const user = data?.data?.user;

        console.log("Token:", token);
        console.log("User:", user);

        /* =========================
           MAKE SURE TOKEN EXISTS
        ========================= */

        if (!token) {
          console.error("Login succeeded but no access token was returned.");

          toast.error(
            t(
              "auth.login.tokenMissing",
              "Login succeeded, but the access token was not received.",
            ),
          );

          return;
        }

        /* =========================
           SAVE TOKEN
        ========================= */

        localStorage.setItem("token", token);

        /* =========================
           SAVE USER
        ========================= */

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        /* =========================
           SAVE LANGUAGE
        ========================= */

        localStorage.setItem("language", currentLanguage);

        /* =========================
           REMEMBER ME
        ========================= */

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        console.log(
          "Token saved:",
          localStorage.getItem("token") ? "YES" : "NO",
        );

        console.log("User saved:", localStorage.getItem("user") ? "YES" : "NO");

        /* =========================
           SUCCESS MESSAGE
        ========================= */

        toast.success(t("auth.login.loginSuccess", "Logged in successfully."));

        /* =========================
           GO TO HOME
        ========================= */

        console.log("Going to Home...");

        navigate("/", {
          replace: true,
        });
      },

      /* =========================
         ERROR
      ========================= */

      onError: (error) => {
        console.log("=================================");
        console.log("LOGIN ERROR");
        console.log("=================================");

        console.log("Login error:", error);
        console.log("Status:", error?.response?.status);
        console.log("Backend response:", error?.response?.data);
        console.log("Validation errors:", error?.response?.data?.errors);

        const status = error?.response?.status;

        const responseData = error?.response?.data;

        const backendMessage = responseData?.message;

        const validationErrors = responseData?.errors;

        /* =========================
           403
           ACCOUNT INACTIVE
        ========================= */

        if (status === 403) {
          toast.error(
            backendMessage ||
              t(
                "auth.login.accountInactive",
                "Your account is inactive. Please activate your account first.",
              ),
          );

          return;
        }

        /* =========================
           422
           VALIDATION / INVALID CREDENTIALS
        ========================= */

        if (status === 422) {
          const emailError = validationErrors?.email?.[0];

          if (emailError) {
            toast.error(emailError);
            return;
          }

          toast.error(
            backendMessage ||
              t(
                "auth.login.invalidCredentials",
                "These credentials do not match our records.",
              ),
          );

          return;
        }

        /* =========================
           429
           TOO MANY REQUESTS
        ========================= */

        if (status === 429) {
          toast.error(
            backendMessage ||
              t(
                "auth.login.tooManyRequests",
                "Too many login attempts. Please try again later.",
              ),
          );

          return;
        }

        /* =========================
           500
           SERVER ERROR
        ========================= */

        if (status === 500) {
          toast.error(
            backendMessage ||
              t(
                "auth.login.serverError",
                "Something went wrong on the server. Please try again later.",
              ),
          );

          return;
        }

        /* =========================
           OTHER BACKEND ERROR
        ========================= */

        if (backendMessage) {
          toast.error(backendMessage);
          return;
        }

        /* =========================
           GENERIC ERROR
        ========================= */

        toast.error(
          t(
            "auth.login.errorGeneric",
            "Something went wrong. Please try again.",
          ),
        );
      },
    });
  };

  /* =========================
     GOOGLE LOGIN
  ========================= */

  const handleGoogleSignIn = () => {
    alert("Google Sign-In clicked!");
  };

  return (
    <MainAuthForm>
      {/* RIGHT SIDE: FORM */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* =========================
            TITLE
        ========================= */}

        <motion.h1 className="title" variants={itemVariants}>
          {t("auth.login.title")}
        </motion.h1>

        {/* =========================
            SUBTITLE
        ========================= */}

        <motion.p className="subtitle" variants={itemVariants}>
          {t("auth.login.noAccount")}{" "}
          <Link to="/register" className="signup-link">
            {t("auth.login.createOne")}
          </Link>
        </motion.p>

        {/* =========================
            FORM
        ========================= */}

        <motion.form onSubmit={handleSignIn} variants={itemVariants}>
          {/* =========================
              EMAIL
          ========================= */}

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="email">{t("auth.login.workEmail")}</label>

            <div className="input-wrapper">
              <FiMail className="input-icon" />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t("auth.login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          {/* =========================
              PASSWORD
          ========================= */}

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="password">{t("auth.login.password")}</label>

            <div className="input-wrapper">
              <FiLock className="input-icon" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder={t("auth.login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="password-toggle"
                type="button"
                onClick={togglePassword}
                aria-label={
                  showPassword
                    ? t("auth.login.hidePassword")
                    : t("auth.login.showPassword")
                }
              >
                {showPassword ? (
                  <FiEyeOff id="eyeIcon" />
                ) : (
                  <FiEye id="eyeIcon" />
                )}
              </button>
            </div>
          </motion.div>

          {/* =========================
              OPTIONS
          ========================= */}

          <motion.div className="form-options" variants={itemVariants}>
            <label className="remember">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <span className="checkbox">{rememberMe && <FiCheck />}</span>

              <span>{t("auth.login.rememberMe")}</span>
            </label>

            <Link to="/ForgotPassword" className="forgot">
              {t("auth.login.forgotPassword")}
            </Link>
          </motion.div>

          {/* =========================
              SIGN IN BUTTON
          ========================= */}

          <motion.button
            type="submit"
            className="sign-in"
            disabled={loginMutation.isPending}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            {loginMutation.isPending
              ? t("auth.login.signingIn", "Signing in...")
              : t("auth.login.signIn")}
          </motion.button>
        </motion.form>

        {/* =========================
            OR SEPARATOR
        ========================= */}

        <motion.div className="separator" variants={itemVariants}>
          <span>{t("auth.login.or")}</span>
        </motion.div>

        {/* =========================
            GOOGLE SIGN IN
        ========================= */}

        <motion.button
          className="quick-signin"
          type="button"
          onClick={handleGoogleSignIn}
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            duration: 0.2,
          }}
          style={{
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31-1.17.78-2.66 1.24-4.21 1.24-3.26 0-6.02-2.2-7.01-5.16H2.18v3.16C3.99 20.53 7.7 23 12 23c2.97 0 5.46-.98 7.28-2.66 1.82-1.68 3.28-4.74 3.28-8.09z"
            />

            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />

            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />

            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>

          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#10243a",
            }}
          >
            {t("auth.login.googleSignIn", "Sign in with Google")}
          </span>

          <FiChevronRight className="arrow" />
        </motion.button>
      </motion.div>
    </MainAuthForm>
  );
}
