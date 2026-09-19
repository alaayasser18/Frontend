import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiArrowRight,
  FiChevronRight,
  FiTrendingUp,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { motion } from "framer-motion";

export default function RolesSection() {
  const { t } = useTranslation();

  const chartBars = [
    { height: "44%", type: "bar-green" },
    { height: "64%", type: "bar-green" },
    { height: "54%", type: "bar-green" },
    { height: "82%", type: "bar-navy" },
    { height: "72%", type: "bar-green" },
    { height: "95%", type: "bar-navy" },
  ];

  const roleCards = [
    {
      num: "01",
      label: t("home.roles.cards.hr.label"),
      className: "role-1",
      title: t("home.roles.cards.hr.title"),
      desc: t("home.roles.cards.hr.desc"),
      points: t("home.roles.cards.hr.points", { returnObjects: true }),
    },
    {
      num: "02",
      label: t("home.roles.cards.employee.label"),
      className: "role-2",
      title: t("home.roles.cards.employee.title"),
      desc: t("home.roles.cards.employee.desc"),
      points: t("home.roles.cards.employee.points", {
        returnObjects: true,
      }),
    },
    {
      num: "03",
      label: t("home.roles.cards.manager.label"),
      className: "role-3",
      title: t("home.roles.cards.manager.title"),
      desc: t("home.roles.cards.manager.desc"),
      points: t("home.roles.cards.manager.points", {
        returnObjects: true,
      }),
    },
  ];
  /* =========================
     ANIMATION VARIANTS
  ========================= */

  const headingVariants = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="roles" className="section">
      <div className="container">
        {/* =========================
            SECTION HEADING
        ========================= */}

        <motion.div
          className="center-heading"
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
        >
          <motion.div
            className="section-kicker"
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            viewport={{
              once: true,
            }}
          >
            <span className="eyebrow-dot"></span>
            <span>{t("home.roles.badge")}</span>
          </motion.div>

          <h2>{t("home.roles.title")}</h2>

          <p>{t("home.roles.subtitle")}</p>
        </motion.div>

        {/* =========================
            ROLES GRID
        ========================= */}

        <motion.div
          className="roles-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {roleCards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`role-card ${card.className}`}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              <div>
                {/* Role Number */}

                <motion.span
                  className="role-number"
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.2 + idx * 0.1,
                    duration: 0.35,
                  }}
                  whileHover={{
                    scale: 1.1,
                  }}
                  viewport={{
                    once: true,
                  }}
                >
                  {card.num}
                </motion.span>

                {/* Role Label */}

                <motion.span
                  className="role-label"
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.25 + idx * 0.1,
                    duration: 0.3,
                  }}
                  viewport={{
                    once: true,
                  }}
                >
                  {card.label}
                </motion.span>

                {/* Title */}

                <h3>{card.title}</h3>

                {/* Description */}

                <p>{card.desc}</p>
              </div>

              {/* =========================
                  ROLE FEATURES
              ========================= */}

              <ul>
                {card.points.map((pt, pIdx) => (
                  <motion.li
                    key={pIdx}
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.3 + pIdx * 0.08,
                      duration: 0.3,
                    }}
                    viewport={{
                      once: true,
                    }}
                  >
                    <motion.span
                      whileHover={{
                        scale: 1.2,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                    >
                      <FiCheck />
                    </motion.span>

                    <span>{pt}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* =========================
            AI INSIGHTS BANNER
        ========================= */}
        <motion.div
          className="roles-ai-banner"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Left: Text & CTA */}
          <div className="roles-ai-content">
            <motion.div
              className="roles-ai-kicker"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {t("home.roles.aiBanner.kicker")}
            </motion.div>

            <motion.h3
              className="roles-ai-title"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("home.roles.aiBanner.titlePart1")}
              <span>{t("home.roles.aiBanner.titleHighlight")}</span>
            </motion.h3>

            <motion.p
              className="roles-ai-desc"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {t("home.roles.aiBanner.desc")}
            </motion.p>

            <motion.a
              href="#features"
              className="roles-ai-link"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span>{t("home.roles.aiBanner.cta")}</span>
              <FiArrowRight className="roles-ai-arrow" />
            </motion.a>
          </div>

          {/* Right: AI Insights Card */}
          <motion.div
            className="roles-ai-card-wrapper"
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <div className="roles-ai-card">
              {/* Card Header */}
              <div className="roles-ai-card-header">
                <div className="roles-ai-card-badge">
                  <LuSparkles />
                  <span>{t("home.roles.aiBanner.cardTitle")}</span>
                </div>
                <span className="roles-ai-card-updated">
                  {t("home.roles.aiBanner.cardUpdated")}
                </span>
              </div>

              {/* Card Body */}
              <div className="roles-ai-card-body">
                <div className="roles-ai-metric">
                  <span className="roles-ai-score-label">
                    {t("home.roles.aiBanner.scoreLabel")}
                  </span>
                  <div className="roles-ai-score-value">
                    <span className="roles-ai-score-number">86</span>
                    <span className="roles-ai-score-total">
                      {t("home.roles.aiBanner.scoreMax")}
                    </span>
                  </div>
                  <div className="roles-ai-score-trend">
                    <FiTrendingUp className="roles-ai-trend-icon" />
                    <span>{t("home.roles.aiBanner.trend")}</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="roles-ai-chart">
                  <div className="roles-ai-grid-lines">
                    <div className="roles-ai-grid-line" />
                    <div className="roles-ai-grid-line" />
                    <div className="roles-ai-grid-line" />
                  </div>
                  <div className="roles-ai-bars">
                    {chartBars.map((bar, bIdx) => (
                      <motion.div
                        key={bIdx}
                        className={`roles-ai-bar ${bar.type}`}
                        style={{ height: bar.height }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2 + bIdx * 0.08,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Notification Pill */}
              <motion.div
                className="roles-ai-notice"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="roles-ai-notice-left">
                  <div className="roles-ai-notice-icon">
                    <LuSparkles />
                  </div>
                  <div className="roles-ai-notice-text">
                    <div className="roles-ai-notice-title">
                      {t("home.roles.aiBanner.noticeTitle")}
                    </div>
                    <p className="roles-ai-notice-desc">
                      {t("home.roles.aiBanner.noticeDesc")}
                    </p>
                  </div>
                </div>
                <FiChevronRight className="roles-ai-notice-chevron" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
