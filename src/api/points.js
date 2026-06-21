import axiosInstance from "./axiosInstance";

// 포인트 잔액 조회
export const getPointBalance = async () => {
  const response = await axiosInstance.get("/api/points/balance");
  return response.data; // { success, data: { balance } }
};

// 포인트 거래 내역 조회
export const getPointTransactions = async () => {
  const response = await axiosInstance.get("/api/points/transactions");
  return response.data; // { success, data: [{ amount, reason, balanceAfter }] }
};

// 출석 체크 (앱 진입 시 1번 호출)
export const checkAttendance = async () => {
  const response = await axiosInstance.post("/api/points/attendance");
  return response.data; // { success, data: { earnedToday, currentBalance } }
};
