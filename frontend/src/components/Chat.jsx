import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchChatMessages = async () => {
    const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text, createdAt } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
        createdAt,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto m-4 h-[80vh] flex flex-col border rounded-lg border-gray-300 bg-white shadow-sm">
      <h1 className="p-4 text-lg font-semibold border-b border-gray-300 bg-gray-100 text-gray-800">
        Chat
      </h1>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              user.firstName === msg.firstName ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header text-gray-700">
              {msg.firstName} {msg.lastName}
              <time className="text-xs pl-1 text-gray-400">
                {msg.createdAt
                  ? formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    })
                  : "just now"}
              </time>
            </div>
            <div
              className={`chat-bubble ${
                user.firstName === msg.firstName
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </div>
            <div className="chat-footer text-xs text-gray-500">Seen</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-300 bg-white flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
