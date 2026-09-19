import { useTranslation } from "react-i18next";
import "../../../Styles/auth/Login.css";
import logo from "../../../assets/Logos.svg";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

const MainAuthForm = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="login-page-container">
      <div className="auth-language-switcher-wrapper">
        <LanguageSwitcher />
      </div>

      <div className="login-wrapper">
        {/* LEFT SIDE: BRANDING */}

        <div className="hero-side">
          <div className="brand">
            <div className="brand-logo">
              <img
                src={logo}
                alt="Logo"
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            </div>

            <div>
              <div className="brand-name">{t("auth.branding.name")}</div>

              <div className="brand-subtitle">{t("auth.branding.subtitle")}</div>
            </div>
          </div>

          <div className="hero-body">
            <h2>{t("auth.branding.heroTitle")}</h2>

            <p>{t("auth.branding.heroDescription")}</p>
          </div>

          <div className="security-badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
              <path d="M9.5 12l1.7 1.7 3.4-3.4" />
            </svg>

            <span>{t("auth.branding.securityBadge")}</span>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <main className="form-side">{children}</main>
      </div>
    </div>
  );
};

export default MainAuthForm;
