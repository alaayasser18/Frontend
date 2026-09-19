import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

const Header = ({ onToggleMenu }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { unreadCount } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const role        = currentUser?.role     || "admin";
  const avatarText  = currentUser?.initials || role.charAt(0).toUpperCase();
  const displayName = currentUser?.name     || t(`portal.${role}Account`, `${role} Account`);
  const displayRole = t("portal.staffMember", "Staff Member");

  const handleClose = useCallback(() => setNotifOpen(false), []);

  return (
    <header className="sticky top-0 z-30 flex h-[65px] items-center justify-between border-b border-[#e2e8f0] bg-white px-8 max-[760px]:px-4">

      {/* Mobile Menu Button */}
      <button
        className="hidden max-[760px]:flex items-center justify-center p-1.5 text-[#243b53] rounded-lg hover:bg-[#f0f4f7] transition"
        onClick={onToggleMenu}
        aria-label="Toggle Menu"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Searchbox */}
      <div className="flex items-center gap-2 h-[38px] w-[min(440px,45vw)] max-[760px]:flex-1 max-[760px]:w-auto max-[760px]:mx-3 rounded-lg border border-[#e2e8f0] bg-[#fbfcfd] px-3">
        <FiSearch className="w-4 h-4 text-[#829ab1] shrink-0" />
        <input
          className="flex-1 bg-transparent text-[12px] text-[#334e68] outline-none placeholder:text-[#829ab1] min-w-0"
          placeholder={t("portal.searchPlaceholder", "Search tasks, policies, calendar...")}
        />
        <kbd className="hidden max-[760px]:hidden border border-[#e2e8f0] bg-[#eef2f5] rounded px-1.5 py-0.5 text-[10px] text-[#829ab1] font-sans whitespace-nowrap">⌘ K</kbd>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 max-[760px]:gap-2">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications Bell */}
        <div className="relative">
          <button
            className="relative flex items-center justify-center p-1.5 text-[#486581] rounded-lg hover:bg-[#f0f4f7] transition"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((prev) => !prev)}
            title={t("portal.notifications", "Notifications")}
          >
            <FiBell className="w-[19px] h-[19px]" />
            {unreadCount > 0 && (
              <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] rounded-full bg-[#e56b6f] border-[1.5px] border-white" />
            )}
          </button>

          <NotificationDropdown isOpen={notifOpen} onClose={handleClose} />
        </div>

        {/* User Profile */}
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#f0f4f7] transition cursor-pointer border-0 bg-transparent">
          <div className="w-8 h-8 rounded-full bg-[#e7eef5] flex items-center justify-center text-xs font-bold text-[#486581]">
            {avatarText}
          </div>
          <div className="flex flex-col text-left max-[760px]:hidden">
            <strong className="text-[12px] font-bold text-[#1e293b] leading-tight">{displayName}</strong>
            <span className="text-[10px] text-[#829ab1] mt-0.5 leading-tight">{displayRole}</span>
          </div>
          <FiChevronDown className="w-3.5 h-3.5 text-[#829ab1] max-[760px]:hidden" />
        </button>
      </div>
    </header>
  );
};

export default Header;
