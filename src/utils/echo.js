import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axiosInstance from "./axiosInstance";

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const pusherKey =
  import.meta.env.VITE_REVERB_APP_KEY || "6kpnd1ngdjnarkabljfo";
const pusherHost =
  import.meta.env.VITE_REVERB_HOST ||
  "workwise-reverb-production.up.railway.app";
const pusherPort = import.meta.env.VITE_REVERB_PORT
  ? parseInt(import.meta.env.VITE_REVERB_PORT, 10)
  : 443;
const pusherScheme = import.meta.env.VITE_REVERB_SCHEME || "https";

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

export default echo;
