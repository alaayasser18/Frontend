import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function TrustStatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      number: t("home.stats.uptime"),
      label: t("home.stats.uptimeLabel"),
    },
    {
      number: t("home.stats.speed"),
      label: t("home.stats.speedLabel"),
    },
    {
      number: t("home.stats.employeesCount"),
      label: t("home.stats.employeesLabel"),
    },
    {
      number: t("home.stats.security"),
      label: t("home.stats.securityLabel"),
    },
  ];

  /* =========================
     ANIMATION VARIANTS
  ========================= */

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const statVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="stats-section">
      <div className="container">
        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="stat"
              variants={statVariants}
              whileHover={{
                y: -5,
                scale: 1.03,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              <motion.strong
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.15 + idx * 0.1,
                  duration: 0.4,
                }}
                viewport={{
                  once: true,
                }}
              >
                {stat.number}
              </motion.strong>

              <motion.span
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.25 + idx * 0.1,
                  duration: 0.3,
                }}
                viewport={{
                  once: true,
                }}
              >
                {stat.label}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
