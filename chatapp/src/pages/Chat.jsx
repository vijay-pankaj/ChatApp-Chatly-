import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import { getAllUsers, getChatHistory } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Chat() {
  const { user, setUser } = useContext(AuthContext);
  const socket = getSocket();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [msg, setMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("register", String(user.id));

    socket.on("receive_private_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_private_message");
  }, [socket, user]);

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data.filter((u) => u.id !== user?.id)))
      .catch(() => toast.error("Failed to load users."));
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeUser) return;
    setMessages([]);
    setLoadingHistory(true);
    getChatHistory(activeUser.id)
      .then((res) => setMessages(res.data))
      .catch(() => toast.error("Failed to load chat history."))
      .finally(() => setLoadingHistory(false));
  }, [activeUser]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const sendMessage = () => {
    if (!activeUser || !msg.trim()) return;
    socket.emit("private_message", {
      to: Number(activeUser.id),
      from: Number(user.id),
      message: msg.trim(),
    });
    setMsg("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    { bg: "bg-blue-50", text: "text-blue-700" },
    { bg: "bg-green-50", text: "text-green-700" },
    { bg: "bg-pink-50", text: "text-pink-700" },
    { bg: "bg-amber-50", text: "text-amber-700" },
    { bg: "bg-teal-50", text: "text-teal-700" },
  ];

  const getColor = (id) => avatarColors[id % avatarColors.length];

  const formatDivider = (dateStr) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Please login first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center p-4">
      <div className="w-full h-[calc(100vh-2rem)] max-h-[700px] bg-white border border-gray-200 rounded-2xl overflow-hidden flex">

        {/* ── Sidebar ── */}
        <div className="w-[260px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">

          {/* Header */}
          <div className="px-4 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#185FA5] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
                  <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
                    fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-gray-900">Chatly</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[12px] font-medium text-blue-700">
              {getInitials(user.name)}
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2.5 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 h-8">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 w-full"
              />
            </div>
          </div>

          {/* Contacts list */}
          <div className="flex-1 overflow-y-auto">
            <p className="px-3.5 pt-3 pb-1 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
              Messages
            </p>
            {filteredUsers.length === 0 && (
              <p className="px-4 py-3 text-[13px] text-gray-400">No users found</p>
            )}
            {filteredUsers.map((u) => {
              const color = getColor(u.id);
              const isActive = activeUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => setActiveUser(u)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0 ${color.bg} ${color.text}`}>
                    {getInitials(u.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{u.name}</p>
                    <p className="text-[12px] text-gray-500 truncate">Tap to message</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current user footer with logout */}
          <div className="px-3 py-3 border-t border-gray-200 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#185FA5] flex items-center justify-center text-[12px] font-medium text-white flex-shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-[11px] text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Online
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors group flex-shrink-0"
            >
              <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        {activeUser ? (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat header */}
            <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0 ${getColor(activeUser.id).bg} ${getColor(activeUser.id).text}`}>
                {getInitials(activeUser.name)}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-gray-900">{activeUser.name}</p>
                <p className="text-[12px] text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Online
                </p>
              </div>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F7F8FA] flex flex-col gap-3">

              {/* Loading skeleton */}
              {loadingHistory && (
                <div className="flex flex-col gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`flex gap-2 max-w-[60%] ${i % 2 === 0 ? "self-start" : "self-end flex-row-reverse"}`}>
                      <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse flex-shrink-0 self-end" />
                      <div className={`h-9 rounded-2xl bg-gray-200 animate-pulse ${i % 2 === 0 ? "w-48" : "w-36"}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loadingHistory && messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-medium ${getColor(activeUser.id).bg} ${getColor(activeUser.id).text}`}>
                      {getInitials(activeUser.name)}
                    </div>
                    <p className="text-[14px] font-medium text-gray-700">{activeUser.name}</p>
                    <p className="text-[13px] text-gray-400 mt-1">No messages yet — say hello!</p>
                  </div>
                </div>
              )}

              {/* Message list */}
              {!loadingHistory && messages.map((m, i) => {
                const isSent = String(m.senderId) === String(user.id);
                const currentDate = new Date(m.createdAt).toDateString();
                const prevDate = i > 0 ? new Date(messages[i - 1].createdAt).toDateString() : null;
                const showDivider = currentDate !== prevDate;

                return (
                  <div key={m.id || i} className="flex flex-col">
                    {showDivider && (
                      <div className="flex items-center gap-2 my-2">
                        <span className="flex-1 h-px bg-gray-200" />
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {formatDivider(currentDate)}
                        </span>
                        <span className="flex-1 h-px bg-gray-200" />
                      </div>
                    )}
                    <div className={`flex gap-2 max-w-[70%] ${isSent ? "self-end flex-row-reverse" : "self-start"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 self-end ${
                        isSent ? "bg-[#185FA5] text-white" : `${getColor(activeUser.id).bg} ${getColor(activeUser.id).text}`
                      }`}>
                        {isSent ? getInitials(user.name) : getInitials(activeUser.name)}
                      </div>
                      <div>
                        <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                          isSent
                            ? "bg-[#185FA5] text-white rounded-2xl rounded-br-sm"
                            : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-sm"
                        }`}>
                          {m.message}
                        </div>
                        <p className={`text-[11px] text-gray-400 mt-1 ${isSent ? "text-right" : ""}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2.5">
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 h-11">
                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activeUser.name}...`}
                  className="flex-1 bg-transparent text-[13px] text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!msg.trim()}
                className="w-11 h-11 bg-[#185FA5] hover:bg-[#0C447C] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>

        ) : (
          /* Empty state — no conversation selected */
          <div className="flex-1 flex items-center justify-center bg-[#F7F8FA]">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#185FA5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-[15px] font-medium text-gray-700">Your messages</p>
              <p className="text-[13px] text-gray-400 mt-1">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}