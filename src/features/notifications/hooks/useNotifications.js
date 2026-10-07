import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications as apiClearAll,
  deleteNotification as apiDeleteOne,
} from "../api";
import echo, { createEcho, reconnectEcho } from "../../../utils/echo";

// ============================================================
// HELPER: استخراج معرف المستخدم من أي شكل من أشكال الكائنات
// ============================================================
const extractUserId = (obj) => {
  if (!obj) return null;
  if (typeof obj === "number" || typeof obj === "string") return obj;
  return (
    obj.id ||
    obj.userId ||
    obj.user_id ||
    obj.user?.id ||
    obj.user?.userId ||
    obj.data?.id ||
    obj.data?.user?.id ||
    null
  );
};

const getStoredUserId = () => {
  try {
    for (const key of ["user", "currentUser", "admin", "auth_user"]) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const id = extractUserId(parsed);
        if (id) return id;
      }
    }
  } catch {
    // ignore
  }
  return null;
};

// ── Module-level dedup set (يعيش طول عمر الصفحة) ──────────
// يخزن IDs الإشعارات اللي اتعمل ليها toast في آخر 10 ثوانٍ
const shownToastIds = new Set();

const showPopupNotification = (title, body, dedupId) => {
  const key = dedupId
    ? String(dedupId)
    : `${title || ""}__${body || ""}`;

  // لو الإشعار ده اتعرض قريباً، اتجاهله نهائياً
  if (shownToastIds.has(key)) return;

  shownToastIds.add(key);
  // امسح بعد 10 ثوانٍ عشان يسمح بالإشعار التاني لو جه تاني
  setTimeout(() => shownToastIds.delete(key), 10_000);

  const displayTitle = title || "إشعار جديد";
  const displayBody  = body  || "";
  const message = displayBody
    ? `${displayTitle}\n${displayBody}`
    : displayTitle;

  // ألوان الـ Sidebar: أزرق داكن مع نص أبيض
  toast(message, {
    id: `notif-${key}`,
    icon: "🔔",
    duration: 2500,
    position: "top-right",
    style: {
      borderRadius: "10px",
      background: "#1c364f",          // نفس لون الـ Sidebar
      color: "#ffffff",               // نص أبيض
      padding: "12px 16px",
      fontSize: "13.5px",
      fontWeight: "500",
      lineHeight: "1.4",
      whiteSpace: "pre-line",
      boxShadow: "0 4px 20px rgba(28, 54, 79, 0.5)",
      border: "1px solid #2b4b68",    // حدود من لون الـ active item في الـ Sidebar
      maxWidth: "360px",
    },
  });
};

// ── Module-level subscription registry (StrictMode-safe) ─────────────────
// React StrictMode في dev بيعمل mount→unmount→remount، ده بيخلي
// الـ WebSocket يتعمله subscribe مرتين. الحل: نحتفظ بـ reference
// لكل subscription على مستوى الـ module (مش داخل الـ component).
// key = channelName string, value = { ch, handleNotification }
const activeSubscriptions = new Map();

// ============================================================
// HELPER: تحويل بيانات الـ API لـ format متوافق مع الـ UI
// ============================================================
const normalizeNotification = (apiNotif) => {
  const notifData = apiNotif?.notification || apiNotif?.data || apiNotif || {};

  const title =
    notifData.title || notifData.name || apiNotif?.title || apiNotif?.name || "Notification";

  const desc =
    notifData.body    || notifData.message || notifData.description || notifData.content ||
    apiNotif?.body    || apiNotif?.message || apiNotif?.description ||
    "";

  return {
    id: apiNotif?.id || Date.now().toString(),
    category: apiNotif?.type
      ? String(apiNotif.type).split("\\").pop().replace("Notification", "").toLowerCase()
      : "system",
    defaultTitle: title,
    defaultDesc: desc,
    isRead:
      apiNotif?.is_read ??
      (apiNotif?.read_at != null ? true : false),
    timestamp: apiNotif?.created_at || new Date().toISOString(),
    type: apiNotif?.type,
    readAt: apiNotif?.read_at,
    data: notifData,
    titleKey: null, descKey: null, badgeKey: null, defaultBadge: title,
    actionType: null, actionKey: null, defaultAction: null,
    initiatorKey: null, defaultInitiator: null,
    scopeKey: null, defaultScope: null,
    priorityKey: null, defaultPriority: null,
  };
};

