import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";

// 알림 mock 데이터 (실제 데이터로 교체 필요)
// isRead: false면 안읽은 알림, true면 읽은 알림
const initialNotifications = [
  {
    id: 1,
    message: "새로운 친구가 1명 추가되었습니다!",
    date: "06/05 18:34",
    isRead: true,
  },
  {
    id: 2,
    message: "오늘의 퀴즈가 생성되었습니다.\n지금 바로 풀어보세요!",
    date: "06/02 10:36",
    isRead: false,
  },
  {
    id: 3,
    message: "새로운 친구가 2명 추가되었습니다!",
    date: "06/01 18:41",
    isRead: true,
  },
  {
    id: 4,
    message: "새로운 친구가 1명 추가되었습니다!",
    date: "06/01 10:29",
    isRead: false,
  },
  {
    id: 5,
    message: "새로운 친구가 1명 추가되었습니다!",
    date: "05/29 13:29",
    isRead: false,
  },
  {
    id: 6,
    message: "새로운 친구가 1명 추가되었습니다!",
    date: "05/29 10:15",
    isRead: false,
  },
];

function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "unread"

  // 안읽은 알림 클릭 시 읽음 처리
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const visibleNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => !n.isRead);

  return (
    <PageLayout>
      {/* 헤더 */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 0",
        }}
      >
        <img
          src={backIcon}
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: 0,
            width: "20px",
            cursor: "pointer",
          }}
        />
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>알림</span>
      </div>

      {/* 탭 */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #eee",
          marginBottom: "20px",
        }}
      >
        <div
          onClick={() => setActiveTab("all")}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px 0",
            fontWeight: activeTab === "all" ? "bold" : "normal",
            color: activeTab === "all" ? "var(--color-primary)" : "#888",
            borderBottom:
              activeTab === "all" ? "2px solid var(--color-primary)" : "none",
            cursor: "pointer",
          }}
        >
          모든 알림
        </div>
        <div
          onClick={() => setActiveTab("unread")}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px 0",
            fontWeight: activeTab === "unread" ? "bold" : "normal",
            color: activeTab === "unread" ? "var(--color-primary)" : "#888",
            borderBottom:
              activeTab === "unread"
                ? "2px solid var(--color-primary)"
                : "none",
            cursor: "pointer",
          }}
        >
          안읽은 알림
        </div>
      </div>

      {/* 알림 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {visibleNotifications.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#aaa",
              fontSize: "14px",
              marginTop: "40px",
            }}
          >
            알림이 없습니다.
          </p>
        )}

        {visibleNotifications.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.isRead && markAsRead(n.id)}
            style={{
              borderRadius: "16px",
              padding: "16px",
              backgroundColor: n.isRead ? "white" : "#FFF1EC",
              border: n.isRead ? "1px solid #eee" : "1px solid #FFBC92",
              cursor: n.isRead ? "default" : "pointer",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "14px",
                fontWeight: "bold",
                color: n.isRead ? "#999" : "#333",
                whiteSpace: "pre-line",
                lineHeight: "1.4",
                textAlign: "left",
              }}
            >
              {n.message}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: n.isRead ? "#ccc" : "#aaa",
                textAlign: "left",
              }}
            >
              {n.date}
            </p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default Notification;
