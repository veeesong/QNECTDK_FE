import axiosInstance from "./axiosInstance";

// 오늘의 데일리 질문 + 내 답변 상태 조회
// 응답: { success, data: { dailyQuizId, quizDate, content, optionA, optionB, answered, mySelection } }
// answered가 false면 아직 안 답한 상태 (이때 mySelection은 의미 없음)
export const getTodayQuiz = async () => {
  const response = await axiosInstance.get("/api/daily/today");
  return response.data;
};

// 오늘의 데일리에 답변 제출 (1인 1회)
// 요청: { selected: "A" | "B" }
// 제출 성공 시 통계까지 함께 반환됨 (getDailyStats와 동일한 데이터 구조)
export const submitTodayAnswer = async (selected) => {
  const response = await axiosInstance.post("/api/daily/today/answer", {
    selected,
  });
  return response.data;
};

// 오늘의 데일리 통계 조회
// 주의: 본인이 먼저 답변하지 않았으면 403 에러가 남
// 응답: { success, data: { dailyQuizId, overall: {...}, friends: { ..., selections: [{userId, name, selected}] } } }
export const getDailyStats = async () => {
  const response = await axiosInstance.get("/api/daily/today/stats");
  return response.data;
};
