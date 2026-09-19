import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateDocumentDirection } from "../i18n/config";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = i18n.language && i18n.language.startsWith("ar") ? "ar" : "en";

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    updateDocumentDirection(langCode);
    setIsOpen(false);
  };

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="lang-switcher" ref={dropdownRef}>
      <button
        type="button"
        className="lang-btn"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t("common.selectLanguage")}
      >
        <svg
          className="globe-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        <span className="lang-name">
          {currentLang === "ar" ? "العربية" : "English"}
        </span>

        <svg
          className={`chevron-icon ${isOpen ? "open" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul className="lang-dropdown" role="menu">
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={`lang-option ${currentLang === "en" ? "active" : ""}`}
              onClick={() => handleSelectLanguage("en")}
            >
              <span className="lang-label">English</span>
              {currentLang === "en" && <span className="lang-check">✓</span>}
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={`lang-option ${currentLang === "ar" ? "active" : ""}`}
              onClick={() => handleSelectLanguage("ar")}
            >
              <span className="lang-label">العربية</span>
              {currentLang === "ar" && <span className="lang-check">✓</span>}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
