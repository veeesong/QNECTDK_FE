import axiosInstance from "./axiosInstance";

// 포인트 잔액 조회
// 응답: { balance }
export const getPointBalance = async () => {
  const response = await axiosInstance.get("/api/points/balance");
  return response.data;
};

// 포인트 거래 내역 조회
// 응답: [{ amount, reason, balanceAfter }] — amount: +적립 / -차감
export const getPointTransactions = async () => {
  const response = await axiosInstance.get("/api/points/transactions");
  return response.data;
};

// 출석 체크 — 앱 진입 시 1번 호출, 하루 1회 5P
// 응답: { earnedToday, currentBalance } — 이미 했으면 earnedToday: false
export const checkAttendance = async () => {
  const response = await axiosInstance.post("/api/points/attendance");
  return response.data;
};
