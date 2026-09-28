import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../../../assets/logo.jpeg";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { APP_NAME, BRAND_NAME } from "../../../utils/global";
import { useAuth } from "../../../context/AuthContext";

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, role, ROLE_ROUTES } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      const sections = [
        "home",
        "about",
        "features",
        "roles",
        "plans",
        "contact",
      ];

      const scrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);

        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const navLinks = [
    { id: "home", label: t("home.nav.home") },
    { id: "about", label: t("home.nav.about") },
    { id: "features", label: t("home.nav.features") },
    { id: "roles", label: t("home.nav.roles") },
    { id: "plans", label: t("home.nav.plans") },
  ];

  /* =========================
     ANIMATION VARIANTS
  ========================= */

  const navbarVariants = {
    hidden: {
      y: -80,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const brandVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  const navContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.08,
      },
    },
  };

  const navItemVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
      },
    },
  };

  const actionsVariants = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.4,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        duration: 0.25,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.header
      className={`site-header ${scrolled ? "scrolled" : ""}`}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      style={{
        border: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 999999,
      }}
    >
      <div className="container">
        <nav className="nav">
          {/* =========================
              BRAND
          ========================= */}

          <motion.a
            href="#home"
            className="brand"
            variants={brandVariants}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            whileHover={{
              scale: 1.03,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <motion.img
              src={logoImg}
              alt={APP_NAME}
              className="brand-logo-img"
              whileHover={{
                rotate: 3,
                scale: 1.05,
              }}
              transition={{
                duration: 0.25,
              }}
            />

            <span>
              {BRAND_NAME.prefix}
              <span style={{ color: BRAND_NAME.suffixColor }}>{BRAND_NAME.suffix}</span>
            </span>
          </motion.a>

          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}

          <motion.ul
            className="nav-links"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.li key={link.id} variants={navItemVariants}>
                <motion.a
                  href={`#${link.id}`}
                  className={activeSection === link.id ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  {link.label}
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>

          {/* =========================
              ACTIONS
          ========================= */}

          <motion.div
            className="nav-actions"
            variants={actionsVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <LanguageSwitcher />
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <Link
                to={isAuthenticated && role ? ROLE_ROUTES[role] || "/admin/dashboard" : "/login"}
                className="button button-primary"
              >
                {isAuthenticated
                  ? t("home.nav.dashboard", "Dashboard")
                  : t("home.nav.signIn")}
              </Link>
            </motion.div>
          </motion.div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================= */}

          <motion.button
            className="menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
            whileTap={{
              scale: 0.9,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? "close" : "menu"}
                initial={{
                  opacity: 0,
                  rotate: -90,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: 90,
                  scale: 0.7,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>

      {/* =========================
          MOBILE NAV DRAWER
      ========================= */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-nav open"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                className={activeSection === link.id ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.25,
                }}
                whileHover={{
                  x: 5,
                }}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              className="mobile-nav-bottom"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.3,
              }}
            >
              <LanguageSwitcher />

              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  to={isAuthenticated && role ? ROLE_ROUTES[role] || "/admin/dashboard" : "/login"}
                  className="button button-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAuthenticated
                    ? t("home.nav.dashboard", "Dashboard")
                    : t("home.nav.signIn")}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
