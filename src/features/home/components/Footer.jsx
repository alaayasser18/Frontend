import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import logoImg from "../../../assets/logo.jpeg";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          className="footer-grid"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <motion.div
              className="brand"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img src={logoImg} alt="WorkWise" className="brand-logo-img" />
              <span>WorkWise</span>
            </motion.div>

            <motion.p
              className="footer-copy"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
            >
              {t("home.footer.tagline")}
            </motion.p>
          </motion.div>

          {/* Links */}
          <div className="footer-links">
            {/* Platform */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.15,
              }}
            >
              <strong>{t("home.footer.platformTitle")}</strong>

              <motion.a href="#features" whileHover={{ x: 4 }}>
                {t("home.footer.links.directory")}
              </motion.a>

              <motion.a href="#features" whileHover={{ x: 4 }}>
                {t("home.footer.links.attendance")}
              </motion.a>

              <motion.a href="#features" whileHover={{ x: 4 }}>
                {t("home.footer.links.leaves")}
              </motion.a>

              <motion.a href="#features" whileHover={{ x: 4 }}>
                {t("home.footer.links.performance")}
              </motion.a>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
            >
              <strong>{t("home.footer.resourcesTitle")}</strong>

              <motion.a href="#about" whileHover={{ x: 4 }}>
                {t("home.footer.links.docs")}
              </motion.a>

              <motion.a href="#about" whileHover={{ x: 4 }}>
                {t("home.footer.links.security")}
              </motion.a>

              <motion.a href="#contact" whileHover={{ x: 4 }}>
                {t("home.footer.links.help")}
              </motion.a>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.35,
              }}
            >
              <strong>{t("home.footer.companyTitle")}</strong>

              <motion.a href="#about" whileHover={{ x: 4 }}>
                {t("home.footer.links.about")}
              </motion.a>

              <motion.a href="#roles" whileHover={{ x: 4 }}>
                {t("home.footer.links.careers")}
              </motion.a>

              <motion.a href="#contact" whileHover={{ x: 4 }}>
                {t("home.footer.links.privacy")}
              </motion.a>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.45,
              }}
            >
              <strong>{t("home.footer.contactTitle")}</strong>

              <motion.a href="mailto:support@workwise.io" whileHover={{ x: 4 }}>
                {t("home.footer.contactInfo.email")}
              </motion.a>

              <motion.span whileHover={{ x: 4 }}>
                {t("home.footer.contactInfo.phone")}
              </motion.span>

              <motion.span whileHover={{ x: 4 }}>
                {t("home.footer.contactInfo.location")}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.55,
          }}
        >
          <span>{t("home.footer.copyright")}</span>

          <span>Enterprise Grade People Operations Platform</span>
        </motion.div>
      </div>
    </footer>
  );
}
