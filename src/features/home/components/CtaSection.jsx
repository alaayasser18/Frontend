import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function CtaSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <section id="contact" className="cta-section">
      <div className="container">
        <motion.div
          className="cta-box"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="section-kicker"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
            >
              <span
                className="eyebrow-dot"
                style={{ background: "#FFFFFF" }}
              ></span>

              <span>{t("home.cta.badge")}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.35,
              }}
            >
              {t("home.cta.title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.45,
              }}
            >
              {t("home.cta.subtitle")}
            </motion.p>
          </motion.div>

          {/* Right CTA */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "flex-start",
            }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: "easeOut",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/register" className="button button-light">
                <span>{t("home.cta.btnPrimary")}</span>

                <FiArrowRight
                  style={{
                    transform: isRtl ? "rotate(180deg)" : "none",
                  }}
                />
              </Link>
            </motion.div>

            <motion.span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.7)",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.65,
              }}
            >
              {t("home.cta.noCreditCard")}
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
