// export const BASE_URL = "https://peerconnectapp.onrender.com";

export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://peerconnectapp.onrender.com";
