import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axiosInstance from "./axiosInstance";

window.Pusher = Pusher;

const pusherKey = import.meta.env.VITE_REVERB_APP_KEY;
const pusherHost = import.meta.env.VITE_REVERB_HOST;
const pusherPort = Number(import.meta.env.VITE_REVERB_PORT);
const pusherScheme = import.meta.env.VITE_REVERB_SCHEME;

const hasReverbConfig =
  Boolean(pusherKey && pusherHost && pusherScheme) &&
  Number.isInteger(pusherPort) &&
  pusherPort > 0;

const echo = hasReverbConfig
  ? new Echo({
      broadcaster: "reverb",
      key: pusherKey,
      wsHost: pusherHost,
      wsPort: pusherPort,
      wssPort: pusherPort,
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

export default echo;
