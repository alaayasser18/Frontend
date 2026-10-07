import Echo from "laravel-echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

<<<<<<< HEAD
const pusherKey =
  import.meta.env.VITE_REVERB_APP_KEY || "6kpnd1ngdjnarkabljfo";
const pusherHost =
  import.meta.env.VITE_REVERB_HOST ||
  "workwise-reverb-production.up.railway.app";
=======
export const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
};

const pusherKey = import.meta.env.VITE_REVERB_APP_KEY;
const pusherHost = import.meta.env.VITE_REVERB_HOST;
>>>>>>> 6e4c0b25f8460a4c69b899c7b6443e5369faa2fc
const pusherPort = import.meta.env.VITE_REVERB_PORT
  ? parseInt(import.meta.env.VITE_REVERB_PORT, 10)
  : 443;
const pusherScheme = import.meta.env.VITE_REVERB_SCHEME || "https";

<<<<<<< HEAD
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://workwise-production-3941.up.railway.app";
const authUrl = `${apiBaseUrl.replace(/\/+$/, "")}/api/broadcasting/auth`;

let echo = null;

try {
  echo = new Echo({
    broadcaster: "reverb",
    key: pusherKey,
    wsHost: pusherHost,
    wsPort: pusherPort || 80,
    wssPort: pusherPort || 443,
    forceTLS: pusherScheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: authUrl,
    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        const token = localStorage.getItem("token");
        axiosInstance
          .post(
            "/broadcasting/auth",
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                Accept: "application/json",
              },
            }
          )
          .then((response) => {
            const authPayload =
              response.data?.data?.auth !== undefined
                ? response.data.data
                : response.data;
            callback(null, authPayload);
          })
          .catch((error) => {
            console.error(
              "Echo broadcasting authorization error:",
              error?.response?.data || error?.message
            );
            callback(error);
          });
      },
    }),
  });

  if (typeof window !== "undefined") {
    window.Echo = echo;

    if (echo.connector?.pusher?.connection) {
      echo.connector.pusher.connection.bind("connected", () => {
        console.log("⚡ [Laravel Reverb] WebSocket connected successfully!");
      });
      echo.connector.pusher.connection.bind("error", (err) => {
        console.warn("⚠️ [Laravel Reverb] WebSocket connection warning:", err);
      });
    }
  }
} catch (e) {
  console.error("Failed to initialize Laravel Echo:", e);
}
=======
const rawApiBase =
  import.meta.env.VITE_API_BASE_URL ||
  "https://workwise-production-3941.up.railway.app";
const cleanApiBase = (rawApiBase || "").trim().replace(/\/+$/, "");
const authEndpoint = cleanApiBase.endsWith("/api")
  ? `${cleanApiBase}/broadcasting/auth`
  : `${cleanApiBase}/api/broadcasting/auth`;

export const createEcho = () => {
  if (typeof window === "undefined") return null;

  if (!pusherKey || !pusherHost) {
    console.warn("⚠️ Reverb credentials missing in environment variables.");
    return null;
  }

  const echo = new Echo({
    broadcaster: "reverb",
    key: pusherKey,
    wsHost: pusherHost,
    wsPort: pusherPort || 443,
    wssPort: pusherPort || 443,
    forceTLS: pusherScheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint,
    auth: {
      headers: {
        get Authorization() {
          const t = getAuthToken();
          return t ? `Bearer ${t}` : "";
        },
        Accept: "application/json",
      },
    },
  });

  window.Echo = echo;
  return echo;
};

const echo = createEcho();

export const disconnectEcho = () => {
  if (typeof window !== "undefined" && window.Echo) {
    try {
      window.Echo.disconnect();
      console.log("🔌 Echo disconnected");
    } catch (e) {
      console.warn("Error disconnecting Echo:", e);
    }
  }
};

export const reconnectEcho = () => {
  if (typeof window !== "undefined") {
    const token = getAuthToken();
    if (window.Echo) {
      try {
        if (window.Echo.connector?.options?.auth?.headers) {
          window.Echo.connector.options.auth.headers.Authorization = token ? `Bearer ${token}` : "";
        }
        if (window.Echo.connector?.pusher?.config?.auth?.headers) {
          window.Echo.connector.pusher.config.auth.headers.Authorization = token ? `Bearer ${token}` : "";
        }
        window.Echo.connect();
        console.log("⚡ Echo reconnected");
      } catch (e) {
        console.warn("Error reconnecting Echo:", e);
      }
    } else {
      createEcho();
    }
  }
};
>>>>>>> 6e4c0b25f8460a4c69b899c7b6443e5369faa2fc

export default echo;
