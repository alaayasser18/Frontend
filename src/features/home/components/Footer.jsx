import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowUp,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import logoImg from "../../../assets/logo.jpeg";
import {
  APP_NAME,
  BRAND_NAME,
  SITE_CONFIG,
} from "../../../utils/global";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="border-t border-[#D9E2EC] bg-[#102A43] text-white">
        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-6
            py-12
            sm:px-8
            sm:py-14
            lg:px-10
            lg:py-16
          "
        >
          {/* =====================================================
              MAIN FOOTER
              ===================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="
              grid
              grid-cols-1
              gap-10
              sm:grid-cols-2
              lg:grid-cols-[1.25fr_2fr]
              lg:gap-16
              xl:gap-24
            "
          >
            {/* =====================================================
                BRAND
                ===================================================== */}
            <motion.div
              initial={{
                opacity: 0,
                x: isRtl ? 30 : -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="max-w-sm"
            >
              {/* Brand */}
              <motion.div
                whileHover={{
                  scale: 1.015,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  inline-flex
                  items-center
                  gap-3
                "
              >
                <img
                  src={logoImg}
                  alt={APP_NAME}
                  className="
                    h-10
                    w-10
                    rounded-xl
                    object-cover
                  "
                />

                <span
                  className="
                    text-xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  {BRAND_NAME.prefix}

                  <span
                    style={{
                      color: BRAND_NAME.suffixColor,
                    }}
                  >
                    {BRAND_NAME.suffix}
                  </span>
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
                className="
                  mt-5
                  max-w-sm
                  text-sm
                  leading-7
                  text-[#D9E2EC]
                "
              >
                {t("home.footer.tagline")}
              </motion.p>
            </motion.div>

            {/* =====================================================
                LINKS + CONTACT
                ===================================================== */}
            <div
              className="
                grid
                grid-cols-3
                gap-x-4
                gap-y-10
                sm:grid-cols-4
                sm:gap-x-6
                lg:gap-x-8
              "
            >
              {/* =====================================================
                  PLATFORM
                  ===================================================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.15,
                }}
                className="
                  flex
                  flex-col
                  gap-3
                "
              >
                <strong
                  className="
                    mb-1
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {t("home.footer.platformTitle")}
                </strong>

                <motion.a
                  href="#features"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.directory")}
                </motion.a>

                <motion.a
                  href="#features"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.attendance")}
                </motion.a>

                <motion.a
                  href="#features"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.leaves")}
                </motion.a>

                <motion.a
                  href="#features"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.performance")}
                </motion.a>
              </motion.div>

              {/* =====================================================
                  RESOURCES
                  ===================================================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.25,
                }}
                className="
                  flex
                  flex-col
                  gap-3
                "
              >
                <strong
                  className="
                    mb-1
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {t("home.footer.resourcesTitle")}
                </strong>

                <motion.a
                  href="#about"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.docs")}
                </motion.a>

                <motion.a
                  href="#about"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.security")}
                </motion.a>

                <motion.a
                  href="#contact"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.help")}
                </motion.a>
              </motion.div>

              {/* =====================================================
                  COMPANY
                  ===================================================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                }}
                className="
                  flex
                  flex-col
                  gap-3
                "
              >
                <strong
                  className="
                    mb-1
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {t("home.footer.companyTitle")}
                </strong>

                <motion.a
                  href="#about"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.about")}
                </motion.a>

                <motion.a
                  href="#roles"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.careers")}
                </motion.a>

                <motion.a
                  href="#contact"
                  whileHover={{
                    x: isRtl ? -4 : 4,
                  }}
                  className="
                    text-xs
                    leading-6
                    text-[#9FB3C8]
                    transition-colors
                    hover:text-white
                    sm:text-sm
                  "
                >
                  {t("home.footer.links.privacy")}
                </motion.a>
              </motion.div>

              {/* =====================================================
                  CONTACT
                  ===================================================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.45,
                }}
                className="
                  col-span-3
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-white/10
                  pt-8

                  sm:col-span-4
                  sm:pt-8

                  lg:col-span-1
                  lg:border-t-0
                  lg:pt-0
                "
              >
                <strong
                  className="
                    mb-1
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {t("home.footer.contactTitle")}
                </strong>

                {/* Contact Items - Same Row */}
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-6
                    gap-y-2
                  "
                >
                  {/* Email */}
                  <motion.a
                    href={`mailto:${SITE_CONFIG.supportEmail}`}
                    whileHover={{
                      x: isRtl ? -4 : 4,
                    }}
                    className="
                      flex
                      items-center
                      gap-2
                      whitespace-nowrap
                      text-xs
                      leading-6
                      text-[#9FB3C8]
                      transition-colors
                      hover:text-white
                      sm:text-sm
                    "
                  >
                    <FiMail
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                      "
                    />

                    <span>
                      {t(
                        "home.footer.contactInfo.email"
                      )}
                    </span>
                  </motion.a>

                  {/* Phone */}
                  <motion.span
                    whileHover={{
                      x: isRtl ? -4 : 4,
                    }}
                    className="
                      flex
                      items-center
                      gap-2
                      whitespace-nowrap
                      text-xs
                      leading-6
                      text-[#9FB3C8]
                      sm:text-sm
                    "
                  >
                    <FiPhone
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                      "
                    />

                    <span>
                      {t(
                        "home.footer.contactInfo.phone"
                      )}
                    </span>
                  </motion.span>

                  {/* Location */}
                  <motion.span
                    whileHover={{
                      x: isRtl ? -4 : 4,
                    }}
                    className="
                      flex
                      items-center
                      gap-2
                      whitespace-nowrap
                      text-xs
                      leading-6
                      text-[#9FB3C8]
                      sm:text-sm
                    "
                  >
                    <FiMapPin
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                      "
                    />

                    <span>
                      {t(
                        "home.footer.contactInfo.location"
                      )}
                    </span>
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* =====================================================
              DIVIDER
              ===================================================== */}
          <div
            className="
              my-10
              h-px
              bg-white/10
              sm:my-12
            "
          />

          {/* =====================================================
              FOOTER BOTTOM
              ===================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="
              flex
              flex-col
              gap-3
              text-xs
              text-[#9FB3C8]
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:text-sm
            "
          >
            <span>
              {t("home.footer.copyright")}
            </span>

            <span className="text-[#9FB3C8]">
              {t("home.footer.enterpriseLabel")}
            </span>
          </motion.div>
        </div>
      </footer>

      {/* =========================================================
          BACK TO TOP
          ========================================================= */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 15,
            }}
            whileHover={{
              scale: 1.08,
              y: -2,
            }}
            whileTap={{
              scale: 0.94,
            }}
            transition={{
              duration: 0.2,
            }}
            aria-label="Back to top"
            className="
              fixed
              bottom-5
              right-5
              z-[9990]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-[#D9E2EC]
              bg-white
              text-[#243B53]
              shadow-[0_6px_20px_rgba(16,42,67,0.16)]
              transition-colors
              hover:bg-[#F5F7F8]
              sm:bottom-6
              sm:right-6
              sm:h-12
              sm:w-12
            "
          >
            <FiArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}