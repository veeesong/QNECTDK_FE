import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import backIcon from "../assets/icon-back.png";
import { getNotifications, markNotificationRead } from "../api/notification";

// type에 따라 메시지 텍스트 변환
const getNotificationMessage = (type) => {
  switch (type) {
    case "FRIEND_ADD":
      return "새로운 친구가 추가되었습니다!";
    case "DAILY_QUIZ":
      return "오늘의 퀴즈가 생성되었습니다.\n지금 바로 풀어보세요!";
    case "QUIZ_REMIND":
      return "30일 전에 추가한 친구의 퀴즈를 풀어보세요!";
    default:
      return "새로운 알림이 있습니다.";
  }
};

// type에 따라 이동할 경로 결정
const getNotificationPath = (type, refId) => {
  switch (type) {
    case "FRIEND_ADD":
      return "/friend-list";
    case "DAILY_QUIZ":
      return "/home";
    case "QUIZ_REMIND":
      return "/home";
    default:
      return "/home";
  }
};

// createdAt을 "MM/DD HH:mm" 형식으로 변환
const formatDate = (createdAt) => {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
};

function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("알림 목록 불러오기 실패", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId, type, refId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      // 읽음 처리 후 해당 페이지로 이동
      navigate(getNotificationPath(type, refId));
    } catch (err) {
      console.error("읽음 처리 실패", err);
    }
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
        {isLoading ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>
            불러오는 중...
          </p>
        ) : visibleNotifications.length === 0 ? (
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
        ) : (
          visibleNotifications.map((n) => (
            <div
              key={n.notificationId}
              onClick={() =>
                !n.isRead && markAsRead(n.notificationId, n.type, n.refId)
              }
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
                {getNotificationMessage(n.type)}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: n.isRead ? "#ccc" : "#aaa",
                  textAlign: "left",
                }}
              >
                {formatDate(n.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}

export default Notification;
