import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiCheckCircle } from "react-icons/fi";

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const scrollToFeatures = () => {
    const el = document.getElementById("features");

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid" style={{marginTop:'2.5rem'}}>
          {/* =========================
              LEFT COLUMN
          ========================= */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            {/* Eyebrow */}
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
            >
              <span className="eyebrow-dot"></span>
              <span>{t("home.hero.badge")}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              {t("home.hero.titleMain")}{" "}
              <span>{t("home.hero.titleAccent")}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="hero-text"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
              }}
            >
              {t("home.hero.description")}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.55,
              }}
            >
              <Link to="/register" className="button button-primary">
                <span>{t("home.hero.ctaPrimary")}</span>

                <FiArrowRight
                  style={{
                    transform: isRtl ? "rotate(180deg)" : "none",
                  }}
                />
              </Link>

              <button
                onClick={scrollToFeatures}
                className="button button-secondary"
              >
                {t("home.hero.ctaSecondary")}
              </button>
            </motion.div>

            {/* Proof */}
            <motion.div
              className="hero-proof"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.7,
              }}
            >
              <div className="proof-avatars">
                <span>HR</span>
                <span>WW</span>
                <span>AI</span>
              </div>

              <p>
                <strong>10,000+</strong> {t("home.hero.trustedBy")}
              </p>
            </motion.div>
          </motion.div>

          {/* =========================
              RIGHT COLUMN
          ========================= */}

          <motion.div
            className="hero-visual"
            initial={{
              opacity: 0,
              x: 80,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.25,
              ease: "easeOut",
            }}
          >
            <div className="visual-glow"></div>

            {/* Floating Top Badge */}
            <motion.div
              className="floating-card floating-top"
              initial={{
                opacity: 0,
                y: -30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.9,
              }}
            >
              <div className="floating-icon">
                <FiCalendar />
              </div>

              <div>
                <strong>Shift Scheduled</strong>
                <small>Today, 09:00 AM • Main Branch</small>
              </div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              className="preview-shell"
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.45,
                ease: "easeOut",
              }}
            >
              <div className="preview-bar">
                <div className="preview-dots">
                  <span className="preview-dot"></span>
                  <span className="preview-dot"></span>
                  <span className="preview-dot"></span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span className="preview-dot green"></span>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#3F7D5A",
                    }}
                  >
                    {t("home.hero.preview.liveStatus")}
                  </span>
                </div>
              </div>

              <div className="preview-content">
                {/* User Row */}
                <motion.div
                  className="preview-user-row"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.85,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div className="avatar">WW</div>

                    <div>
                      <strong
                        style={{
                          fontSize: "13px",
                          color: "#243B53",
                          display: "block",
                        }}
                      >
                        WorkWise Portal
                      </strong>

                      <span
                        style={{
                          fontSize: "10px",
                          color: "#6B7785",
                        }}
                      >
                        Enterprise Operations
                      </span>
                    </div>
                  </div>

                  <span className="preview-badge-status">Active Q3</span>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="preview-stats-row"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 1,
                  }}
                >
                  <div className="mini-stat">
                    <span>{t("home.hero.preview.attendanceRate")}</span>

                    <strong style={{ color: "#3F7D5A" }}>
                      {t("home.hero.preview.attendanceRateVal")}
                    </strong>
                  </div>

                  <div className="mini-stat">
                    <span>{t("home.hero.preview.activeEmployees")}</span>

                    <strong>{t("home.hero.preview.activeEmployeesVal")}</strong>
                  </div>

                  <div className="mini-stat">
                    <span>{t("home.hero.preview.pendingRequests")}</span>

                    <strong style={{ color: "#C58B2A" }}>
                      {t("home.hero.preview.pendingRequestsVal")}
                    </strong>
                  </div>
                </motion.div>

                {/* Chart */}
                <motion.div
                  className="chart-card"
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 1.1,
                  }}
                >
                  <div className="chart-header">
                    <span>Weekly Workforce Presence</span>

                    <span
                      style={{
                        color: "#5B8C6A",
                      }}
                    >
                      +4.2% this week
                    </span>
                  </div>

                  <div className="chart-lines">
                    <span style={{ height: "45%" }}></span>
                    <span style={{ height: "65%" }}></span>
                    <span style={{ height: "85%" }}></span>
                    <span style={{ height: "60%" }}></span>
                    <span style={{ height: "95%" }}></span>
                    <span style={{ height: "70%" }}></span>
                    <span style={{ height: "90%" }}></span>
                  </div>
                </motion.div>

                {/* AI Insight */}
                <motion.div
                  className="insight-mini"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 1.25,
                  }}
                >
                  <strong>Insight: </strong>
                  {t("home.hero.preview.aiInsightText")}
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Bottom Badge */}
            <motion.div
              className="floating-card floating-bottom"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 1.1,
              }}
            >
              <div className="floating-icon green">
                <FiCheckCircle />
              </div>

              <div>
                <strong>Leave Request Approved</strong>

                <small>Sarah Jenkins • Annual Leave</small>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
