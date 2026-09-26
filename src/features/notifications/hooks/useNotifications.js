import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications as apiClearAll,
} from "../api";
import echo from "../../../utils/echo";

// ============================================================
// HELPER: تحويل بيانات الـ API لـ format متوافق مع الـ UI
// ============================================================
const normalizeNotification = (apiNotif) => ({
  id: apiNotif.id,
  category: apiNotif.type
    ? apiNotif.type.split("\\").pop().replace("Notification", "").toLowerCase()
    : "system",
  defaultTitle: apiNotif.data?.title || apiNotif.title || "Notification",
  defaultDesc: apiNotif.data?.body || apiNotif.body || "",
  isRead: apiNotif.is_read ?? false,
  timestamp: apiNotif.created_at || new Date().toISOString(),
  type: apiNotif.type,
  readAt: apiNotif.read_at,
  data: apiNotif.data,
  titleKey: null,
  descKey: null,
  badgeKey: null,
  defaultBadge: apiNotif.data?.title || apiNotif.title || "Notification",
  actionType: null,
  actionKey: null,
  defaultAction: null,
  initiatorKey: null,
  defaultInitiator: null,
  scopeKey: null,
  defaultScope: null,
  priorityKey: null,
  defaultPriority: null,
});

export const useNotifications = (currentUserId) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // ── Queries ───────────────────────────────────────────────
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetchNotifications(1, 100);
      return (res?.data?.data || []).map(normalizeNotification);
    },
    enabled: isAuthenticated,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: async () => {
      const res = await fetchUnreadCount();
      return res?.data?.unread_count || 0;
    },
    enabled: isAuthenticated,
  });

  // ── Mutations ─────────────────────────────────────────────
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["notifications", "unreadCount"] });

      const previousNotifications = queryClient.getQueryData(["notifications"]);
      const previousUnreadCount = queryClient.getQueryData(["notifications", "unreadCount"]);

      queryClient.setQueryData(["notifications"], (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      queryClient.setQueryData(["notifications", "unreadCount"], (old) => Math.max(0, (old || 0) - 1));

      return { previousNotifications, previousUnreadCount };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["notifications"], context.previousNotifications);
      queryClient.setQueryData(["notifications", "unreadCount"], context.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["notifications", "unreadCount"] });

      const previousNotifications = queryClient.getQueryData(["notifications"]);
      const previousUnreadCount = queryClient.getQueryData(["notifications", "unreadCount"]);

      queryClient.setQueryData(["notifications"], (old) =>
        old?.map((n) => ({ ...n, isRead: true }))
      );
      queryClient.setQueryData(["notifications", "unreadCount"], 0);

      return { previousNotifications, previousUnreadCount };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["notifications"], context.previousNotifications);
      queryClient.setQueryData(["notifications", "unreadCount"], context.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: apiClearAll,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      await queryClient.cancelQueries({ queryKey: ["notifications", "unreadCount"] });

      queryClient.setQueryData(["notifications"], []);
      queryClient.setQueryData(["notifications", "unreadCount"], 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    },
  });

  // ── Functions ─────────────────────────────────────────────
  const markAsRead = useCallback((id) => markAsReadMutation.mutateAsync(id), [markAsReadMutation]);
  const markAllAsRead = useCallback(() => markAllAsReadMutation.mutateAsync(), [markAllAsReadMutation]);
  const clearAllNotifications = useCallback(() => clearAllMutation.mutateAsync(), [clearAllMutation]);
  
  const clearNotification = useCallback((id) => {
    queryClient.setQueryData(["notifications"], (old) => {
      const target = old?.find((n) => n.id === id);
      if (target && !target.isRead) {
        queryClient.setQueryData(["notifications", "unreadCount"], (count) => Math.max(0, (count || 0) - 1));
      }
      return old?.filter((n) => n.id !== id);
    });
  }, [queryClient]);

  const toggleNotificationRead = useCallback(async (id) => {
    const notif = notifications.find((n) => n.id === id);
    if (!notif) return;
    if (!notif.isRead) {
      await markAsRead(id);
    } else {
      queryClient.setQueryData(["notifications"], (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      queryClient.setQueryData(["notifications", "unreadCount"], (count) => (count || 0) + 1);
    }
  }, [notifications, markAsRead, queryClient]);

  // ── Real-time Laravel Echo Subscription ───────────────────
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      const channelName = `notifications.${currentUserId}`;
      const channel = echo.private(channelName);

      channel.notification((notification) => {
        const normalized = normalizeNotification(notification);
        
        queryClient.setQueryData(["notifications"], (old) => [normalized, ...(old || [])]);
        queryClient.setQueryData(["notifications", "unreadCount"], (old) => (old || 0) + 1);

        toast(normalized.defaultTitle, {
          icon: "🔔",
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#102a43",
          },
        });
      });

      return () => {
        echo.leave(channelName);
      };
    }
  }, [isAuthenticated, currentUserId, queryClient]);

  return {
    notifications,
    allNotifications: notifications,
    unreadCount,
    loading,
    markAsRead,
    toggleNotificationRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    refreshNotifications: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  };
};