// ============================================================
export const useNotifications = (currentUserId) => {
  const queryClient = useQueryClient();

  // knownIdsRef: يتذكر IDs الإشعارات اللي اتحملت أول مرة
  // عشان الـ polling ميعرضش toast لإشعارات قديمة
  const knownIdsRef = useRef(null);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const userId = extractUserId(currentUserId) || getStoredUserId();
  const notificationQueryKey = useMemo(
    () => ["notifications", userId, "list"],
    [userId],
  );
  const unreadCountQueryKey = useMemo(
    () => ["notifications", userId, "unreadCount"],
    [userId],
  );
  const knownUserIdRef = useRef(userId);

  // دالة اختبار في الكونسول: window.testNotif()
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.testNotif = (t = "تجربة", d = "إشعار تجريبي") =>
        showPopupNotification(t, d, `test-${Date.now()}`);
    }
  }, []);

  // ── Queries ─────────────────────────────────────────────
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: notificationQueryKey,
    queryFn: async () => {
      const res = await fetchNotifications(1, 100);
      const rawList =
        res?.data?.notifications ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : null) ||
        res?.notifications ||
        (Array.isArray(res) ? res : []);

      const list = (rawList || []).map(normalizeNotification);

      if (knownUserIdRef.current !== userId) {
        knownUserIdRef.current = userId;
        knownIdsRef.current = null;
      }

      // أول تحميل → سجل كل الـ IDs الموجودة كـ "معروفة" بدون toast
      if (knownIdsRef.current === null) {
        knownIdsRef.current = new Set(list.map((n) => String(n.id)));
      } else {
        // الـ polling: لو لقى إشعار مش موجود في القائمة المعروفة → toast
        for (const item of list) {
          const strId = String(item.id);
          if (!knownIdsRef.current.has(strId)) {
            knownIdsRef.current.add(strId);
            if (!item.isRead) {
              showPopupNotification(item.defaultTitle, item.defaultDesc, item.id);
            }
          }
        }
      }

      return list;
    },
    enabled: isAuthenticated,
    refetchInterval: 15_000,
    refetchOnWindowFocus: false,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: unreadCountQueryKey,
    queryFn: async () => {
      const res = await fetchUnreadCount();
      return (
        res?.data?.unread_count ??
        res?.data?.count ??
        res?.unread_count ??
        res?.count ??
        (typeof res?.data === "number" ? res.data : 0)
      );
    },
    enabled: isAuthenticated,
    refetchInterval: 15_000,
    refetchOnWindowFocus: false,
  });

  // ── Mutations ────────────────────────────────────────────
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey });
      const previousNotifications = queryClient.getQueryData(notificationQueryKey);
      const previousUnreadCount = queryClient.getQueryData(unreadCountQueryKey);
      queryClient.setQueryData(notificationQueryKey, (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      queryClient.setQueryData(unreadCountQueryKey, (old) =>
        Math.max(0, (old || 0) - 1)
      );
      return { previousNotifications, previousUnreadCount };
    },
    onError: (_e, _id, context) => {
      if (!context) return;
      queryClient.setQueryData(notificationQueryKey, context.previousNotifications);
      queryClient.setQueryData(unreadCountQueryKey, context.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey });
      const previousNotifications = queryClient.getQueryData(notificationQueryKey);
      const previousUnreadCount = queryClient.getQueryData(unreadCountQueryKey);
      queryClient.setQueryData(notificationQueryKey, (old) =>
        old?.map((n) => ({ ...n, isRead: true }))
      );
      queryClient.setQueryData(unreadCountQueryKey, 0);
      return { previousNotifications, previousUnreadCount };
    },
    onError: (_e, _v, context) => {
      if (!context) return;
      queryClient.setQueryData(notificationQueryKey, context.previousNotifications);
      queryClient.setQueryData(unreadCountQueryKey, context.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: apiClearAll,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey });
      queryClient.setQueryData(notificationQueryKey, []);
      queryClient.setQueryData(unreadCountQueryKey, 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const deleteOneMutation = useMutation({
    mutationFn: apiDeleteOne,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKey });
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey });
      const previousNotifications = queryClient.getQueryData(notificationQueryKey);
      const previousUnreadCount = queryClient.getQueryData(unreadCountQueryKey);
      queryClient.setQueryData(notificationQueryKey, (old) => {
        const target = old?.find((n) => n.id === id);
        if (target && !target.isRead) {
          queryClient.setQueryData(unreadCountQueryKey, (c) =>
            Math.max(0, (c || 0) - 1)
          );
        }
        return old?.filter((n) => n.id !== id);
      });
      return { previousNotifications, previousUnreadCount };
    },
    onError: (_e, _id, context) => {
      if (!context) return;
      queryClient.setQueryData(notificationQueryKey, context.previousNotifications);
      queryClient.setQueryData(unreadCountQueryKey, context.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  // ── Helpers ──────────────────────────────────────────────
  const markAsRead          = useCallback((id) => markAsReadMutation.mutateAsync(id),    [markAsReadMutation]);
  const markAllAsRead       = useCallback(() => markAllAsReadMutation.mutateAsync(),     [markAllAsReadMutation]);
  const clearAllNotifications = useCallback(() => clearAllMutation.mutateAsync(),        [clearAllMutation]);
  const clearNotification   = useCallback((id) => deleteOneMutation.mutateAsync(id),    [deleteOneMutation]);

  const toggleNotificationRead = useCallback(
    async (id) => {
      const notif = notifications.find((n) => n.id === id);
      if (!notif) return;
      if (!notif.isRead) {
        await markAsRead(id);
      } else {
        queryClient.setQueryData(notificationQueryKey, (old) =>
          old?.map((n) => (n.id === id ? { ...n, isRead: false } : n))
        );
        queryClient.setQueryData(unreadCountQueryKey, (c) => (c || 0) + 1);
      }
    },
    [notifications, markAsRead, queryClient, notificationQueryKey, unreadCountQueryKey]
  );

  // ── Real-time Echo Subscription (StrictMode-safe) ────────
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const activeEcho = window.Echo || echo || createEcho();
    if (!activeEcho) return;

    try { reconnectEcho(); } catch { /* ignore */ }

    const channelName = `notifications.${userId}`;

    // لو في subscription موجودة بالفعل لنفس الـ channel، مش هنعمل تانية
    // ده بيحمينا من React StrictMode double-mount في dev
    if (activeSubscriptions.has(channelName)) {
      console.log(`⚠️ [Reverb] Already subscribed → private-${channelName} (skipped)`);
      return () => {
        // الـ cleanup في الـ StrictMode unmount الأول: مش هنلغي الـ subscription
        // عشان الـ remount التاني هيلاقيها موجودة ويتخطاها
      };
    }

    const handleNotification = (notification) => {
      const normalized = normalizeNotification(notification);
      const dedupKey   = String(normalized.id);

      // أضف الـ ID لـ knownIdsRef عشان الـ polling ميعرضهاش تاني
      if (knownIdsRef.current) knownIdsRef.current.add(dedupKey);

      // أضفه للـ cache لو مش موجود
      queryClient.setQueryData(notificationQueryKey, (old) => {
        const list = Array.isArray(old) ? old : [];
        if (list.some((item) => String(item.id) === dedupKey)) return list;
        return [normalized, ...list];
      });

      // زوِّد العداد
      queryClient.setQueryData(unreadCountQueryKey, (old) => (old || 0) + 1);

      // أظهر الـ popup (دالة showPopupNotification نفسها بتتحكم في التكرار)
      showPopupNotification(normalized.defaultTitle, normalized.defaultDesc, dedupKey);
    };

    console.log(`🔔 [Reverb] Subscribing → private-${channelName}`);
    const ch = activeEcho.private(channelName);

    ch.subscribed(() => console.log(`✅ [Reverb] Subscribed → private-${channelName}`));
    ch.error((err) => console.error(`❌ [Reverb] Error → private-${channelName}:`, err));
    ch.notification(handleNotification);

    // سجل الـ subscription في الـ registry
    activeSubscriptions.set(channelName, { ch, handleNotification });

    return () => {
      // الـ cleanup الحقيقي: لو الـ userId اتغير أو الـ component اتشال فعلاً
      console.log(`🔕 [Reverb] Leaving → private-${channelName}`);
      activeSubscriptions.delete(channelName);
      try { activeEcho.leave(channelName); } catch { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId]);

  return {
    notifications,
    allNotifications: notifications,
    unreadCount,
    loading: isLoading,
    markAsRead,
    toggleNotificationRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    refreshNotifications: () =>
      queryClient.invalidateQueries({ queryKey: notificationQueryKey }),
  };
};
 