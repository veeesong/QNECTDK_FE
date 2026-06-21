import axiosInstance from "./axiosInstance";

// 알림 목록 조회
// 응답: [{ notificationId, type, refId, isRead, createdAt }]
// type: FRIEND_ADD(refId=userId) / DAILY_QUIZ(refId=퀴즈id) / QUIZ_REMIND(refId=퀴즈id)
export const getNotifications = async () => {
  const response = await axiosInstance.get("/api/notifications");
  return response.data;
};

// 안 읽은 알림 수 조회 — 벨 배지용
// 응답: { count }
export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/api/notifications/unread-count");
  return response.data;
};

// 읽음 처리
export const markNotificationRead = async (notificationId) => {
  const response = await axiosInstance.patch(
    `/api/notifications/${notificationId}/read`,
  );
  return response.data;
};
