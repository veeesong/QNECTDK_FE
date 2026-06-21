import axiosInstance from "./axiosInstance";

// 친구 퀴즈 목록 조회 (친구별 hasQuiz/totalQuestions/attempted/score)
// 활성 퀴즈 없는 친구도 hasQuiz: false로 포함되어 옴
export const getFriendsQuizzes = async () => {
  const response = await axiosInstance.get("/api/quizzes/friends");
  return response.data;
};

// 홈 '이 사람을 기억하나요?' 리마인드 카드 조회 (대상 없으면 data: null)
export const getTodayReminder = async () => {
  const response = await axiosInstance.get("/api/quizzes/reminders/today");
  return response.data;
};

// 내 퀴즈 조회 (없으면 404 QUIZ_NOT_FOUND)
export const getMyQuiz = async () => {
  const response = await axiosInstance.get("/api/quizzes/me");
  return response.data;
};

// 내 퀴즈 저장 (전체 교체, 문항 3~5개)
export const updateMyQuiz = async (questions) => {
  const response = await axiosInstance.put("/api/quizzes/me", {
    questions,
  });
  return response.data;
};

// AI 문제 초안 생성 (저장 안 됨, 화면에서 편집 후 updateMyQuiz로 저장)
export const generateQuizDraft = async (quizType = "FIRST_MEET", count = 3) => {
  const response = await axiosInstance.post("/api/quizzes/me/generate", null, {
    params: { arg1: quizType, arg2: count },
  });
  return response.data;
};

// 친구 퀴즈 조회 (정답 미포함, 내 프로필 미완성 시 solvable: false)
export const getFriendQuiz = async (ownerId) => {
  const response = await axiosInstance.get(`/api/quizzes/owner/${ownerId}`);
  return response.data;
};

// 답 제출 + 채점
export const submitQuizAttempt = async (ownerId, answers) => {
  const response = await axiosInstance.post(
    `/api/quizzes/owner/${ownerId}/attempts`,
    { answers },
  );
  return response.data;
};

// 응시 결과 조회
export const getQuizAttempt = async (attemptId) => {
  const response = await axiosInstance.get(
    `/api/quizzes/attempts/${attemptId}`,
  );
  return response.data;
};
