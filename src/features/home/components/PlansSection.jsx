import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PlansSection() {
  const { t } = useTranslation();

  const planTiers = [
    {
      key: "basic",
      name: t("home.plans.basic.name"),
      audience: "For teams getting started",
      price: t("home.plans.basic.price"),
      userPeriod: t("home.plans.basic.userPeriod"),
      desc: t("home.plans.basic.desc"),
      features: t("home.plans.basic.features", { returnObjects: true }) || [],
      featured: false,
      btnClass: "button-secondary",
      btnText: t("home.plans.getStarted"),
    },
    {
      key: "pro",
      name: t("home.plans.pro.name"),
      audience: "For growing organizations",
      price: t("home.plans.pro.price"),
      userPeriod: t("home.plans.pro.userPeriod"),
      desc: t("home.plans.pro.desc"),
      features: t("home.plans.pro.features", { returnObjects: true }) || [],
      featured: true,
      btnClass: "button-primary",
      btnText: t("home.plans.getStarted"),
    },
    {
      key: "enterprise",
      name: t("home.plans.enterprise.name"),
      audience: "For large enterprise teams",
      price: t("home.plans.enterprise.price"),
      userPeriod: t("home.plans.enterprise.userPeriod"),
      desc: t("home.plans.enterprise.desc"),
      features:
        t("home.plans.enterprise.features", { returnObjects: true }) || [],
      featured: false,
      btnClass: "button-secondary",
      btnText: t("home.plans.contactSales"),
    },
  ];

  /* =========================
     ANIMATION VARIANTS
  ========================= */

  const headingVariants = {
    hidden: {
      opacity: 0,
      y: 30,
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

  const cardContainerVariants = {
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
    <section id="plans" className="plans-section section">
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
            <span>{t("home.plans.badge")}</span>
          </motion.div>

          <h2>{t("home.plans.title")}</h2>

          <p>{t("home.plans.subtitle")}</p>
        </motion.div>

        {/* =========================
            PLANS GRID
        ========================= */}

        <motion.div
          className="plans-grid"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {planTiers.map((plan) => (
            <motion.div
              key={plan.key}
              className={`plan-card ${plan.featured ? "plan-featured" : ""}`}
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
              {/* Recommended Badge */}

              {plan.featured && (
                <motion.div
                  className="recommended"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.35,
                    duration: 0.3,
                  }}
                  viewport={{
                    once: true,
                  }}
                >
                  {t("home.plans.recommendedBadge")}
                </motion.div>
              )}

              {/* Plan Top */}

              <div className="plan-top">
                <div className="plan-name">{plan.name}</div>

                <div className="plan-audience">{plan.audience}</div>

                <motion.div
                  className="plan-price"
                  whileHover={{
                    scale: 1.03,
                  }}
                >
                  <strong>{plan.price}</strong>
                  <span>{plan.userPeriod}</span>
                </motion.div>

                <p className="plan-copy">{plan.desc}</p>
              </div>

              {/* Features */}

              <ul>
                {Array.isArray(plan.features) &&
                  plan.features.map((feat, idx) => (
                    <motion.li
                      key={idx}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.2 + idx * 0.05,
                        duration: 0.25,
                      }}
                      viewport={{
                        once: true,
                      }}
                    >
                      <motion.span
                        whileHover={{
                          scale: 1.15,
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                      >
                        <FiCheck />
                      </motion.span>

                      <span>{feat}</span>
                    </motion.li>
                  ))}
              </ul>

              {/* Button */}

              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <Link
                  to="/register"
                  className={`button plan-button ${plan.btnClass}`}
                >
                  {plan.btnText}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
