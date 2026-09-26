import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axiosInstance from "./axiosInstance";

window.Pusher = Pusher;

// We need to fetch environment variables or fallback to defaults
const pusherKey = import.meta.env.VITE_REVERB_APP_KEY || "app-key";
const pusherHost = import.meta.env.VITE_REVERB_HOST || "localhost";
const pusherPort = import.meta.env.VITE_REVERB_PORT || 8080;
const pusherScheme = import.meta.env.VITE_REVERB_SCHEME || "http";

const echo = new Echo({
  broadcaster: "reverb",
  key: pusherKey,
  wsHost: pusherHost,
  wsPort: pusherPort ?? 80,
  wssPort: pusherPort ?? 443,
  forceTLS: pusherScheme === "https",
  enabledTransports: ["ws", "wss"],

  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        axiosInstance
          .post("/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  },
});

export default echo;
