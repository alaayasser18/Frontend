import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiTrendingUp,
  FiBarChart2,
  FiCpu,
} from "react-icons/fi";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const featureItems = [
    {
      key: "employees",
      icon: <FiUsers />,
      title: t("home.features.items.employees.title"),
      desc: t("home.features.items.employees.desc"),
      highlight: false,
    },
    {
      key: "attendance",
      icon: <FiClock />,
      title: t("home.features.items.attendance.title"),
      desc: t("home.features.items.attendance.desc"),
      highlight: false,
    },
    {
      key: "leaves",
      icon: <FiCalendar />,
      title: t("home.features.items.leaves.title"),
      desc: t("home.features.items.leaves.desc"),
      highlight: false,
    },
    {
      key: "performance",
      icon: <FiTrendingUp />,
      title: t("home.features.items.performance.title"),
      desc: t("home.features.items.performance.desc"),
      highlight: false,
    },
    {
      key: "reports",
      icon: <FiBarChart2 />,
      title: t("home.features.items.reports.title"),
      desc: t("home.features.items.reports.desc"),
      highlight: false,
    },
    {
      key: "aiInsights",
      icon: <FiCpu />,
      title: t("home.features.items.aiInsights.title"),
      desc: t("home.features.items.aiInsights.desc"),
      highlight: true,
    },
  ];

  return (
    <section id="features" className="section section-tint">
      <div className="container">
        {/* Section Heading */}
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <div className="section-kicker">
              <span className="eyebrow-dot"></span>
              <span>{t("home.features.badge")}</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
            >
              {t("home.features.title")}
            </motion.h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.25,
            }}
          >
            {t("home.features.subtitle")}
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <div className="feature-grid">
          {featureItems.map((item, index) => (
            <motion.div
              key={item.key}
              className={`feature-card ${item.highlight ? "highlight" : ""}`}
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.95,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <motion.div
                className="feature-icon"
                initial={{ scale: 0, rotate: -15 }}
                whileInView={{
                  scale: 1,
                  rotate: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {item.icon}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1 + 0.2,
                }}
              >
                {item.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1 + 0.25,
                }}
              >
                {item.desc}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
