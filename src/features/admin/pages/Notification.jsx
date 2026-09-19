import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useNotifications } from "../../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiArrowUpRight,
  FiCheck,
  FiX,
  FiSearch,
  FiBellOff,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";

export default function Notification() {
  const { t } = useTranslation();

  const {
    notifications,
    setNotifications,
    unreadCount,
  } = useNotifications();

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  // ============================================================
  // FILTER NOTIFICATIONS
  // ============================================================

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (filter === "unread" && item.isRead) return false;
      if (filter === "seen" && !item.isRead) return false;

      if (
        filter !== "all" &&
        filter !== "unread" &&
        filter !== "seen" &&
        item.category !== filter
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        const title = (
          t(item.titleKey, item.defaultTitle) || ""
        ).toLowerCase();

        const desc = (
          t(item.descKey, item.defaultDesc) || ""
        ).toLowerCase();

        return (
          title.includes(query) ||
          desc.includes(query)
        );
      }

      return true;
    });
  }, [notifications, filter, searchQuery, t]);

  // ============================================================
  // MARK ALL AS READ
  // ============================================================

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    );

    toast.success(
      t(
        "portal.markedAllSuccess",
        "All notifications marked as read"
      ),
      {
        id: "toast-mark-all",
      }
    );
  };

  // ============================================================
  // CLEAR ALL NOTIFICATIONS
  // ============================================================

  const handleClearAll = () => {
    if (notifications.length === 0) return;

    setNotifications([]);
    setSelectedNotification(null);

    toast.success(
      t(
        "portal.clearedAllSuccess",
        "All notifications cleared successfully"
      ),
      {
        id: "toast-clear-all",
      }
    );
  };

  // ============================================================
  // TOGGLE READ / UNREAD
  // ============================================================

  const handleToggleRead = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const targetItem = notifications.find(
      (item) => item.id === id
    );

    if (!targetItem) return;

    const nextStatus = !targetItem.isRead;

    if (nextStatus) {
      toast.success(
        t(
          "portal.markedSeenSuccess",
          "Notification marked as seen"
        ),
        {
          id: `toast-seen-${id}`,
        }
      );
    } else {
      toast.success(
        t(
          "portal.markedUnreadSuccess",
          "Notification marked as unread"
        ),
        {
          id: `toast-unread-${id}`,
        }
      );
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: nextStatus,
            }
          : item
      )
    );

    if (
      selectedNotification &&
      selectedNotification.id === id
    ) {
      setSelectedNotification((prev) => ({
        ...prev,
        isRead: nextStatus,
      }));
    }
  };

  // ============================================================
  // CLEAR SINGLE NOTIFICATION
  // ============================================================

  const handleClear = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (
      selectedNotification &&
      selectedNotification.id === id
    ) {
      setSelectedNotification(null);
    }

    toast.success(
      t(
        "portal.clearedSuccess",
        "Notification cleared successfully"
      ),
      {
        id: `toast-clear-${id}`,
      }
    );
  };

  // ============================================================
  // EXPORT CONFIGURATION
  // ============================================================

  const handleExportConfig = () => {
    const configData = {
      system: "WiseWork Admin Portal",
      exportDate: new Date().toISOString(),

      notificationSettings: {
        evaluations: true,
        securityAlerts: true,
        systemAudit: true,
        emailDigest: "daily",
        activeChannels: ["in-app", "email"],
      },

      currentNotificationsCount:
        notifications.length,

      unreadCount,
    };

    const blob = new Blob(
      [JSON.stringify(configData, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download =
      "wisework-notifications-config.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    toast.success(
      t(
        "portal.exportSuccess",
        "Configuration exported successfully"
      )
    );
  };

  // ============================================================
  // BADGE CLASSES
  // ============================================================

  const getBadgeClasses = (category) => {
    const base =
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none";

    if (category === "evaluations") {
      return `${base} bg-[#e7eef5] text-[var(--steel)]`;
    }

    if (category === "security") {
      return `${base} bg-[#fbf2df] text-[#9b6b1e]`;
    }

    if (category === "system") {
      return `${base} bg-[#e8f3eb] text-[var(--success)]`;
    }

    return `${base} bg-[#eef2f5] text-[var(--steel)]`;
  };

  return (
    <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-6">

      {/* ============================================================
          PAGE HEADER
      ============================================================ */}

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>

          {/* Breadcrumbs */}
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#829ab1]">

            <span>
              {t(
                "portal.administration",
                "Administration"
              )}
            </span>

            <FiChevronRight className="h-3.5 w-3.5 shrink-0" />

            <span className="text-[var(--steel)]">
              {t(
                "portal.wiseWork",
                "WiseWork"
              )}
            </span>

          </div>

          {/* Page Title */}
          <h1 className="text-[28px] font-[750] leading-[1.2] tracking-[-0.02em] text-[var(--navy)]">
            {t(
              "portal.notificationsTitle",
              "Notifications"
            )}
          </h1>

          {/* Page Subtitle */}
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            {t(
              "portal.notificationsSubtitle",
              "Configure and manage your WiseWork notifications."
            )}
          </p>

        </div>

        {/* Export Button */}
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#bcccdc]
            bg-white
            px-4
            py-[9px]
            text-[13px]
            font-semibold
            text-[var(--steel)]
            shadow-[0_1px_2px_rgba(32,43,51,0.03)]
            transition-colors
            duration-200
            hover:border-[var(--steel)]
            hover:bg-[#f0f4f7]
            hover:text-[var(--navy)]
          "
          onClick={handleExportConfig}
          id="btn-export-configuration"
        >
          <FiArrowUpRight className="h-4 w-4" />

          <span>
            {t(
              "portal.exportConfig",
              "Export configuration"
            )}
          </span>
        </motion.button>

      </div>

      {/* ============================================================
          SECTION TITLE + CONTROLS
      ============================================================ */}

      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">

        <div>

          <h2 className="text-[22px] font-[750] leading-[1.25] tracking-[-0.01em] text-[var(--navy)]">
            {t(
              "portal.systemAlertsTitle",
              "System Notifications & Alerts"
            )}
          </h2>

          <p className="mt-1 text-[13.5px] text-[var(--muted)]">
            {t(
              "portal.systemAlertsSubtitle",
              "Review system events, policy updates, and operational reminders"
            )}
          </p>

        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">

          {/* Mark All */}
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-[#bcccdc]
              bg-white
              px-4
              py-2
              text-[13px]
              font-semibold
              text-[var(--navy)]
              transition-all
              duration-200
              hover:border-[var(--steel)]
              hover:bg-[#f0f4f7]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            id="btn-mark-all-as-read"
            title={t(
              "portal.markAllAsRead",
              "Mark all as read"
            )}
          >
            <FiCheck className="h-4 w-4" />

            <span>
              {t(
                "portal.markAllAsRead",
                "Mark all as read"
              )}
            </span>
          </motion.button>

          {/* Clear All */}
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-[#f2c0c0]
              bg-white
              px-4
              py-2
              text-[13px]
              font-semibold
              text-[var(--error)]
              transition-all
              duration-200
              hover:bg-[#fff6f6]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            id="btn-clear-all-notifications"
            title={t(
              "portal.clearAll",
              "Clear All"
            )}
          >
            <FiTrash2 className="h-4 w-4" />

            <span>
              {t(
                "portal.clearAll",
                "Clear All"
              )}
            </span>
          </motion.button>

          {/* Filter */}
          <div className="relative">

            <select
              className="
                min-w-[100px]
                appearance-none
                rounded-lg
                border
                border-[#bcccdc]
                bg-white
                py-2
                pl-3.5
                pr-9
                text-[13px]
                font-semibold
                text-[var(--navy)]
                outline-none
                transition-all
                duration-200
                hover:border-[var(--steel)]
                focus:border-[var(--steel)]
                focus:ring-2
                focus:ring-[rgba(72,101,129,0.12)]
              "
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              id="select-notifications-filter"
              aria-label="Filter notifications"
            >
              <option value="all">
                {t("portal.all", "All")}
              </option>

              <option value="unread">
                {t(
                  "portal.unread",
                  "Unread"
                )}
              </option>

              <option value="seen">
                {t(
                  "portal.seen",
                  "Seen"
                )}
              </option>

              <option value="evaluations">
                {t(
                  "portal.evaluations",
                  "Evaluations"
                )}
              </option>

              <option value="security">
                {t(
                  "portal.security",
                  "Security"
                )}
              </option>

              <option value="system">
                {t(
                  "portal.system",
                  "System"
                )}
              </option>
            </select>

            <FiChevronRight
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-3.5
                w-3.5
                -translate-y-1/2
                rotate-90
                text-[var(--steel)]
                rtl:left-3
                rtl:right-auto
              "
            />

          </div>

        </div>
      </div>

      {/* ============================================================
          NOTIFICATION CENTER
      ============================================================ */}

      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[var(--border)]
          bg-white
          p-5
          shadow-[0_4px_12px_rgba(32,43,51,0.06)]
          sm:p-6
          lg:px-7
        "
      >

        {/* Card Header */}
        <div className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          border-b
          border-[#f0f4f7]
          pb-[18px]
        ">

          <div>

            <h3 className="text-[18px] font-bold text-[var(--navy)]">
              {t(
                "portal.notificationCenter",
                "Notification center"
              )}
            </h3>

            <p className="mt-1 text-[13px] text-[#829ab1]">
              {unreadCount > 0
                ? t(
                    "portal.unreadCountMsg",
                    {
                      count: unreadCount,
                      defaultValue: `${unreadCount} unread notifications requiring your attention.`,
                    }
                  )
                : t(
                    "portal.allReviewedMsg",
                    "All notifications have been reviewed."
                  )}
            </p>

          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[240px]">

            <FiSearch
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-[#829ab1]
                rtl:left-auto
                rtl:right-3
              "
            />

            <input
              type="text"
              placeholder={t(
                "portal.searchNotifications",
                "Search notifications..."
              )}
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              id="input-search-notifications"
              className="
                w-full
                rounded-lg
                border
                border-[var(--border)]
                bg-[#f7fafb]
                py-2
                pl-9
                pr-3
                text-[12.5px]
                text-[var(--navy)]
                outline-none
                placeholder:text-[#9fb3c4]
                transition-all
                duration-200
                hover:border-[#bcccdc]
                focus:border-[var(--steel)]
                focus:bg-white
                focus:ring-2
                focus:ring-[rgba(72,101,129,0.08)]
                rtl:pl-3
                rtl:pr-9
              "
            />

          </div>

        </div>

        {/* ============================================================
            NOTIFICATIONS LIST
        ============================================================ */}

        <div className="divide-y divide-[#eef1f4]">

          <AnimatePresence mode="popLayout">

            {filteredNotifications.length > 0 ? (

              filteredNotifications.map((item) => {

                const title = t(
                  item.titleKey,
                  item.defaultTitle
                );

                const desc = t(
                  item.descKey,
                  item.defaultDesc
                );

                const badge = t(
                  item.badgeKey,
                  item.defaultBadge
                );

                const time = t(
                  item.timestampKey,
                  item.timestamp
                );

                const actionLabel =
                  item.actionKey
                    ? t(
                        item.actionKey,
                        item.defaultAction
                      )
                    : item.defaultAction;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: item.isRead
                        ? 0.88
                        : 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    transition={{
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -1,
                    }}
                    className="
                      group
                      flex
                      cursor-pointer
                      items-start
                      gap-3.5
                      rounded-xl
                      px-3
                      py-[18px]
                      transition-colors
                      duration-200
                      hover:bg-[#f8fafc]
                    "
                    onClick={() =>
                      setSelectedNotification(
                        item
                      )
                    }
                  >

                    {/* Status Dot */}
                    <motion.span
                      animate={{
                        scale: item.isRead
                          ? 1
                          : [1, 1.12, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: item.isRead
                          ? 0
                          : Infinity,
                        ease: "easeInOut",
                      }}
                      className={`
                        mt-[6px]
                        h-2.5
                        w-2.5
                        shrink-0
                        rounded-full
                        ${
                          item.isRead
                            ? "bg-[#9fb3c4]"
                            : "bg-[var(--success)] shadow-[0_0_0_3px_rgba(63,125,90,0.12)]"
                        }
                      `}
                      title={
                        item.isRead
                          ? t(
                              "portal.seen",
                              "Seen"
                            )
                          : t(
                              "portal.unread",
                              "Unread"
                            )
                      }
                      onClick={(e) =>
                        handleToggleRead(
                          item.id,
                          e
                        )
                      }
                    />

                    {/* Main Content */}
                    <div className="min-w-0 flex-1">

                      {/* Header */}
                      <div className="
                        flex
                        flex-wrap
                        items-start
                        justify-between
                        gap-2
                      ">

                        <div className="
                          flex
                          min-w-0
                          flex-wrap
                          items-center
                          gap-2
                        ">

                          <span className="
                            text-[15px]
                            font-bold
                            leading-5
                            text-[var(--navy)]
                          ">
                            {title}
                          </span>

                          <span
                            className={getBadgeClasses(
                              item.category
                            )}
                          >
                            <span className="text-[13px] leading-none">
                              •
                            </span>

                            {badge}
                          </span>

                        </div>

                        <span className="
                          shrink-0
                          text-[12px]
                          text-[#829ab1]
                        ">
                          {time}
                        </span>

                      </div>

                      {/* Description */}
                      <p className="
                        mt-1.5
                        text-[13.5px]
                        leading-[1.55]
                        text-[var(--muted)]
                      ">
                        {desc}
                      </p>

                      {/* Actions */}
                      <div className="
                        mt-3
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                      ">

                        <div className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        ">

                          {/* Contextual Action */}
                          {item.actionType &&
                            item.actionType !==
                              "system" && (

                              <motion.button
                                type="button"
                                whileHover={{
                                  x: 1,
                                }}
                                whileTap={{
                                  scale: 0.98,
                                }}
                                className="
                                  inline-flex
                                  items-center
                                  rounded-md
                                  px-2
                                  py-1
                                  text-[12px]
                                  font-semibold
                                  text-[var(--steel)]
                                  transition-colors
                                  hover:bg-[#eef2f5]
                                  hover:text-[var(--navy)]
                                "
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setSelectedNotification(
                                    item
                                  );
                                }}
                              >
                                {actionLabel}
                              </motion.button>
                            )}

                          {/* Seen / Unseen */}
                          <motion.button
                            type="button"
                            whileTap={{
                              scale: 0.97,
                            }}
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-md
                              border
                              px-2.5
                              py-1.5
                              text-[12px]
                              font-semibold
                              transition-all
                              duration-200
                              ${
                                item.isRead
                                  ? "border-[#dce6ec] bg-[#f7fafb] text-[#627d98] hover:bg-[#eef2f5]"
                                  : "border-[#cfe3d4] bg-[#f4faf5] text-[var(--success)] hover:bg-[#eaf5ed]"
                              }
                            `}
                            onClick={(e) =>
                              handleToggleRead(
                                item.id,
                                e
                              )
                            }
                            title={
                              item.isRead
                                ? t(
                                    "portal.markAsUnread",
                                    "Mark as Unread"
                                  )
                                : t(
                                    "portal.markAsSeen",
                                    "Mark as Seen"
                                  )
                            }
                          >

                            {item.isRead ? (
                              <FiCheckCircle className="h-3.5 w-3.5" />
                            ) : (
                              <FiEye className="h-3.5 w-3.5" />
                            )}

                            <span>
                              {item.isRead
                                ? t(
                                    "portal.seen",
                                    "Seen"
                                  )
                                : t(
                                    "portal.markAsSeen",
                                    "Mark as Seen"
                                  )}
                            </span>

                          </motion.button>

                        </div>

                        {/* Clear */}
                        <motion.button
                          type="button"
                          whileHover={{
                            x: -1,
                          }}
                          whileTap={{
                            scale: 0.96,
                          }}
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-md
                            px-2
                            py-1.5
                            text-[12px]
                            font-semibold
                            text-[#a66]
                            opacity-70
                            transition-all
                            duration-200
                            hover:bg-[#fff6f6]
                            hover:text-[var(--error)]
                            hover:opacity-100
                          "
                          onClick={(e) =>
                            handleClear(
                              item.id,
                              e
                            )
                          }
                          title={t(
                            "portal.clearNotification",
                            "Clear Notification"
                          )}
                          aria-label={t(
                            "portal.clearNotification",
                            "Clear Notification"
                          )}
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />

                          <span>
                            {t(
                              "portal.clearNotification",
                              "Clear"
                            )}
                          </span>

                        </motion.button>

                      </div>

                    </div>

                  </motion.div>
                );
              })

            ) : (

              /* ========================================================
                 EMPTY STATE
              ======================================================== */

              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-5
                  py-16
                  text-center
                "
              >

                <motion.div
                  initial={{
                    scale: 0.9,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[#eef2f5]
                    text-[#829ab1]
                  "
                >
                  <FiBellOff className="h-6 w-6" />
                </motion.div>

                <h4 className="
                  text-[16px]
                  font-bold
                  text-[var(--navy)]
                ">
                  {t(
                    "portal.noNotificationsTitle",
                    "No notifications found"
                  )}
                </h4>

                <p className="
                  mt-1.5
                  max-w-[420px]
                  text-[13px]
                  leading-5
                  text-[var(--muted)]
                ">
                  {t(
                    "portal.noNotificationsDesc",
                    "There are no notifications matching your current filter."
                  )}
                </p>

                {(filter !== "all" ||
                  searchQuery) && (

                  <motion.button
                    type="button"
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="
                      mt-4
                      rounded-lg
                      border
                      border-[#bcccdc]
                      bg-white
                      px-4
                      py-2
                      text-[12.5px]
                      font-semibold
                      text-[var(--steel)]
                      transition-all
                      duration-200
                      hover:border-[var(--steel)]
                      hover:bg-[#f0f4f7]
                      hover:text-[var(--navy)]
                    "
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                    }}
                  >
                    {t(
                      "portal.resetFilter",
                      "Reset Filter"
                    )}
                  </motion.button>

                )}

              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </motion.div>

      {/* ============================================================
          NOTIFICATION MODAL
      ============================================================ */}

      <AnimatePresence>

        {selectedNotification && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              fixed
              inset-0
              z-[999]
              flex
              items-center
              justify-center
              bg-[rgba(16,42,67,0.5)]
              p-4
              backdrop-blur-[3px]
              sm:p-5
            "
            onClick={() =>
              setSelectedNotification(null)
            }
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 28,
              }}
              className="
                max-h-[90vh]
                w-full
                max-w-[580px]
                overflow-y-auto
                rounded-[18px]
                border
                border-[var(--border)]
                bg-white
                shadow-[0_16px_40px_rgba(16,42,67,0.2)]
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* Modal Header */}
              <div className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-[#eef1f4]
                px-5
                py-4
                sm:px-[30px]
              ">

                <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                ">

                  <span
                    className={getBadgeClasses(
                      selectedNotification.category
                    )}
                  >
                    <span className="text-[13px] leading-none">
                      •
                    </span>

                    {t(
                      selectedNotification.badgeKey,
                      selectedNotification.defaultBadge
                    )}
                  </span>

                  <span className="
                    text-[12px]
                    text-[#829ab1]
                  ">
                    {t(
                      selectedNotification.timestampKey,
                      selectedNotification.timestamp
                    )}
                  </span>

                </div>

                <motion.button
                  type="button"
                  whileHover={{
                    rotate: 90,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-[#829ab1]
                    transition-colors
                    hover:bg-[#f0f4f7]
                    hover:text-[var(--navy)]
                  "
                  onClick={() =>
                    setSelectedNotification(
                      null
                    )
                  }
                  title={t(
                    "portal.closeModal",
                    "Close"
                  )}
                >
                  <FiX className="h-5 w-5" />
                </motion.button>

              </div>

              {/* Modal Body */}
              <div className="px-5 py-6 sm:px-[30px]">

                <h3 className="
                  text-[21px]
                  font-bold
                  leading-[1.3]
                  tracking-[-0.01em]
                  text-[var(--navy)]
                ">
                  {t(
                    selectedNotification.titleKey,
                    selectedNotification.defaultTitle
                  )}
                </h3>

                <p className="
                  mt-2
                  text-[13.5px]
                  leading-[1.65]
                  text-[var(--muted)]
                ">
                  {t(
                    selectedNotification.descKey,
                    selectedNotification.defaultDesc
                  )}
                </p>

                {/* ====================================================
                    CYCLE DETAILS
                ==================================================== */}

                {selectedNotification.actionType ===
                "cycle" ? (

                  <div className="
                    mt-6
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[#f8fafc]
                  ">

                    <div className="
                      border-b
                      border-[#e6edf2]
                      px-4
                      py-3
                    ">
                      <span className="
                        text-[12px]
                        font-bold
                        uppercase
                        tracking-[0.04em]
                        text-[#829ab1]
                      ">
                        {t(
                          "portal.details",
                          "Details"
                        )}
                      </span>
                    </div>

                    <div className="divide-y divide-[#e6edf2]">

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.cycleNameLabel",
                            "Cycle Name:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          font-semibold
                          text-[var(--navy)]
                        ">
                          {t(
                            "portal.cycleNameVal",
                            "Q3 2026 Performance Review"
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.cycleDurationLabel",
                            "Duration:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            "portal.cycleDurationVal",
                            "Sep 15, 2026 - Oct 15, 2026"
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.targetAudienceLabel",
                            "Target Audience:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            "portal.targetAudienceVal",
                            "All Employees (1,248 Users)"
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.branchesLabel",
                            "Branches:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            "portal.branchesVal",
                            "Cairo & Alexandria"
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.currentStatusLabel",
                            "Current Status:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          font-semibold
                          text-[var(--success)]
                        ">
                          {t(
                            "portal.cycleStatusVal",
                            "Active • 64% completed"
                          )}
                        </span>
                      </div>

                    </div>
                  </div>

                ) : selectedNotification.actionType ===
                  "log" ? (

                  /* ====================================================
                      LOG DETAILS
                  ==================================================== */

                  <div className="
                    mt-6
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[#f8fafc]
                  ">

                    <div className="
                      border-b
                      border-[#e6edf2]
                      px-4
                      py-3
                    ">
                      <span className="
                        text-[12px]
                        font-bold
                        uppercase
                        tracking-[0.04em]
                        text-[#829ab1]
                      ">
                        {t(
                          "portal.details",
                          "Details"
                        )}
                      </span>
                    </div>

                    <div className="divide-y divide-[#e6edf2]">

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.eventIdLabel",
                            "Event ID:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          font-semibold
                          text-[var(--navy)]
                        ">
                          LOG-2026-94812
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.initiatorLabel",
                            "Initiator:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            selectedNotification.initiatorKey,
                            selectedNotification.defaultInitiator
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.actionLabel",
                            "Action:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            "portal.actionVal",
                            "Geofence / Security Policy Update"
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.ipAddressLabel",
                            "IP Address:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            "portal.ipAddressVal",
                            "197.38.112.44 (Alexandria)"
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.statusLabel",
                            "Status:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          font-semibold
                          text-[var(--success)]
                        ">
                          {t(
                            "portal.logStatusVal",
                            "Verified & Applied"
                          )}
                        </span>
                      </div>

                    </div>
                  </div>

                ) : (

                  /* ====================================================
                      GENERAL DETAILS
                  ==================================================== */

                  <div className="
                    mt-6
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[#f8fafc]
                  ">

                    <div className="
                      border-b
                      border-[#e6edf2]
                      px-4
                      py-3
                    ">
                      <span className="
                        text-[12px]
                        font-bold
                        uppercase
                        tracking-[0.04em]
                        text-[#829ab1]
                      ">
                        {t(
                          "portal.details",
                          "Details"
                        )}
                      </span>
                    </div>

                    <div className="divide-y divide-[#e6edf2]">

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.initiator",
                            "Initiator:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            selectedNotification.initiatorKey,
                            selectedNotification.defaultInitiator
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.scope",
                            "Scope:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            selectedNotification.scopeKey,
                            selectedNotification.defaultScope
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.priority",
                            "Priority:"
                          )}
                        </span>

                        <span className="
                          text-[13px]
                          text-[var(--navy)]
                        ">
                          {t(
                            selectedNotification.priorityKey,
                            selectedNotification.defaultPriority
                          )}
                        </span>
                      </div>

                      <div className="
                        grid
                        grid-cols-1
                        gap-1
                        px-4
                        py-3
                        sm:grid-cols-[140px_1fr]
                        sm:gap-4
                      ">
                        <span className="
                          text-[12.5px]
                          font-semibold
                          text-[#829ab1]
                        ">
                          {t(
                            "portal.status",
                            "Status:"
                          )}
                        </span>

                        <span
                          className={`
                            text-[13px]
                            font-semibold
                            ${
                              selectedNotification.isRead
                                ? "text-[var(--muted)]"
                                : "text-[var(--success)]"
                            }
                          `}
                        >
                          {selectedNotification.isRead
                            ? t(
                                "portal.seen",
                                "Seen"
                              )
                            : t(
                                "portal.unseen",
                                "Unread"
                              )}
                        </span>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* ========================================================
                  MODAL ACTIONS
              ======================================================== */}

              <div className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
                border-t
                border-[#eef1f4]
                bg-[#fbfcfd]
                px-5
                py-4
                sm:px-[30px]
              ">

                <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                ">

                  {/* Toggle */}
                  <motion.button
                    type="button"
                    whileTap={{
                      scale: 0.97,
                    }}
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      px-3.5
                      py-2
                      text-[12.5px]
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        selectedNotification.isRead
                          ? "border-[#d9e2ec] bg-white text-[var(--steel)] hover:bg-[#f0f4f7]"
                          : "border-[#cfe3d4] bg-[#f4faf5] text-[var(--success)] hover:bg-[#eaf5ed]"
                      }
                    `}
                    onClick={() =>
                      handleToggleRead(
                        selectedNotification.id
                      )
                    }
                  >
                    {selectedNotification.isRead ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiCheck className="h-4 w-4" />
                    )}

                    <span>
                      {selectedNotification.isRead
                        ? t(
                            "portal.markAsUnread",
                            "Mark as Unread"
                          )
                        : t(
                            "portal.markAsSeen",
                            "Mark as Seen"
                          )}
                    </span>
                  </motion.button>

                  {/* Clear */}
                  <motion.button
                    type="button"
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-[#f2c0c0]
                      bg-white
                      px-3.5
                      py-2
                      text-[12.5px]
                      font-semibold
                      text-[var(--error)]
                      transition-all
                      duration-200
                      hover:bg-[#fff6f6]
                    "
                    onClick={() =>
                      handleClear(
                        selectedNotification.id
                      )
                    }
                  >
                    <FiTrash2 className="h-4 w-4" />

                    <span>
                      {t(
                        "portal.clearNotification",
                        "Clear Notification"
                      )}
                    </span>
                  </motion.button>

                </div>

                {/* Close */}
                <motion.button
                  type="button"
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--navy)]
                    px-5
                    py-2
                    text-[13px]
                    font-semibold
                    text-white
                    shadow-[0_2px_6px_rgba(36,59,83,0.15)]
                    transition-all
                    duration-200
                    hover:bg-[var(--navy-2)]
                  "
                  onClick={() =>
                    setSelectedNotification(null)
                  }
                >
                  {t(
                    "portal.closeModal",
                    "Close"
                  )}
                </motion.button>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}