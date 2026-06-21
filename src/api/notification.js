import axiosInstance from "./axiosInstance";

// 알림 목록 조회
export const getNotifications = async () => {
  const response = await axiosInstance.get("/api/notifications");
  return response.data; // { success, data: [{ notificationId, type, refId, isRead, createdAt }] }
};

// 안 읽은 알림 수 조회 (벨 배지용)
export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/api/notifications/unread-count");
  return response.data; // { success, data: { count } }
};

// 읽음 처리
export const markNotificationRead = async (notificationId) => {
  const response = await axiosInstance.patch(
    `/api/notifications/${notificationId}/read`,
  );
  return response.data;
};
