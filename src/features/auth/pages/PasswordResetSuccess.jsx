import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainAuthForm from "../components/mainAuthForm";
import "../../../styles/auth/PasswordResetSuccess.css";

const PasswordResetSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MainAuthForm>
      <div className="password-success-card">
        <div className="success-icon">✓</div>

        <h1>{t("auth.passwordResetSuccess.title")}</h1>

        <p>
          {t("auth.passwordResetSuccess.description")}
        </p>

        <button className="success-button" onClick={() => navigate("/login")}>
          {t("auth.passwordResetSuccess.signInButton")}
        </button>
      </div>
    </MainAuthForm>
  );
};

export default PasswordResetSuccess;
