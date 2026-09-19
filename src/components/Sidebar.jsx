import { NavLink } from "react-router-dom";
import { FiArrowRight, FiMoreHorizontal, FiHelpCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { navConfig } from "../navigation/navConfig";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

import logoImg from "../assets/Logos.svg";

const Sidebar = ({ role = "admin", isOpen = false, onClose }) => {
  const { t, i18n } = useTranslation();
  const { unreadCount } = useNotifications();
  const { currentUser } = useAuth();

  const isRtl = i18n.language?.startsWith("ar");

  const links = navConfig[role] || [];

  const avatarLetter = (currentUser?.initials || role.charAt(0)).toUpperCase();

  const portalLabel = t(`portal.${role}Portal`, `${role.toUpperCase()} PORTAL`);

  const displayName =
    currentUser?.name || t(`portal.${role}Account`, `${role} User`);

  const displayTitle = t("portal.staffMember", "Workwise Workspace");

  // =========================
  // Role Accent Color
  // =========================

  const accentColor =
    {
      admin: "bg-[#79B88B]",
      hr: "bg-[#6366f1]",
      manager: "bg-[#f59e0b]",
      employee: "bg-[#0ea5e9]",
    }[role] || "bg-[#79B88B]";

  // =========================
  // Sidebar Position
  // =========================

  const sidebarPosition = isRtl ? "right-0" : "left-0";

  const hiddenPosition = isRtl ? "translate-x-full" : "-translate-x-full";

  return (
    <>
      {/* =========================
          Mobile Backdrop
      ========================= */}

      {isOpen && (
        <div
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[35]
            bg-[rgba(16,42,67,0.5)]
            lg:hidden
          "
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}

      <aside
        className={`
          fixed
          ${sidebarPosition}
          inset-y-0
          z-40

          flex
          w-[256px]
          flex-col

          bg-[#243B53]

          px-4
          py-5

          shadow-xl

          transition-transform
          duration-300
          ease-in-out

          lg:translate-x-0

          ${isOpen ? "translate-x-0" : hiddenPosition}
        `}
      >
        {/* =========================
            Brand
        ========================= */}

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
            px-2
          "
        >
          <img
            src={logoImg}
            alt="Workwise Logo"
            className="
              h-8
              w-8
              shrink-0
              rounded-xl
            "
          />

          <span
            className="
              text-lg
              font-bold
              tracking-tight
              text-white
            "
          >
            Wise
            <span className="text-[#79B88B]">Work</span>
          </span>
        </div>

        {/* =========================
            Portal Label
        ========================= */}

        <p
          className="
            mb-3
            px-3
            text-[10px]
            font-bold
            tracking-[0.16em]
            text-[#9fb3c4]
          "
        >
          {portalLabel}
        </p>

        {/* =========================
            Navigation
        ========================= */}

        <nav
          className="
            flex
            flex-1
            flex-col
            gap-1
          "
        >
          {links.map((link) => {
            const Icon = link.icon;

            const title = link.titleKey
              ? t(link.titleKey, link.title)
              : link.title;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) => `
                  relative
                  flex
                  items-center
                  gap-3

                  rounded-lg

                  px-3
                  py-2.5

                  text-sm
                  font-medium

                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-[#486581] text-white"
                      : "text-[#D9E2EC] hover:bg-[#334e68]"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}

                    {isActive && (
                      <span
                        className={`
                          absolute
                          top-1/2
                          h-6
                          w-1
                          -translate-y-1/2
                          rounded-full

                          ${isRtl ? "right-0" : "left-0"}

                          ${accentColor}
                        `}
                      />
                    )}

                    {/* Icon */}

                    {Icon && (
                      <Icon
                        className="
                          h-4
                          w-4
                          shrink-0
                        "
                      />
                    )}

                    {/* Title */}

                    <span className="flex-1">{title}</span>

                    {/* Notification Badge */}

                    {link.path.includes("notifications") && unreadCount > 0 && (
                      <span
                        className={`
                            rounded-full
                            ${accentColor}

                            px-1.5
                            py-0.5

                            text-[10px]
                            font-bold

                            text-[#243B53]
                          `}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Area */}
        <div className="sidebar-bottom">
          {/* Need a hand card */}
          <NavLink
            to="/employee/ai-assistant"
            onClick={onClose}
            className="help-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <FiHelpCircle />
            <div>
              <strong>{t("portal.needAHand", "Need a hand?")}</strong>
              <span>{t("portal.askAi", "Ask the AI Assistant")}</span>
            </div>
            <FiArrowRight className="card-arrow" />
          </NavLink>
        </div>
        {/* =========================
            Bottom Section
        ========================= */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
          "
        >
          {/* =========================
              Help Card
          ========================= */}

          <div
            className="
              flex
              cursor-pointer
              items-center
              gap-3

              rounded-xl

              border
              border-[#486581]

              bg-[#334e68]/60

              p-3

              transition

              hover:bg-[#334e68]
            "
          >
            <FiHelpCircle
              className="
                h-4
                w-4
                shrink-0
                text-[#79B88B]
              "
            />

            <div
              className="
                flex
                min-w-0
                flex-1
                flex-col
              "
            >
              <strong
                className="
                  text-xs
                  font-bold
                  leading-tight
                  text-white
                "
              >
                {t("portal.needAHand", "Need a hand?")}
              </strong>

              <span
                className="
                  mt-0.5
                  text-[10px]
                  leading-tight
                  text-[#9fb3c4]
                "
              >
                {t("portal.askAi", "Ask the AI Assistant")}
              </span>
            </div>

            <FiArrowRight
              className={`
                h-3.5
                w-3.5
                shrink-0
                text-[#9fb3c4]

                ${isRtl ? "rotate-180" : ""}
              `}
            />
          </div>

          {/* =========================
              User Mini Profile
          ========================= */}

          <div
            className="
              flex
              cursor-pointer
              items-center
              gap-2.5

              rounded-xl

              px-2
              py-2

              transition

              hover:bg-[#334e68]
            "
          >
            {/* Avatar */}

            <div
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-full

                ${accentColor}

                text-[11px]
                font-bold
                text-[#243B53]
              `}
            >
              {avatarLetter}
            </div>

            {/* User Info */}

            <div
              className="
                flex
                min-w-0
                flex-1
                flex-col
              "
            >
              <strong
                className="
                  truncate
                  text-[12px]
                  font-bold
                  leading-tight
                  text-white
                "
              >
                {displayName}
              </strong>

              <span
                className="
                  mt-0.5
                  text-[10px]
                  leading-tight
                  text-[#9fb3c4]
                "
              >
                {displayTitle}
              </span>
            </div>

            {/* More */}

            <FiMoreHorizontal
              className="
                h-4
                w-4
                shrink-0
                text-[#9fb3c4]
              "
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
