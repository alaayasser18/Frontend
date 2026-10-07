import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axiosInstance from "./axiosInstance";

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const pusherKey = import.meta.env.VITE_REVERB_APP_KEY;
const pusherHost = import.meta.env.VITE_REVERB_HOST;
const pusherPort = import.meta.env.VITE_REVERB_PORT
  ? parseInt(import.meta.env.VITE_REVERB_PORT, 10)
  : 443;
const pusherScheme = import.meta.env.VITE_REVERB_SCHEME || "https";

const hasReverbConfig = Boolean(pusherKey && pusherHost);

const echo = hasReverbConfig
  ? new Echo({
      broadcaster: "reverb",
      key: pusherKey,
      wsHost: pusherHost,
      wsPort: pusherPort || 80,
      wssPort: pusherPort || 443,
      forceTLS: pusherScheme === "https",
      enabledTransports: ["ws", "wss"],
      authorizer: (channel) => ({
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
      }),
    })
  : null;

if (typeof window !== "undefined") {
  window.Echo = echo;
}

export default echo;
